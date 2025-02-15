"use client";

import { 
  Bookmark,
  MessageCircle, 
  Share2,
  ThumbsUp,
  Check
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { CommentDialog } from "./comment-dialog";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ShareDialog } from "./share-dialog";
import { type FeedPost, PostCategories } from "@/lib/types";
import { useAuth } from "@/components/auth-provider";

interface PostProps extends FeedPost {
  onLike?: () => void;
  onBookmark?: () => void;
}

export function Post({
  id,
  username,
  userImage,
  content,
  mediaUrls,
  likes,
  comments,
  shares,
  isLiked: initialIsLiked,
  isBookmarked: initialIsBookmarked,
  category,
  isPremium,
  isVerified,
  timestamp = new Date().toISOString(),
  onLike,
  onBookmark
}: PostProps) {
  const { user } = useAuth();
  const [image, video] = mediaUrls || [];
  const [showComments, setShowComments] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [localCommentCount, setLocalCommentCount] = useState(comments);

  const handleLike = () => {
    if (!user) {
      return; // Could show a login prompt here
    }
    if (onLike) {
      onLike();
    }
  };

  const handleBookmark = async () => {
    if (!user) {
      return; // Could show a login prompt here
    }
    if (onBookmark) {
      onBookmark();
    } else {
      try {
        const method = initialIsBookmarked ? 'DELETE' : 'POST';
        const response = await fetch('/api/social/bookmark', {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            postId: id,
            userId: user.phoneNumber
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update bookmark');
        }
      } catch (error) {
        console.error('Error updating bookmark:', error);
      }
    }
  };

  const handleAddComment = (comment: string): void => {
    setLocalCommentCount(prev => prev + 1);
  };

  return (
    <>
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
                  <p className="font-semibold hover:text-primary transition-colors cursor-pointer">
                    {username}
                  </p>
                  {isVerified && (
                    <div className="h-4 w-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                  {isPremium && (
                    <Badge variant="outline" className="text-xs font-normal">
                      Premium
                    </Badge>
                  )}
                </div>
                <div className="flex gap-1 flex-wrap mt-1">
                  <Badge 
                    key={`${id}-${category}`} 
                    variant="secondary" 
                    className="text-[10px] px-2 py-0 hover:bg-secondary/80 transition-colors cursor-pointer"
                  >
                    {category}
                  </Badge>
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
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLike}
                aria-label={`Like post. ${likes} likes`}
                className={cn(
                  "group flex items-center gap-2 transition-colors duration-200",
                  initialIsLiked ? "text-blue-500" : "text-muted-foreground hover:text-blue-500"
                )}
              >
                <ThumbsUp className={cn(
                  "h-5 w-5 transition-all duration-200",
                  initialIsLiked ? "scale-110" : "group-hover:scale-110"
                )} />
                <span className="text-sm font-medium">{likes}</span>
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowComments(true)}
                aria-label={`Comment on post. ${localCommentCount} comments`}
                className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                <MessageCircle className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                <span className="text-sm font-medium">{localCommentCount}</span>
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowShare(true)}
                aria-label={`Share post. ${shares} shares`}
                className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                <Share2 className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                <span className="text-sm font-medium">{shares}</span>
              </motion.button>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBookmark}
              aria-label={initialIsBookmarked ? "Remove bookmark" : "Bookmark post"}
              className={cn(
                "group transition-colors duration-200",
                initialIsBookmarked ? "text-primary" : "text-muted-foreground hover:text-primary"
              )}
            >
              <Bookmark className={cn(
                "h-5 w-5 transition-all duration-200",
                initialIsBookmarked ? "scale-110 fill-current" : "group-hover:scale-110"
              )} />
            </motion.button>
          </div>
        </div>
      </Card>

      {/* Comment Dialog */}
      <CommentDialog
        variant="sidebar"
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        post={{
          id,
          userId: id,
          content,
          category,
          mediaUrls,
          likes,
          comments: localCommentCount,
          shares,
          createdAt: timestamp,
          updatedAt: timestamp,
          timestamp,
          isLiked: initialIsLiked,
          isBookmarked: initialIsBookmarked,
          isVerified,
          isPremium,
          username,
          userImage,
          categories: [category]
        }}
        onAddComment={handleAddComment}
      />

      {/* Share Dialog */}
      <ShareDialog 
        isOpen={showShare}
        onClose={() => setShowShare(false)}
        post={{
          id,
          userId: id,
          content,
          category,
          mediaUrls,
          likes,
          comments: localCommentCount,
          shares,
          createdAt: timestamp,
          updatedAt: timestamp,
          timestamp,
          isLiked: initialIsLiked,
          isBookmarked: initialIsBookmarked,
          isVerified,
          isPremium,
          username,
          userImage,
          categories: [category]
        }}
      />
    </>
  );
}
