import { NextRequest, NextResponse } from 'next/server';
import { getStories, Story } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    
    // Get stories, optionally filtered by userId
    const stories = await getStories(userId || undefined);
    
    // Sort stories by creation date, newest first
    const sortedStories = stories.sort((a, b) => {
      const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
      const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });
    
    // Group stories by user
    const storiesByUser = sortedStories.reduce((acc, story) => {
      const userId = story.userId;
      if (!acc[userId]) {
        acc[userId] = [];
      }
      acc[userId].push(story);
      return acc;
    }, {} as Record<string, Story[]>);
    
    return NextResponse.json({
      success: true,
      stories: storiesByUser
    });
  } catch (error) {
    console.error('Error fetching stories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stories' },
      { status: 500 }
    );
  }
}
