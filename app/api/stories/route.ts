import { NextRequest, NextResponse } from 'next/server';
import { getStories, Story, findUserByPhone } from '@/lib/db';

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
    
    // Get stories with user details
    const storiesWithUserDetails = await Promise.all(sortedStories.map(async (story) => {
      const user = await findUserByPhone(story.userId);
      return {
        ...story,
        username: user?.username || "Unknown User"
      };
    }));
    
    return NextResponse.json({
      success: true,
      stories: storiesWithUserDetails
    });
  } catch (error) {
    console.error('Error fetching stories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stories' },
      { status: 500 }
    );
  }
}
