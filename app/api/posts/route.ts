import { NextRequest, NextResponse } from 'next/server';
import type { Post } from '@/lib/types';
import { mockDB } from '@/lib/mock-db';
import type { MockPost } from '@/lib/mock-db';

export async function GET(request: NextRequest) {
  try {
    const category = request.nextUrl.searchParams.get('category')?.toLowerCase();

    const queryStr = category 
      ? 'SELECT * FROM posts WHERE category = ?'
      : 'SELECT * FROM posts';
    const params = category ? [category] : [];
    
    const result = await mockDB.query(queryStr, params);
    
    const dbPosts = (result.rows || []) as MockPost[];
    const posts: Post[] = dbPosts.map(post => ({
      id: post.id,
      userId: post.userId,
      username: "Anonymous User",
      userImage: "/placeholder-user.jpg",
      content: post.content,
      category: post.category,
      mediaUrls: post.mediaUrls || [],
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      timestamp: post.createdAt.toISOString()
    }));

    return NextResponse.json(posts);

  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}
