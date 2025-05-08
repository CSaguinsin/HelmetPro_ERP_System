import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Check for custom auth token in cookies or headers
  const customAuthToken = req.cookies.get('auth_token')?.value || req.headers.get('x-auth-token')
  
  // If we have a custom auth token, we consider the user authenticated
  if (customAuthToken === 'authenticated') {
    // User is authenticated with custom auth
    if (req.nextUrl.pathname === '/') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
    
    return res
  }
  
  // If no custom auth, fall back to Supabase Auth but handle it carefully to avoid JWT errors
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return req.cookies.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            res.cookies.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            res.cookies.set({ name, value: '', ...options })
          },
        },
      }
    )

    // Try to get the session, but catch any JWT errors
    const { data } = await supabase.auth.getSession()
    const isAuthenticated = !!data?.session?.user || customAuthToken === 'authenticated'

    // If user is authenticated and on the login page ("/"), send to dashboard
    if (isAuthenticated && req.nextUrl.pathname === '/') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // If user is NOT authenticated and tries to access "/dashboard", send them to login page
    if (!isAuthenticated && req.nextUrl.pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/', req.url))
    }
  } catch (error) {
    console.error("Auth error in middleware:", error);
    
    // If there's an error with Supabase auth, check if we're trying to access protected routes
    if (req.nextUrl.pathname.startsWith('/dashboard')) {
      // Redirect to login if trying to access protected routes
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  return res
}

// Only run middleware on specific paths - include all dashboard routes
export const config = {
  matcher: ['/', '/dashboard/:path*', '/dashboard/(basic-config)/:path*', '/dashboard/(system-management)/:path*']
}
