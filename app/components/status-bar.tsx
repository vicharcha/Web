import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { PlusCircle } from "lucide-react"

const statusUsers = [
  { name: "You", image: "/placeholder.svg?height=64&width=64" },
  { name: "Priya", image: "/placeholder.svg?height=64&width=64" },
  { name: "Rahul", image: "/placeholder.svg?height=64&width=64" },
  { name: "Anita", image: "/placeholder.svg?height=64&width=64" },
  { name: "Vikram", image: "/placeholder.svg?height=64&width=64" },
  { name: "Neha", image: "/placeholder.svg?height=64&width=64" },
  { name: "Amit", image: "/placeholder.svg?height=64&width=64" },
  { name: "Sonia", image: "/placeholder.svg?height=64&width=64" },
]

export function StatusBar() {
  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex w-max space-x-4 p-4">
        <div className="flex flex-col items-center space-y-1">
          <Avatar className="h-16 w-16 ring-2 ring-offset-2 ring-primary">
            <AvatarImage src="/placeholder.svg?height=64&width=64" alt="Your Story" />
            <AvatarFallback>
              <PlusCircle className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
          <span className="text-xs font-medium">Add Story</span>
        </div>
        {statusUsers.map((user) => (
          <div key={user.name} className="flex flex-col items-center space-y-1">
            <Avatar className="h-16 w-16 ring-2 ring-offset-2 ring-primary p-0.5 bg-gradient-to-br from-pink-500 to-violet-500">
              <AvatarImage src={user.image} alt={user.name} className="rounded-full" />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <span className="text-xs font-medium">{user.name}</span>
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}

