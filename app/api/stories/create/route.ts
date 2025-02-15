import { NextRequest, NextResponse } from 'next/server';

// Mock storage - replace with actual file storage service
const mockSaveFile = async (file: File): Promise<string> => {
  // In a real implementation, this would upload to a storage service
  // and return the URL
  return `/placeholder.jpg`;
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const userId = formData.get('userId') as string;
    const files = formData.getAll('files') as File[];

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (files.length === 0) {
      return NextResponse.json(
        { error: 'At least one file is required' },
        { status: 400 }
      );
    }

    if (files.length > 10) {
      return NextResponse.json(
        { error: 'Maximum 10 files allowed' },
        { status: 400 }
      );
    }

    // Process files and create story items
    const storyItems = await Promise.all(
      files.map(async (file) => {
        const url = await mockSaveFile(file);
        return {
          id: crypto.randomUUID(),
          url,
          type: file.type.startsWith('video/') ? 'video' : 'image',
          duration: file.type.startsWith('video/') ? 10 : undefined // Default video duration
        };
      })
    );

    // Create story
    const story = {
      id: crypto.randomUUID(),
      userId,
      items: storyItems,
      createdAt: new Date().toISOString(),
      category: 'general', // Default category
      downloadable: true,
      isAdult: false // Default to non-adult content
    };

    // TODO: Save story to database
    console.log('Created story:', story);

    return NextResponse.json({
      success: true,
      message: 'Story created successfully',
      story
    });

  } catch (error) {
    console.error('Error creating story:', error);
    return NextResponse.json(
      { error: 'Failed to create story' },
      { status: 500 }
    );
  }
}
