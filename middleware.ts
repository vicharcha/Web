import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Paths that don't require authentication
const publicPaths = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/terms',
  '/privacy',
  '/about'
]

// Paths that require premium status
const premiumPaths = [
  '/premium',
  '/analytics',
  '/advanced-features'
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Allow public paths
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Get user from cookie
  const userCookie = request.cookies.get('user')
  let user = null

  try {
    user = userCookie ? JSON.parse(userCookie.value) : null
  } catch (error) {
    console.error('Error parsing user cookie:', error)
  }

  // Handle authentication
  if (!user) {
    if (pathname !== '/login') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return NextResponse.next()
  }

  // Check if user is banned
  if (user.verificationStatus === 'banned') {
    if (pathname !== '/banned') {
      const response = NextResponse.redirect(new URL('/banned', request.url))
      response.cookies.delete('user') // Clear user cookie when banned
      return response
    }
    return NextResponse.next()
  }

  // Handle premium content access
  if (premiumPaths.some(path => pathname.startsWith(path))) {
    if (!user.isPremium) {
      return NextResponse.redirect(new URL('/premium-required', request.url))
    }
  }

  // Redirect authenticated users away from auth pages
  if (pathname === '/login' || pathname === '/register') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Update last active timestamp
  if (user) {
    const updatedUser = {
      ...user,
      lastActive: new Date().toISOString()
    }
    const response = NextResponse.next()
    response.cookies.set('user', JSON.stringify(updatedUser), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /fonts (inside public)
     * 4. /examples (inside public)
     * 5. all root files inside public (e.g. /favicon.ico)
     */
    '/((?!api|_next|fonts|examples|[\\w-]+\\.\\w+).*)',
  ],
}
