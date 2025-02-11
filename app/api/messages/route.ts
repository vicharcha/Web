import { NextRequest, NextResponse } from 'next/server';
import { 
  getMessages,
  sendMessage,
  type MessageStatus 
} from '@/lib/db';
import type { Message } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get('chatId');
    const limit = parseInt(searchParams.get('limit') || '50');

    if (!chatId) {
      return NextResponse.json(
        { error: 'Missing chatId parameter' },
        { status: 400 }
      );
    }

    const messages = await getMessages(chatId);
    
    // Sort by date and limit results
    const sortedMessages = messages
      .sort((a: Message, b: Message) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, limit);

    return NextResponse.json(sortedMessages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const {
      chatId,
      senderId,
      receiverId,
      content,
      mediaUrls = []
    } = await req.json();

    if (!chatId || !senderId || !receiverId || !content) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const messageId = await sendMessage(
      chatId,
      senderId,
      receiverId,
      content,
      mediaUrls
    );

    return NextResponse.json({
      messageId,
      sent: true,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

// For demo - update message status (delivered/read)
export async function PATCH(req: NextRequest) {
  try {
    const {
      messageIds,
      status
    } = await req.json();

    if (!messageIds?.length || !status) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const validStatuses: MessageStatus[] = ['sent', 'delivered', 'read'];
    if (!validStatuses.includes(status as MessageStatus)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // In demo, we don't actually need to update the status
    // since messages are temporary
    return NextResponse.json({
      updated: messageIds.length,
      status
    });
  } catch (error) {
    console.error('Error updating message status:', error);
    return NextResponse.json(
      { error: 'Failed to update message status' },
      { status: 500 }
    );
  }
}

// For demo - delete messages (not recommended in production)
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const messageId = searchParams.get('messageId');
    const chatId = searchParams.get('chatId');

    if (!messageId || !chatId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // In demo, we don't actually delete messages
    return NextResponse.json({
      deleted: true,
      messageId
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json(
      { error: 'Failed to delete message' },
      { status: 500 }
    );
  }
}
