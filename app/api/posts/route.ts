import { NextRequest, NextResponse } from 'next/server';

// Make route dynamic
export const dynamic = 'force-dynamic';
import { createPost, getPosts, deletePost } from '@/lib/db/client'
import { PostCategories, type PostCategory } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const { content, category, mediaUrls = [], userId } = data

    // Validate category
    if (!Object.values(PostCategories).includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      )
    }

    // Check if content should be age restricted
    const isAdultContent = category === PostCategories.ADULT

    const post = await createPost({
      userId,
      content,
      category,
      ageRestricted: isAdultContent,
      mediaUrls
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = new URL(req.url).searchParams
    const category = searchParams.get('category')
    const userAge = parseInt(searchParams.get('userAge') || '0', 10)

    // Filter out adult content for underage users
    const isAdultAllowed = userAge >= 18
    const showAdultContent = category === PostCategories.ADULT && isAdultAllowed

    const posts = await getPosts({
      category: category ? (category as PostCategory) : undefined,
      ageRestricted: showAdultContent ? undefined : false
    })

    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id, userId } = await req.json()

    await deletePost(id, userId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting post:', error)
    let status = 500
    let message = 'Failed to delete post'

    if (error instanceof Error) {
      if (error.message === 'Post not found') {
        status = 404
        message = 'Post not found'
      } else if (error.message === 'Unauthorized') {
        status = 403
        message = 'Unauthorized'
      }
    }

    return NextResponse.json(
      { error: message },
      { status }
    )
  }
}
