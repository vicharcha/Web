import { StatusBar } from "./components/status-bar"
import { Post } from "./components/post"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export default function Home() {
  const posts = [
    {
      username: "Priya Sharma",
      userImage: "/placeholder.svg?height=40&width=40",
      postImage: "/placeholder.svg?height=400&width=400",
      likes: 245,
      caption: "Just launched a new project! 🚀 #coding #innovation",
      comments: 23,
    },
    {
      username: "Rahul Patel",
      userImage: "/placeholder.svg?height=40&width=40",
      postImage: "/placeholder.svg?height=400&width=400",
      likes: 156,
      caption: "Great meeting with the team today. Exciting things coming up! 💡",
      comments: 18,
    },
    {
      username: "Anita Desai",
      userImage: "/placeholder.svg?height=40&width=40",
      postImage: "/placeholder.svg?height=400&width=400",
      likes: 302,
      caption: "Beautiful sunset at the beach 🌅 #nature #peace",
      comments: 31,
    },
  ]

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Home</h1>
        <Button size="sm">
          <PlusCircle className="mr-2 h-4 w-4" /> New Post
        </Button>
      </div>
      <ScrollArea className="w-full whitespace-nowrap rounded-md border">
        <StatusBar />
      </ScrollArea>
      {posts.map((post, index) => (
        <Post key={index} {...post} />
      ))}
    </div>
  )
}

