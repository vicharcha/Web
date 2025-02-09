import { NextRequest, NextResponse } from 'next/server';

// Make route dynamic
export const dynamic = 'force-dynamic';
import { createUser, getUser } from '@/lib/db/client';
import type { User } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const { phoneNumber, name } = await req.json();

    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    let user = await getUser(phoneNumber);

    if (!user) {
      // Create new user if doesn't exist
      const newUser: User = {
        phoneNumber,
        name: name || phoneNumber, // Use phone number as name if not provided
        verificationStatus: 'unverified',
        isPremium: false,
        digiLockerVerified: false,
        joinedDate: new Date().toISOString(),
        lastActive: new Date().toISOString()
      };

      user = await createUser(newUser);
    } else {
      // Update last active time
      await createUser({
        ...user,
        lastActive: new Date().toISOString()
      });
    }

    return NextResponse.json({
      user,
      token: 'dummy-token' // In a real app, generate a proper JWT token here
    });
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { phoneNumber, verificationStatus } = await req.json();

    if (!phoneNumber || !verificationStatus) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const user = await getUser(phoneNumber);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update user verification status
    await createUser({
      ...user,
      verificationStatus,
      lastActive: new Date().toISOString()
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating verification status:', error);
    return NextResponse.json(
      { error: 'Failed to update verification status' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const phoneNumber = searchParams.get('phoneNumber');

    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    const user = await getUser(phoneNumber);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}
