import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // PocketBase sets cookies with pattern: pb_auth_<collection>
    // Check for any pb_auth cookie
    const hasPocketBaseAuth = request.cookies.getAll().some(cookie =>
        cookie.name.startsWith('pb_auth')
    )

    // Redirect root to dashboard (which will then redirect to login if unauthenticated)
    if (pathname === '/') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Protected routes
    if (pathname.startsWith('/dashboard')) {
        if (!hasPocketBaseAuth) {
            const url = new URL('/login', request.url)
            url.searchParams.set('callbackUrl', pathname)
            return NextResponse.redirect(url)
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/dashboard/:path*', '/'],
}
