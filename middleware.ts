import { updateSession } from '@/lib/supabase/middleware'
import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const isRootPath = request.nextUrl.pathname === '/'
  const isAuthPath = request.nextUrl.pathname.startsWith('/auth')

  // Allow access to root and auth paths without session check
  if (isRootPath || isAuthPath) {
    return NextResponse.next()
  }

  // For all other routes, proceed with session update
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
