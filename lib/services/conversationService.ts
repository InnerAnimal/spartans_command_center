import { createClient } from '@/lib/supabase/client';

export class ConversationService {
  private supabase = createClient();

  async getConversations(userId: string) {
    const { data, error } = await this.supabase
      .from('conversations')
      .select('*')
      .eq('user_id', userId)
      .eq('is_archived', false)
      .order('last_message_at', { ascending: false });

    return { data, error };
  }

  async getConversationById(conversationId: string) {
    const { data, error } = await this.supabase
      .from('conversations')
      .select(`
        *,
        messages (*)
      `)
      .eq('id', conversationId)
      .single();

    return { data, error };
  }

  async createConversation(data: {
    title?: string;
    model: string;
    systemPrompt?: string;
  }) {
    const { data: { user } } = await this.supabase.auth.getUser();
    
    if (!user) {
      return { data: null, error: { message: 'Not authenticated' } };
    }

    const { data: conversation, error } = await this.supabase
      .from('conversations')
      .insert({
        user_id: user.id,
        title: data.title || 'New Conversation',
        model: data.model,
        system_prompt: data.systemPrompt,
      })
      .select()
      .single();

    return { data: conversation, error };
  }

  async addMessage(conversationId: string, message: {
    role: 'user' | 'assistant' | 'system';
    content: string;
    model?: string;
    tokensUsed?: number;
    cost?: number;
  }) {
    const { data, error } = await this.supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        role: message.role,
        content: message.content,
        model: message.model,
        tokens_used: message.tokensUsed || 0,
        cost: message.cost || 0,
      })
      .select()
      .single();

    return { data, error };
  }

  async updateConversationTitle(conversationId: string, title: string) {
    const { data, error } = await this.supabase
      .from('conversations')
      .update({ title })
      .eq('id', conversationId)
      .select()
      .single();

    return { data, error };
  }

  async archiveConversation(conversationId: string) {
    const { data, error } = await this.supabase
      .from('conversations')
      .update({ is_archived: true })
      .eq('id', conversationId)
      .select()
      .single();

    return { data, error };
  }

  async toggleFavorite(conversationId: string) {
    const { data: conversation } = await this.supabase
      .from('conversations')
      .select('is_favorite')
      .eq('id', conversationId)
      .single();

    if (!conversation) return { data: null, error: { message: 'Conversation not found' } };

    const { data, error } = await this.supabase
      .from('conversations')
      .update({ is_favorite: !conversation.is_favorite })
      .eq('id', conversationId)
      .select()
      .single();

    return { data, error };
  }

  async deleteConversation(conversationId: string) {
    const { error } = await this.supabase
      .from('conversations')
      .delete()
      .eq('id', conversationId);

    return { error };
  }

  async searchConversations(userId: string, searchTerm: string) {
    const { data, error } = await this.supabase
      .rpc('search_conversations', {
        user_uuid: userId,
        search_term: searchTerm,
      });

    return { data, error };
  }

  async addTag(conversationId: string, tag: string) {
    const { data, error } = await this.supabase
      .from('conversation_tags')
      .insert({
        conversation_id: conversationId,
        tag: tag.toLowerCase(),
      })
      .select()
      .single();

    return { data, error };
  }

  async removeTag(conversationId: string, tag: string) {
    const { error } = await this.supabase
      .from('conversation_tags')
      .delete()
      .eq('conversation_id', conversationId)
      .eq('tag', tag.toLowerCase());

    return { error };
  }
}

export const conversationService = new ConversationService();

