import { NextRequest, NextResponse } from 'next/server';
import { 
  createConnection,
  getConnections,
  createInteraction,
  getInteractions
} from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type'); // 'connections' or 'interactions'
    const userId = searchParams.get('userId');
    const contentId = searchParams.get('contentId');

    if (!type || !userId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    switch (type) {
      case 'connections': {
        const connections = await getConnections(userId);
        return NextResponse.json(connections);
      }

      case 'interactions': {
        if (!contentId) {
          return NextResponse.json(
            { error: 'Missing contentId for interactions' },
            { status: 400 }
          );
        }
        const interactions = await getInteractions(contentId);
        return NextResponse.json(interactions);
      }

      default:
        return NextResponse.json(
          { error: 'Invalid type parameter' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error fetching social data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch social data' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { type, data } = await req.json();

    if (!type || !data) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    switch (type) {
      case 'connection': {
        const { userId, connectedUserId, connectionType } = data;

        if (!userId || !connectedUserId || !connectionType) {
          return NextResponse.json(
            { error: 'Missing connection parameters' },
            { status: 400 }
          );
        }

        const validTypes = ['following', 'blocked', 'close_friend'];
        if (!validTypes.includes(connectionType)) {
          return NextResponse.json(
            { error: 'Invalid connection type' },
            { status: 400 }
          );
        }

        await createConnection(userId, connectedUserId, connectionType);
        return NextResponse.json({ created: true });
      }

      case 'interaction': {
        const { contentId, userId, interactionType } = data;

        if (!contentId || !userId || !interactionType) {
          return NextResponse.json(
            { error: 'Missing interaction parameters' },
            { status: 400 }
          );
        }

        const validTypes = ['like', 'love', 'haha', 'wow', 'sad', 'angry'];
        if (!validTypes.includes(interactionType)) {
          return NextResponse.json(
            { error: 'Invalid interaction type' },
            { status: 400 }
          );
        }

        await createInteraction(contentId, userId, interactionType);
        return NextResponse.json({ created: true });
      }

      default:
        return NextResponse.json(
          { error: 'Invalid type parameter' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error creating social record:', error);
    return NextResponse.json(
      { error: 'Failed to create social record' },
      { status: 500 }
    );
  }
}

// For demo - handle connection removal
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const userId = searchParams.get('userId');
    const targetId = searchParams.get('targetId'); // connectedUserId or contentId

    if (!type || !userId || !targetId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // In demo, we don't actually need to delete from memory store
    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error('Error deleting social record:', error);
    return NextResponse.json(
      { error: 'Failed to delete social record' },
      { status: 500 }
    );
  }
}
