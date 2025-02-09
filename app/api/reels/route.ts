import { NextRequest, NextResponse } from 'next/server';

// Make route dynamic
export const dynamic = 'force-dynamic';
import { createReel, getReels } from '@/lib/db/client';

export async function POST(req: NextRequest) {
  try {
    const { userId, videoUrl, thumbnailUrl, caption } = await req.json();

    if (!userId || !videoUrl || !thumbnailUrl || !caption) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const reelId = await createReel(userId, videoUrl, thumbnailUrl, caption);

    return NextResponse.json({ reelId });
  } catch (error) {
    console.error('Error creating reel:', error);
    return NextResponse.json(
      { error: 'Failed to create reel' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    const reels = await getReels(userId || undefined);

    return NextResponse.json(reels);
  } catch (error) {
    console.error('Error fetching reels:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reels' },
      { status: 500 }
    );
  }
}
