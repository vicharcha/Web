import { NextRequest, NextResponse } from 'next/server';

// Make route dynamic
export const dynamic = 'force-dynamic';
import { createInteraction, getInteractions, getUser } from '@/lib/db/client';

export async function POST(req: NextRequest) {
  try {
    const { contentId, userId, type } = await req.json();

    if (!contentId || !userId || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify user exists
    const user = await getUser(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Validate interaction type
    const validTypes = ['like', 'comment', 'share', 'save'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Invalid interaction type' },
        { status: 400 }
      );
    }

    await createInteraction(contentId, userId, type);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating social interaction:', error);
    return NextResponse.json(
      { error: 'Failed to create social interaction' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const contentId = searchParams.get('contentId');

    if (!contentId) {
      return NextResponse.json(
        { error: 'Content ID is required' },
        { status: 400 }
      );
    }

    const interactions = await getInteractions(contentId);

    // Group interactions by type
    const groupedInteractions = interactions.reduce((acc: Record<string, any>, interaction) => {
      const type = interaction.type;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push({
        userId: interaction.userId,
        createdAt: interaction.createdAt
      });
      return acc;
    }, {});

    // Add counts for each interaction type
    const stats = Object.entries(groupedInteractions).reduce((acc: Record<string, number>, [type, interactions]) => {
      acc[`${type}Count`] = Array.isArray(interactions) ? interactions.length : 0;
      return acc;
    }, {});

    return NextResponse.json({
      interactions: groupedInteractions,
      stats
    });
  } catch (error) {
    console.error('Error fetching social interactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch social interactions' },
      { status: 500 }
    );
  }
}
