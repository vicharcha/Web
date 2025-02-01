import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Phone, Video, MoreVertical } from "lucide-react"

export default function Calls() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Recent Calls</h1>
      <Input placeholder="Search calls" className="mb-6" />
      <div className="space-y-4">
        {[
          { name: "Priya Sharma", date: "2023-05-15", time: "14:30" },
          { name: "Rahul Patel", date: "2023-05-14", time: "10:15" },
          { name: "Anita Desai", date: "2023-05-13", time: "18:45" },
        ].map((call, index) => (
          <div key={index} className="flex items-center justify-between bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={call.name} />
                <AvatarFallback>
                  {call.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{call.name}</p>
                <p className="text-sm text-gray-400">
                  {call.date} {call.time}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button size="icon" variant="ghost">
                <Phone size={18} />
              </Button>
              <Button size="icon" variant="ghost">
                <Video size={18} />
              </Button>
              <Button size="icon" variant="ghost">
                <MoreVertical size={18} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

