import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

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

  const { data: { session }, error } = await supabase.auth.getSession()

  const isAuthenticated = !!session?.user

  // Debugging Logs (Remove after testing)
  console.log("Session:", session)
  console.log("Authenticated:", isAuthenticated)

  // ✅ If user is authenticated and on the login page ("/"), send to dashboard
  if (isAuthenticated && req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // ✅ If user is NOT authenticated and tries to access "/dashboard", send them to login page
  if (!isAuthenticated && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return res
}

export const config = {
  matcher: ['/', '/dashboard/:path*'],
}
