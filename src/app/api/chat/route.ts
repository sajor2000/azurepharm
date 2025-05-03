import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/GPT4o`,
  defaultHeaders: {
    'api-key': process.env.AZURE_OPENAI_API_KEY,
  },
  defaultQuery: {
    'api-version': process.env.AZURE_OPENAI_API_VERSION,
  },
});

export async function POST(request: Request) {
  try {
    const { message, threadId, formData } = await request.json();
    const assistantId = process.env.AZURE_ASSISTANT_ID;

    // Create a new thread if not provided
    let thread_id = threadId;
    if (!thread_id) {
      const thread = await openai.beta.threads.create();
      thread_id = thread.id;
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
      // Get the last assistant message
      const assistantMessage = messages.data.reverse().find(m => m.role === 'assistant');
      return NextResponse.json({ response: assistantMessage?.content?.[0]?.text?.value || 'No response from assistant.' });
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
