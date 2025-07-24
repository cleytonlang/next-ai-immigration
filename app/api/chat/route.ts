import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { message, threadId, assistantId } = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    if (!assistantId) {
      return NextResponse.json(
        { error: 'Assistant ID is required' },
        { status: 400 }
      );
    }

    let currentThreadId = threadId;

    if (!currentThreadId) {
      const thread = await openai.beta.threads.create();
      currentThreadId = thread.id;
    }

    await openai.beta.threads.messages.create(currentThreadId, {
      role: 'user',
      content: message,
    });

    const run = await openai.beta.threads.runs.create(currentThreadId, {
      assistant_id: assistantId,
    });

    let runStatus = await openai.beta.threads.runs.retrieve(run.id, {
      thread_id: currentThreadId,
    });
    
    while (runStatus.status === 'in_progress' || runStatus.status === 'queued') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(run.id, {
        thread_id: currentThreadId,
      });
    }

    if (runStatus.status === 'completed') {
      const messages = await openai.beta.threads.messages.list(currentThreadId);
      const lastMessage = messages.data[0];

      if (lastMessage.role === 'assistant' && lastMessage.content[0].type === 'text') {
        return NextResponse.json({
          message: lastMessage.content[0].text.value,
          threadId: currentThreadId,
        });
      }
    } else if (runStatus.status === 'failed') {
      return NextResponse.json(
        { error: 'Assistant run failed', details: runStatus.last_error },
        { status: 500 }
      );
    } else if (runStatus.status === 'requires_action') {
      return NextResponse.json(
        { error: 'Assistant requires action (not implemented)', status: runStatus.status },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Unexpected response from assistant' },
      { status: 500 }
    );

  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}