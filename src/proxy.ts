import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/api/tasks',
  '/api/quotes',
  '/api/embeddings',
];

// Public routes that don't require authentication
const publicRoutes = [
  '/auth/login',
  '/auth/register',
  '/api/auth',
  '/api/share/', // Share API endpoints - public
  '/s/', // Share links remain public
];



export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Handle share links /s/{id} - these remain public
  if (pathname.startsWith('/s/') && pathname.length > 3) {
    return NextResponse.next();
  }

  // Allow public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Allow static files and Next.js internal routes
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const { createServerClient, parseCookieHeader } = await import('@supabase/ssr');

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          // Note: Middleware cannot set cookies on the request for the *current* render effectively for server components downstream
          // without creating a response, but for auth check here it works.
          // To persist, we usually need to copy these to the response.
          // But strict auth blocking happens *before* response.
          // For Supabase generic middleware:
          cookiesToSet.forEach(({ name, value, options }) => {
            // This is purely for the internal supabase client to know about the cookies during this request
            // if we were doing more than just getUser.
          })
        },
      },
    }
  );

  // Refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const { data: { user } } = await supabase.auth.getUser();

  // Protect routes
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!user) {


      const url = request.nextUrl.clone();
      url.pathname = '/auth/login';
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
  }

  // Optional: Redirect to dashboard if logged in and visiting login/register
  // Optional: Redirect to dashboard if logged in and visiting login/register
  // Note: We no longer redirect from '/' so authenticated users can see the landing page
  if (user && (pathname === '/auth/login' || pathname === '/auth/register')) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - api/share (share API routes - public)
     * - s/ (share pages - public)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - manifest.json (PWA manifest)
     * - public folder
     */
    '/((?!api/auth|api/share/|s/|_next/static|_next/image|favicon.ico|manifest.json|public/).*)',
  ],
};
