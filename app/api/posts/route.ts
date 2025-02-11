import { NextRequest, NextResponse } from 'next/server';
import { createPost, getPosts } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') as any;
    const ageRestricted = searchParams.get('ageRestricted') === 'true';

    const posts = await getPosts();

    // Apply filters if provided
    let filteredPosts = posts;
    if (category) {
      filteredPosts = filteredPosts.filter(post => post.category === category);
    }
    if (ageRestricted !== undefined) {
      filteredPosts = filteredPosts.filter(post => post.ageRestricted === ageRestricted);
    }

    return NextResponse.json(filteredPosts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const post = await req.json();
    const newPost = await createPost(post);
    return NextResponse.json(newPost);
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
