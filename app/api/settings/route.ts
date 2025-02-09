import { NextRequest, NextResponse } from 'next/server';
import { updateUserSettings, getUserSettings, getUser } from '@/lib/db/client';

// Make route dynamic
export const dynamic = 'force-dynamic';

export async function PUT(req: NextRequest) {
  try {
    const { userId, settings } = await req.json();

    if (!userId || !settings || typeof settings !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request body' },
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

    // Convert settings to string key-value pairs
    const stringSettings: Record<string, string> = {};
    for (const [key, value] of Object.entries(settings)) {
      stringSettings[key] = String(value);
    }

    await updateUserSettings(userId, stringSettings);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
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
        { error: 'User ID is required' },
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

    const settings = await getUserSettings(userId);
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}
