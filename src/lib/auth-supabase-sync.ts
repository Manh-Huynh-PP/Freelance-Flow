// src/lib/auth-supabase-sync.ts
"use client";

import { getSupabaseClient } from '@/lib/supabase-service';
import { auth } from '@/lib/supabase-auth';

export async function syncUserWithSupabase() {
  const { data: user } = await auth.getUser();
  if (!user?.email) return null;

  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    // Use Supabase user id; check if user exists in user_profiles
    const { data: existingProfile, error } = await supabase
      .from('user_profiles')  
      .select('*')
      .eq('id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking user profile:', error);
      return null;
    }

    if (!existingProfile) {
      // Create user profile in Supabase
      const userId = user.id;
      
      const { data: newProfile, error: insertError } = await supabase
        .from('user_profiles')
        .insert({
          id: userId,
          email: user.email,
          display_name: user.user_metadata?.name,
          avatar_url: user.user_metadata?.avatar_url,
          auth_provider: 'supabase',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating user profile:', insertError);
        return null;
      }

      console.log('✅ Created new Supabase profile for Supabase user:', newProfile);
      return newProfile;
    }

    console.log('✅ Found existing Supabase profile:', existingProfile);
    return existingProfile;
  } catch (error) {
    console.error('Error syncing user with Supabase:', error);
    return null;
  }
}

export async function getSupabaseUserFromSession() {
  const { data: user } = await auth.getUser();
  if (!user?.id) return null;

  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return profile;
}