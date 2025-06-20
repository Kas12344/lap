
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { ADMIN_USERNAME, ADMIN_PASSWORD, AUTH_COOKIE_NAME, AUTH_COOKIE_MAX_AGE } from '@/lib/constants';

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export async function handleLogin(formData: FormData) {
  const rawFormData = Object.fromEntries(formData.entries());
  const validatedFields = loginSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return { success: false, error: "Username and password are required." };
  }

  const { username, password } = validatedFields.data;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    cookies().set(AUTH_COOKIE_NAME, 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set to true in production
      path: '/',
      maxAge: AUTH_COOKIE_MAX_AGE, 
      sameSite: 'lax',
    });
    // Instead of redirecting here, we return success and let the client-side redirect.
    // This allows the client to refresh the page properly if needed.
    // redirect('/admin'); // This causes issues if called directly from client component form action.
    return { success: true };
  } else {
    return { success: false, error: "Invalid username or password." };
  }
}

export async function handleLogout() {
  cookies().delete(AUTH_COOKIE_NAME);
  redirect('/admin/login');
}
