import { createClient } from '@/lib/supabase/client';

export class ForumService {
  private supabase = createClient();

  // ==================== POSTS ====================
  
  async getPosts(options?: {
    categoryId?: string;
    limit?: number;
    offset?: number;
  }) {
    let query = this.supabase
      .from('posts')
      .select(`
        *,
        users:user_id (id, display_name, avatar_url),
        categories:category_id (name, slug, icon),
        post_likes (count)
      `)
      .eq('is_published', true)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false });

    if (options?.categoryId) {
      query = query.eq('category_id', options.categoryId);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 20) - 1);
    }

    const { data, error } = await query;
    return { data, error };
  }

  async getPostById(postId: string) {
    const { data, error } = await this.supabase
      .from('posts')
      .select(`
        *,
        users:user_id (id, display_name, avatar_url, bio),
        categories:category_id (name, slug, icon, color),
        post_likes (count)
      `)
      .eq('id', postId)
      .eq('is_deleted', false)
      .single();

    return { data, error };
  }

  async createPost(post: {
    title: string;
    content: string;
    categoryId?: string;
  }) {
    const { data: { user } } = await this.supabase.auth.getUser();
    
    if (!user) {
      return { data: null, error: { message: 'Not authenticated' } };
    }

    const { data, error } = await this.supabase
      .from('posts')
      .insert({
        user_id: user.id,
        title: post.title,
        content: post.content,
        category_id: post.categoryId || null,
        slug: post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      })
      .select()
      .single();

    return { data, error };
  }

  async updatePost(postId: string, updates: {
    title?: string;
    content?: string;
  }) {
    const { data, error } = await this.supabase
      .from('posts')
      .update(updates)
      .eq('id', postId)
      .select()
      .single();

    return { data, error };
  }

  async deletePost(postId: string) {
    // Soft delete
    const { data, error } = await this.supabase
      .from('posts')
      .update({ is_deleted: true })
      .eq('id', postId)
      .select()
      .single();

    return { data, error };
  }

  // ==================== COMMENTS ====================

  async getComments(postId: string) {
    const { data, error } = await this.supabase
      .from('comments')
      .select(`
        *,
        users:user_id (id, display_name, avatar_url),
        comment_likes (count)
      `)
      .eq('post_id', postId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: true });

    return { data, error };
  }

  async createComment(comment: {
    postId: string;
    content: string;
    parentId?: string;
  }) {
    const { data: { user } } = await this.supabase.auth.getUser();
    
    if (!user) {
      return { data: null, error: { message: 'Not authenticated' } };
    }

    const { data, error } = await this.supabase
      .from('comments')
      .insert({
        post_id: comment.postId,
        user_id: user.id,
        content: comment.content,
        parent_id: comment.parentId || null,
      })
      .select()
      .single();

    return { data, error };
  }

  // ==================== LIKES ====================

  async likePost(postId: string) {
    const { data: { user } } = await this.supabase.auth.getUser();
    
    if (!user) {
      return { data: null, error: { message: 'Not authenticated' } };
    }

    const { data, error } = await this.supabase
      .from('post_likes')
      .insert({
        post_id: postId,
        user_id: user.id,
      })
      .select()
      .single();

    return { data, error };
  }

  async unlikePost(postId: string) {
    const { data: { user } } = await this.supabase.auth.getUser();
    
    if (!user) {
      return { data: null, error: { message: 'Not authenticated' } };
    }

    const { error } = await this.supabase
      .from('post_likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', user.id);

    return { error };
  }

  // ==================== CATEGORIES ====================

  async getCategories() {
    const { data, error } = await this.supabase
      .from('categories')
      .select('*')
      .order('order_index');

    return { data, error };
  }

  // ==================== SEARCH ====================

  async searchPosts(searchTerm: string, limit: number = 20) {
    const { data, error } = await this.supabase
      .rpc('search_posts', {
        search_term: searchTerm,
        limit_count: limit,
      });

    return { data, error };
  }
}

export const forumService = new ForumService();

