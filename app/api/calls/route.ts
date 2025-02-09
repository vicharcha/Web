import { NextRequest, NextResponse } from 'next/server';

// Make route dynamic
export const dynamic = 'force-dynamic';
import { createCall, updateCallStatus, getCalls } from '@/lib/db/client';

export async function POST(req: NextRequest) {
  try {
    const { callerId, receiverId, type } = await req.json();

    if (!callerId || !receiverId || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const callId = await createCall(callerId, receiverId, type);

    return NextResponse.json({ callId });
  } catch (error) {
    console.error('Error creating call:', error);
    return NextResponse.json(
      { error: 'Failed to create call' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { callId, status } = await req.json();

    if (!callId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const endTime = status === 'ended' ? new Date() : undefined;
    await updateCallStatus(callId, status, endTime);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating call:', error);
    return NextResponse.json(
      { error: 'Failed to update call' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      );
    }

    const calls = await getCalls(userId);
    return NextResponse.json(calls);
  } catch (error) {
    console.error('Error fetching calls:', error);
    return NextResponse.json(
      { error: 'Failed to fetch calls' },
      { status: 500 }
    );
  }
}
