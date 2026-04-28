import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const envPassword = process.env.ADMIN_PASSWORD;

    if (!envPassword) {
      console.error("ADMIN_PASSWORD is not set in environment variables!");
      return NextResponse.json({ success: false, error: "Server configuration error." }, { status: 500 });
    }

    if (password === envPassword) {
      // Password is correct, set a cookie
      const cookieStore = await cookies();
      cookieStore.set('rdc_admin_auth', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
      });

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: "Incorrect password" }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: "Authentication failed" }, { status: 500 });
  }
}
