import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserPlus, X } from "lucide-react"

interface ConnectionSuggestion {
  id: string
  name: string
  avatar: string
  mutualConnections: number
  profession: string
}

const suggestionData: ConnectionSuggestion[] = [
  {
    id: "1",
    name: "Alice Johnson",
    avatar: "/placeholder.svg?1",
    mutualConnections: 12,
    profession: "Software Engineer",
  },
  {
    id: "2",
    name: "Bob Smith",
    avatar: "/placeholder.svg?2",
    mutualConnections: 8,
    profession: "Product Manager",
  },
  {
    id: "3",
    name: "Charlie Brown",
    avatar: "/placeholder.svg?3",
    mutualConnections: 15,
    profession: "UX Designer",
  },
  // Add more suggestions...
]

export function ConnectionSuggestions() {
  const [suggestions, setSuggestions] = useState(suggestionData)

  const handleConnect = (id: string) => {
    // In a real app, you would send a connection request here
    console.log(`Connecting with user ${id}`)
    setSuggestions(suggestions.filter((suggestion) => suggestion.id !== id))
  }

  const handleDismiss = (id: string) => {
    setSuggestions(suggestions.filter((suggestion) => suggestion.id !== id))
  }

  return (
    <Card className="w-full max-w-2xl mx-auto mb-4">
      <CardHeader>
        <CardTitle>People You May Know</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suggestions.map((suggestion) => (
            <Card key={suggestion.id} className="flex items-center p-4">
              <Avatar className="h-12 w-12 mr-4">
                <AvatarImage src={suggestion.avatar} alt={suggestion.name} />
                <AvatarFallback>{suggestion.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold">{suggestion.name}</h3>
                <p className="text-sm text-muted-foreground">{suggestion.profession}</p>
                <p className="text-xs text-muted-foreground">{suggestion.mutualConnections} mutual connections</p>
              </div>
              <div className="flex flex-col space-y-2">
                <Button size="sm" onClick={() => handleConnect(suggestion.id)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Connect
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleDismiss(suggestion.id)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
