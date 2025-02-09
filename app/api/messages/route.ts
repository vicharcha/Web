import { NextRequest, NextResponse } from 'next/server';

// Make route dynamic
export const dynamic = 'force-dynamic';
import { sendMessage, getMessages } from '@/lib/db/client';

export async function POST(req: NextRequest) {
  try {
    const { chatId, senderId, receiverId, content, mediaUrls } = await req.json();

    if (!chatId || !senderId || !receiverId || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const messageId = await sendMessage(
      chatId, 
      senderId, 
      receiverId, 
      content,
      mediaUrls || []
    );

    return NextResponse.json({ messageId });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get('chatId');
    const limit = searchParams.get('limit');

    if (!chatId) {
      return NextResponse.json(
        { error: 'Chat ID is required' },
        { status: 400 }
      );
    }

    const messages = await getMessages(
      chatId,
      limit ? parseInt(limit) : undefined
    );

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}
