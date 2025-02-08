import { 
  Bookmark,
  MessageCircle, 
  Share2,
  ThumbsUp
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

interface PostProps {
  id: number | string;
  username: string;
  userImage: string;
  content: string;
  image?: string;
  video?: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isBookmarked: boolean;
  categories: string[];
  isSponsored?: boolean;
}

export function Post({
  id,
  username,
  userImage,
  content,
  image,
  video,
  likes,
  comments,
  shares,
  isLiked,
  isBookmarked,
  categories,
  isSponsored
}: PostProps) {
  return (
    <Card className="mb-4 overflow-hidden hover:shadow-lg transition-shadow duration-200 group">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 ring-2 ring-offset-2 ring-offset-background ring-primary/10 group-hover:ring-primary/20 transition-all duration-200">
              <AvatarImage src={userImage} alt={username} />
              <AvatarFallback>{username[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold hover:text-primary transition-colors cursor-pointer">{username}</p>
                {isSponsored && (
                  <Badge variant="outline" className="text-xs font-normal">Sponsored</Badge>
                )}
              </div>
              <div className="flex gap-1 flex-wrap mt-1">
                {categories.map((category) => (
                  <Badge 
                    key={`${id}-${category}`} 
                    variant="secondary" 
                    className="text-[10px] px-2 py-0 hover:bg-secondary/80 transition-colors cursor-pointer"
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {content && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {content}
            </p>
          )}
          {image && (
            <div className="relative rounded-lg overflow-hidden bg-muted">
              <img 
                src={image} 
                alt={`Post by ${username}`} 
                className="w-full object-cover hover:scale-105 transition-transform duration-500" 
              />
            </div>
          )}
          {video && (
            <div className="relative rounded-lg overflow-hidden bg-muted">
              <video 
                src={video} 
                controls 
                className="w-full hover:scale-105 transition-transform duration-500"
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t">
          <div className="flex items-center gap-4">
            <button
              aria-label={`Like post. ${likes} likes`}
              className={`group flex items-center gap-2 transition-colors duration-200 ${
                isLiked ? "text-blue-500" : "text-muted-foreground hover:text-blue-500"
              }`}
            >
              <ThumbsUp className={`h-5 w-5 transition-all duration-200 ${
                isLiked ? "scale-110" : "group-hover:scale-110"
              }`} />
              <span className="text-sm font-medium">{likes}</span>
            </button>
            <button 
              aria-label={`Comment on post. ${comments} comments`}
              className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              <MessageCircle className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
              <span className="text-sm font-medium">{comments}</span>
            </button>
            <button 
              aria-label={`Share post. ${shares} shares`}
              className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              <Share2 className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
              <span className="text-sm font-medium">{shares}</span>
            </button>
          </div>
          <button
            aria-label={isBookmarked ? "Remove bookmark" : "Bookmark post"}
            className={`group transition-colors duration-200 ${
              isBookmarked ? "text-primary" : "text-muted-foreground hover:text-primary"
            }`}
          >
            <Bookmark className={`h-5 w-5 transition-all duration-200 ${
              isBookmarked ? "scale-110 fill-current" : "group-hover:scale-110"
            }`} />
          </button>
        </div>
      </div>
    </Card>
  )
}
