import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Mock data - single test user with video
const mockStories = [
  {
    id: "test1",
    userId: "testuser",
    username: "Test User",
    userImage: "/placeholder-user.jpg",
    items: [
      {
        id: "1-1",
        url: "DO IT yourself.mp4", // Using exact filename from public/videos/
        type: "video",
        duration: 15,
        mimeType: "video/mp4"
      }
    ],
    category: "tutorial",
    tokens: 0,
    downloadable: true,
    isAdult: false
  }
];

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    const category = request.nextUrl.searchParams.get('category');

    // Get user's adult content preferences
    let showAdultContent = false;
    if (userId) {
      const prefsResponse = await fetch(`${request.nextUrl.origin}/api/settings/adult-content?userId=${userId}`);
      if (prefsResponse.ok) {
        const { showAdultContent: prefs } = await prefsResponse.json();
        showAdultContent = prefs;
      }
    }

    // Filter stories based on category and adult content preferences
    let filteredStories = [...mockStories];
    if (category) {
      filteredStories = filteredStories.filter(story => story.category === category);
    }
    if (!showAdultContent) {
      filteredStories = filteredStories.filter(story => !story.isAdult);
    }

    console.log('Returning stories:', filteredStories);
    return new NextResponse(JSON.stringify(filteredStories), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0'
      }
    });
  } catch (error) {
    console.error('Error fetching stories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stories' },
      { status: 500 }
    );
  }
}
