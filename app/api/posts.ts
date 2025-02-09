import { NextRequest, NextResponse } from 'next/server';
import { client, PostCategories, type Post } from '@/lib/cassandra';
import { types } from 'cassandra-driver';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { content, category, mediaUrls = [], userId } = data;

    // Validate category
    if (!Object.values(PostCategories).includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      );
    }

    // Check if content should be age restricted
    const isAdultContent = category === PostCategories.ADULT;

    const post: Post = {
      id: types.Uuid.random(),
      userId,
      content,
      category,
      ageRestricted: isAdultContent,
      mediaUrls,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const query = `
      INSERT INTO social_network.posts 
      (id, user_id, content, category, age_restricted, media_urls, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await client.execute(query, [
      post.id,
      post.userId,
      post.content,
      post.category,
      post.ageRestricted,
      post.mediaUrls,
      post.createdAt,
      post.updatedAt
    ], { prepare: true });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = new URL(req.url).searchParams;
    const category = searchParams.get('category');
    const userAge = parseInt(searchParams.get('userAge') || '0', 10);
    const userId = searchParams.get('userId');

    let query = 'SELECT * FROM social_network.posts';
    const params: any[] = [];
    const conditions: string[] = [];

    if (category) {
      conditions.push('category = ?');
      params.push(category);
    }

    // Filter out adult content for underage users
    if (userAge < 18) {
      conditions.push('age_restricted = false');
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    // Add sorting by creation date (most recent first)
    query += ' ORDER BY created_at DESC';

    const result = await client.execute(query, params, { prepare: true });
    const posts = result.rows.map(row => ({
      id: row.id,
      userId: row.user_id,
      content: row.content,
      category: row.category,
      ageRestricted: row.age_restricted,
      mediaUrls: row.media_urls,
      createdAt: row.created_at,
      updatedAt: row.updated_at
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

export async function DELETE(req: NextRequest) {
  try {
    const { id, userId } = await req.json();

    // Verify post exists and belongs to user
    const verifyQuery = 'SELECT user_id FROM social_network.posts WHERE id = ?';
    const verifyResult = await client.execute(verifyQuery, [id], { prepare: true });

    if (verifyResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    if (verifyResult.rows[0].user_id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const query = 'DELETE FROM social_network.posts WHERE id = ?';
    await client.execute(query, [id], { prepare: true });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
