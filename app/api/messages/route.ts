import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { authOptions } from "../auth/[...nextauth]/route"

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const receiverId = searchParams.get("receiverId")

  if (!receiverId) {
    return new NextResponse("Receiver ID is required", { status: 400 })
  }

  const messages = await prisma.message.findMany({
    where: {
      OR: [
        {
          senderId: session.user.id,
          receiverId: receiverId,
        },
        {
          senderId: receiverId,
          receiverId: session.user.id,
        },
      ],
    },
    orderBy: {
      createdAt: "asc",
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  })

  return NextResponse.json(messages)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const json = await req.json()
  const { content, receiverId, type = "TEXT", mediaUrl } = json

  if (!content || !receiverId) {
    return new NextResponse("Missing required fields", { status: 400 })
  }

  const message = await prisma.message.create({
    data: {
      content,
      type,
      mediaUrl,
      senderId: session.user.id,
      receiverId,
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  })

  return NextResponse.json(message)
}

