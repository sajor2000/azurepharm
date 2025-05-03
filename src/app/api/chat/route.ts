import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY!,
  baseURL: process.env.AZURE_OPENAI_ENDPOINT,
  defaultHeaders: {
    'api-version': '2024-05-01-preview',
  },
});

export async function POST(request: Request) {
  try {
    const { message, threadId } = await request.json();
    const assistantId = process.env.AZURE_ASSISTANT_ID;

    if (!assistantId) {
      return NextResponse.json({ error: 'AZURE_ASSISTANT_ID is not set in environment.' }, { status: 500 });
    }

    // Create a new thread if not provided
    let thread_id: string;
    if (!threadId) {
      const thread = await openai.beta.threads.create();
      thread_id = thread.id;
    } else {
      thread_id = threadId;
    }

    // Add user message to the thread
    await openai.beta.threads.messages.create(thread_id, {
      role: 'user',
      content: message,
    });

    // Run the assistant on the thread
    let run = await openai.beta.threads.runs.create(thread_id, {
      assistant_id: assistantId,
    });

    // Poll for run completion
    while (['queued', 'in_progress', 'cancelling'].includes(run.status)) {
      await new Promise(res => setTimeout(res, 1000));
      run = await openai.beta.threads.runs.retrieve(thread_id, run.id);
    }

    if (run.status === 'completed') {
      const messages = await openai.beta.threads.messages.list(thread_id);
      // Find the last assistant message with text
      const assistantMessage = messages.data.reverse().find(m => m.role === 'assistant');
      let responseText = 'No response from assistant.';
      if (assistantMessage && Array.isArray(assistantMessage.content)) {
        const textBlock = assistantMessage.content.find(
          (block: any) => block.type === 'text' && block.text?.value
        );
        if (textBlock) {
          responseText = textBlock.text.value;
        }
      }
      return NextResponse.json({ response: responseText });
    } else if (run.status === 'requires_action') {
      // Handle tool calls if needed
      return NextResponse.json({ response: 'The assistant requires additional actions.' });
    } else {
      return NextResponse.json({ response: `Run status: ${run.status}` });
    }
  } catch (error: any) {
    console.error('Error in Azure OpenAI chat API:', error);
    return NextResponse.json({ error: error.message || 'Failed to process message' }, { status: 500 });
  }
}