import { updateSession } from '@/lib/supabase/middleware'
import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  // Check if the request is coming from localhost:3000
  const host = request.headers.get('host') || ''
  const isLocalhost = host.includes('localhost:3000')

  // If not localhost:3000 and not already on the coming-soon page, redirect to coming-soon
  if (!isLocalhost && !request.nextUrl.pathname.startsWith('/coming-soon')) {
    return NextResponse.redirect(new URL('/coming-soon', request.url))
  }

  // If on localhost:3000, proceed with the normal session update
  if (isLocalhost) {
    return await updateSession(request)
  }

  // For non-localhost users on the coming-soon page, just return the response without session update
  return NextResponse.next()
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
