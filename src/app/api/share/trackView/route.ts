import { NextRequest, NextResponse } from 'next/server';
import { trackView } from '@/lib/supabase-storage';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'Missing share ID' }, { status: 400 });
    }
    
    await trackView(id);
    
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error('[Share TrackView Error]', error);
    return NextResponse.json({ ok: true }); // Don't fail on tracking errors
  }
}
