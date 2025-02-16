import { NextRequest, NextResponse } from 'next/server';
import { getStories } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    
    // Get stories, optionally filtered by userId
    const stories = await getStories(userId || undefined);
    
    // Sort stories by creation date, newest first
    const sortedStories = stories.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    // Group stories by user
    const storiesByUser = sortedStories.reduce((acc, story) => {
      if (!acc[story.userId]) {
        acc[story.userId] = [];
      }
      acc[story.userId].push(story);
      return acc;
    }, {} as Record<string, typeof stories>);
    
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
