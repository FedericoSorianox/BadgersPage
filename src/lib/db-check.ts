import { supabase } from './supabaseClient';

export async function checkUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error checking profile:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Exception checking profile:', err);
    return null;
  }
}

export async function createUserProfile(userId: string, email: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert([
        {
          id: userId,
          email: email,
          role: 'user', // default role
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating profile:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Exception creating profile:', err);
    return null;
  }
} 