import { NextRequest, NextResponse } from 'next/server';
import { ModelFallbackManager, GeminiModel } from '@/ai/utils/gemini-models';
import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Lazy-load admin client to prevent build-time failures
let supabaseAdminInstance: SupabaseClient | null = null;

function getSupabaseAdmin(): SupabaseClient {
  if (!supabaseAdminInstance) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      throw new Error('Supabase env missing for admin client');
    }

    supabaseAdminInstance = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      }
    });
  }
  return supabaseAdminInstance;
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate User (Secure)
    const cookieStore = await cookies();
    let user = null;
    let authErrorDetails = '';

    // A. Try Standard Supabase SSR (Cookies)
    const supabaseUser = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) { /* Cookies are handled by Middleware usually */ }
        }
      }
    );
    const { data: { user: cookieUser }, error: cookieError } = await supabaseUser.auth.getUser();

    if (cookieUser) {
      user = cookieUser;
    } else {
      authErrorDetails += `Cookie Auth failed (${cookieError?.message}). `;

      // B. Try Authorization Header (Bearer Token)
      const authHeader = req.headers.get('authorization');
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        const { data: { user: headerUser }, error: headerError } = await supabaseUser.auth.getUser(token);
        if (headerUser) {
          user = headerUser;
        } else {
          authErrorDetails += `Header Auth failed (${headerError?.message}). `;
        }
      }
    }

    if (!user) {
      // Debug log (server-side)
      console.warn(`[AI Proxy] Auth Failed. ${authErrorDetails}`);
      // return 401
      return NextResponse.json(
        { error: `Unauthorized: Please sign in to use AI features. Details: ${authErrorDetails}` },
        { status: 401 }
      );
    }

    // 2. Check Daily Quota (12 Requests/Day) - Enforce only in Production
    // In development mode, we ignore the limit to allow testing.
    if (process.env.NODE_ENV !== 'development') {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      // Efficiently count usage for today
      const { count, error: quotaError } = await getSupabaseAdmin()
        .from('ai_usage_logs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', startOfDay.toISOString());

      if (quotaError) {
        console.error('Quota check failed:', quotaError);
        // Fail open (allow request) but log error to finding bugs
      } else {
        const DAILY_LIMIT = 12; // Validated safe for 1500 RPD
        if (count !== null && count >= DAILY_LIMIT) {
          return NextResponse.json(
            {
              error: 'Hạn mức AI trong ngày đã hết (12/12). Vui lòng quay lại vào ngày mai hoặc nâng cấp gói.'
            },
            { status: 429 }
          );
        }
      }
    } else {
      console.log('🚧 Dev Mode: Skipping Daily Quota Limit check');
    }

    // 3. Process Request
    const { messages, model: requestedModel } = await req.json();
    const apiKey = process.env.GOOGLE_GENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'Server API key not configured' }, { status: 500 });
    }

    // Priority Model Chain: 2.5 Flash (Production) -> 2.5 Flash Lite -> 1.5 Models
    const models = [
      requestedModel,
      'gemini-2.5-flash',     // Primary (High Performance/Cost)
      'gemini-2.5-flash-lite', // Secondary (Low Cost)
      'gemini-1.5-flash',     // Legacy Backup
      'gemini-2.0-flash-exp', // Experimental Backup
    ].filter(Boolean) as string[];

    // Deduplicate models
    const uniqueModels = [...new Set(models)];

    let lastError = null;

    for (const model of uniqueModels) {
      try {
        console.log(`[AI Proxy] Trying model: ${model} for user ${user.email}`);

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: messages }),
          }
        );

        if (!res.ok) {
          const txt = await res.text();
          console.error(`[AI Proxy] Error using model ${model}: ${res.status} ${res.statusText}`);

          if (res.status === 429) {
            console.warn(`[AI Proxy] Rate limit 429 on ${model}. Warning user or retrying.`);
            await new Promise(resolve => setTimeout(resolve, 2000));
          }

          if (res.status === 404 || res.status === 400 || res.status === 429 || res.status >= 500) {
            lastError = { status: res.status, message: txt };
            continue;
          }

          return new NextResponse(txt, { status: res.status });
        }

        const data = await res.json();

        // 4. Log Success Usage
        getSupabaseAdmin().from('ai_usage_logs').insert({
          user_id: user.id,
          model: model,
          tokens_in: 0,
          tokens_out: 0
        }).then(({ error }) => {
          if (error) console.error('Failed to log AI usage:', error);
        });

        return NextResponse.json(data);

      } catch (error: any) {
        console.error(`[AI Proxy] Exception with model ${model}:`, error);
        lastError = { status: 500, message: error.message };
        continue;
      }
    }

    return NextResponse.json(
      { error: `All AI models failed. Last error: ${lastError?.message}` },
      { status: lastError?.status || 500 }
    );

  } catch (error: any) {
    console.error('[AI Proxy] Internal Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
