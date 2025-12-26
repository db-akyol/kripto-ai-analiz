import { NextResponse } from 'next/server';
import { chatWithAI } from '@/lib/gemini';

export async function POST(request) {
  try {
    const { message } = await request.json();
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const response = await chatWithAI(message);
    
    return NextResponse.json({ response });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ error: 'Failed to get response: ' + error.message }, { status: 500 });
  }
}
