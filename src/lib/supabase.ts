import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  email: string;
  phone_number: string;
  location: string;
  avatar_url?: string;
  auth_provider: string;
  created_at: string;
  updated_at: string;
}

export async function createUserProfile(userId: string, data: {
  username: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  location: string;
  authProvider: string;
}) {
  const { error } = await supabase
    .from('user_profiles')
    .insert({
      id: userId,
      username: data.username,
      full_name: data.fullName,
      email: data.email,
      phone_number: data.phoneNumber,
      location: data.location,
      auth_provider: data.authProvider,
    });

  return { error };
}

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  return { data, error };
}

export async function checkUsernameAvailability(username: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('username')
    .eq('username', username)
    .maybeSingle();

  return { available: !data, error };
}
