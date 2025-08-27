'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function logoutAction() {
  const supabase = await createClient();
  
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Logout error:', error);
    // Don't throw error to avoid blocking the redirect
  }
  
  redirect('/');
}

export async function getCurrentUser() {
  const supabase = await createClient();
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}