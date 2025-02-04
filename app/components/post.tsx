import { Avatar, AvatarFallback, AvatarImage } from "components/ui/avatar"
import { Button } from "components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "components/ui/card"
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from "lucide-react"

interface PostProps {
  id: string
  username: string
  userImage: string
  postImage?: string
  postVideo?: string
  postAudio?: string
  likes: number
  caption: string
  comments: number
}

export function Post({
  id,
  username,
  userImage,
  postImage,
  postVideo,
  postAudio,
  likes,
  caption,
  comments,
}: PostProps) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-row items-center space-x-4 p-4">
        <Avatar>
          <AvatarImage src={userImage} alt={username} />
          <AvatarFallback>{username[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="font-semibold">{username}</div>
        </div>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {postImage && <img src={postImage || "/placeholder.svg"} alt="Post" className="w-full h-auto" />}
        {postVideo && <video src={postVideo} className="w-full h-auto" controls />}
        {postAudio && <audio src={postAudio} className="w-full" controls />}
      </CardContent>
      <CardFooter className="flex flex-col items-start p-4">
        <div className="flex justify-between w-full mb-2">
          <div className="flex space-x-4">
            <Button variant="ghost" size="icon">
              <Heart className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon">
              <MessageCircle className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon">
              <Send className="h-6 w-6" />
            </Button>
          </div>
          <Button variant="ghost" size="icon">
            <Bookmark className="h-6 w-6" />
          </Button>
        </div>
        <div className="font-semibold">{likes} likes</div>
        <div>
          <span className="font-semibold">{username}</span> {caption}
        </div>
        <Button variant="link" className="p-0 h-auto text-muted-foreground">
          View all {comments} comments
        </Button>
      </CardFooter>
    </Card>
  )
}
