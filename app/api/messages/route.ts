import { NextResponse } from 'next/server';
import dbConnect from 'lib/db';
import MessageModel from 'models/Message';

export async function GET() {
  try {
    const db = await dbConnect();
    const messageModel = new MessageModel(db);
    const messages = await messageModel.getMessages();
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const db = await dbConnect();
    const messageModel = new MessageModel(db);
    const data = await request.json();
    const message = await messageModel.createMessage(data.content, data.sender, data.timestamp);
    return NextResponse.json(message);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create message' }, { status: 500 });
  }
}
