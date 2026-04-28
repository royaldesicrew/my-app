import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function adminGuard() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('rdc_admin_auth')?.value;

  if (authCookie !== 'authenticated') {
    redirect('/admin/login');
  }

  return true;
}
