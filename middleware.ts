import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Protect all /admin routes EXCEPT /admin/login
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const authCookie = request.cookies.get('rdc_admin_auth')?.value;
    
    // Very simple check: we'll set this cookie to 'true' upon successful login
    if (authCookie !== 'authenticated') {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Also protect admin API routes? Maybe not for now since they are used by frontend?
  // Wait, frontend uses /api/admin/venues to GET data.
  // We can't protect GET /api/admin/* from public because the booking page uses it!
  // The backend uses POST/PUT/DELETE for admin operations.
  if (pathname.startsWith('/api/admin/') && request.method !== 'GET') {
    // Exclude the authentication route itself from protection
    if (pathname.startsWith('/api/admin/auth')) {
      return NextResponse.next();
    }

    const authCookie = request.cookies.get('rdc_admin_auth')?.value;
    if (authCookie !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
