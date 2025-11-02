import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { model, message, conversationId } = await request.json();

    // Validate request
    if (!model || !message) {
      return NextResponse.json(
        { error: 'Model and message are required' },
        { status: 400 }
      );
    }

    // Check authentication
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // ⚠️ API KEYS NEEDED - Add these to .env.local:
    // ANTHROPIC_API_KEY for Claude
    // OPENAI_API_KEY for ChatGPT
    
    // TODO: Implement AI chat logic here
    // This will be completed once API keys are added
    
    if (!process.env.ANTHROPIC_API_KEY && model === 'claude') {
      return NextResponse.json(
        { error: 'Claude API key not configured. Add ANTHROPIC_API_KEY to environment variables.' },
        { status: 503 }
      );
    }

    if (!process.env.OPENAI_API_KEY && model === 'chatgpt') {
      return NextResponse.json(
        { error: 'OpenAI API key not configured. Add OPENAI_API_KEY to environment variables.' },
        { status: 503 }
      );
    }

    // Placeholder response
    return NextResponse.json({
      message: '✅ API endpoint ready! Add API keys to enable AI chat.',
      note: 'Add ANTHROPIC_API_KEY and OPENAI_API_KEY to .env.local',
      received: { model, message, conversationId }
    });

  } catch (error) {
    console.error('AI chat error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

