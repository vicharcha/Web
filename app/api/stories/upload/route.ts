import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { existsSync, mkdirSync } from 'fs'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    // Read file data
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Determine file type and directory
    const isVideo = file.type.startsWith('video/')
    const directory = isVideo ? 'videos' : 'images'
    const targetDirectory = join(process.cwd(), 'public', directory)

    // Create directory if it doesn't exist
    if (!existsSync(targetDirectory)) {
      mkdirSync(targetDirectory, { recursive: true })
    }

    // Generate unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    const extension = file.name.split('.').pop()
    const filename = `story-${uniqueSuffix}.${extension}`
    const filepath = join(targetDirectory, filename)

    // Write file
    await writeFile(filepath, buffer)

    // Return the public URL
    const publicUrl = `/${directory}/${filename}`

    return NextResponse.json({ url: publicUrl })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}
