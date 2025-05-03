import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, insurance, preference, medicationClass, threadId } = body;

    const client = new OpenAI({
      apiKey: process.env.AZURE_OPENAI_API_KEY!,
      baseURL: process.env.AZURE_OPENAI_ENDPOINT,
      defaultHeaders: { 'api-version': '2024-05-01-preview' },
    });

    let currentThreadId = threadId;
    if (!currentThreadId) {
      const thread = await client.beta.threads.create();
      currentThreadId = thread.id;
    }

    // Build context string if insurance, preference, or medicationClass are provided
    let context = '';
    if (insurance || preference || medicationClass) {
      context = `Insurance: ${insurance || ''}, Preference: ${preference || ''}, Medication Class: ${medicationClass || ''}`;
    }
    const fullMessage = context ? `${context}\n\nQuestion: ${message}` : message;

    await client.beta.threads.messages.create(currentThreadId, {
      role: "user",
      content: fullMessage
    });

    const run = await client.beta.threads.runs.create(currentThreadId, {
      assistant_id: process.env.AZURE_ASSISTANT_ID!,
      model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
    });

    let runStatus = await client.beta.threads.runs.retrieve(currentThreadId, run.id);
    while (runStatus.status !== 'completed') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await client.beta.threads.runs.retrieve(currentThreadId, run.id);
    }

    const messages = await client.beta.threads.messages.list(currentThreadId);
    let responseText = 'No response';
    // Proper type checking for the message content
    if (messages.data[0]) {
      const content = messages.data[0].content[0];
      // Type guard to check if content is text
      if (content.type === 'text') {
        responseText = content.text.value;
      }
    }

    return NextResponse.json({ 
      response: responseText,
      threadId: currentThreadId 
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to communicate with assistant' }, { status: 500 });
  }
}