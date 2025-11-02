import { createClient } from '@/lib/supabase/client';

export class UserService {
  private supabase = createClient();

  async getUserProfile(userId: string) {
    const { data, error } = await this.supabase
      .from('users')
      .select(`
        *,
        user_profiles (*)
      `)
      .eq('id', userId)
      .single();

    return { data, error };
  }

  async updateProfile(userId: string, updates: {
    display_name?: string;
    bio?: string;
    avatar_url?: string;
    location?: string;
    website?: string;
  }) {
    const { data, error } = await this.supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    return { data, error };
  }

  async updatePreferences(userId: string, preferences: {
    theme?: string;
    preferred_ai_model?: string;
    email_notifications?: boolean;
  }) {
    const { data, error } = await this.supabase
      .from('user_profiles')
      .update(preferences)
      .eq('id', userId)
      .select()
      .single();

    return { data, error };
  }

  async followUser(followingId: string) {
    const { data: { user } } = await this.supabase.auth.getUser();
    
    if (!user) {
      return { data: null, error: { message: 'Not authenticated' } };
    }

    const { data, error } = await this.supabase
      .from('user_follows')
      .insert({
        follower_id: user.id,
        following_id: followingId,
      })
      .select()
      .single();

    return { data, error };
  }

  async unfollowUser(followingId: string) {
    const { data: { user } } = await this.supabase.auth.getUser();
    
    if (!user) {
      return { data: null, error: { message: 'Not authenticated' } };
    }

    const { error } = await this.supabase
      .from('user_follows')
      .delete()
      .eq('follower_id', user.id)
      .eq('following_id', followingId);

    return { error };
  }

  async getUserStats(userId: string) {
    const { data, error } = await this.supabase
      .rpc('get_user_stats', { user_uuid: userId });

    return { data, error };
  }

  async searchUsers(searchTerm: string) {
    const { data, error } = await this.supabase
      .from('users')
      .select('id, display_name, avatar_url, bio')
      .or(`display_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
      .limit(10);

    return { data, error };
  }
}

export const userService = new UserService();

