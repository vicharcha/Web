export interface User {
  id: string
  name: string | null
  email: string | null
  phone: string
  image: string | null
  createdAt: Date
  updatedAt: Date
  status: string
  role: string
}

export interface Message {
  id: string
  content: string
  type: string
  mediaUrl: string | null
  createdAt: Date
  updatedAt: Date
  senderId: string
  receiverId: string
  isRead: boolean
  sender: {
    id: string
    name: string | null
    image: string | null
  }
}

export interface Post {
  id: string
  content: string
  images: string[]
  createdAt: Date
  updatedAt: Date
  userId: string
  user: {
    id: string
    name: string | null
    image: string | null
  }
  likes: {
    userId: string
  }[]
  _count: {
    comments: number
    likes: number
  }
}

