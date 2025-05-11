import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function validateFallbackToken(tokenStr: string): boolean {
  try {
    const token = JSON.parse(atob(tokenStr));
    // Simple validation: check that required fields exist and token is not expired (7 days)
    return (
      token.user_id && 
      token.user_client_id && 
      token.email && 
      token.timestamp && 
      token.sig &&
      (Date.now() - token.timestamp < 7 * 24 * 60 * 60 * 1000)
    );
  } catch (e) {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Check for auth token in cookies or headers
  const authToken = req.cookies.get('auth_token')?.value || req.headers.get('x-auth-token')
  
  let isAuthenticated = false;

  if (authToken) {
    // Process based on token format
    if (authToken.includes('.')) {
      // Looks like a JWT (Supabase token), will be validated by Supabase below
      // Don't need to do anything here
    } else {
      // Validate our fallback token format
      isAuthenticated = validateFallbackToken(authToken);
      
      // If validated, we can allow access
      if (isAuthenticated) {
        // If user is authenticated and on the login page ("/"), send to dashboard
        if (req.nextUrl.pathname === '/') {
          return NextResponse.redirect(new URL('/dashboard', req.url))
        }
        
        // For all other paths, user is authenticated so allow access
        return res;
      }
    }
  }
  
  // If we reached here, either there's no token, token isn't a fallback token,
  // or the fallback token is invalid. Try Supabase auth.
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

    // Try to get the session with Supabase
    const { data } = await supabase.auth.getSession()
    isAuthenticated = !!data?.session?.user;

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
