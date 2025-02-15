import { NextRequest, NextResponse } from 'next/server';

// Mock data - replace with actual database queries
const mockStories = [
  {
    id: "1",
    userId: "user1",
    username: "Tech News",
    userImage: "/placeholder-user.jpg",
    items: [
      {
        id: "1-1",
        url: "/placeholder.jpg",
        type: "image",
      },
      {
        id: "1-2",
        url: "/videos/tech-demo.mp4",
        type: "video",
        duration: 15
      }
    ],
    category: "technology",
    tokens: 350,
    downloadable: true,
    isAdult: false
  },
  {
    id: "2",
    userId: "user2",
    username: "Sports Central",
    userImage: "/placeholder-user.jpg",
    items: [
      {
        id: "2-1",
        url: "/placeholder.jpg",
        type: "image"
      },
      {
        id: "2-2",
        url: "/placeholder.jpg",
        type: "image"
      }
    ],
    category: "sports",
    tokens: 350,
    downloadable: true,
    isAdult: false
  },
  {
    id: "3",
    userId: "user3",
    username: "Entertainment Now",
    userImage: "/placeholder-user.jpg",
    items: [
      {
        id: "3-1",
        url: "/videos/entertainment.mp4",
        type: "video",
        duration: 10
      }
    ],
    category: "entertainment",
    tokens: 350,
    downloadable: true,
    isAdult: false
  },
  {
    id: "4",
    userId: "user4",
    username: "News Flash",
    userImage: "/placeholder-user.jpg",
    items: [
      {
        id: "4-1",
        url: "/placeholder.jpg",
        type: "image"
      }
    ],
    category: "news",
    tokens: 350,
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

    return NextResponse.json(filteredStories);
  } catch (error) {
    console.error('Error fetching stories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stories' },
      { status: 500 }
    );
  }
}
