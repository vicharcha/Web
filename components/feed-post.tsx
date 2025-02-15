"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import {
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  MoreHorizontal,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

import type { Post } from "@/lib/types";

interface PostProps {
  post: Post;
  onLike: (postId: string) => Promise<void>;
  onComment: (postId: string) => void;
  onShare: (postId: string) => void;
  onSave: (postId: string) => Promise<void>;
}

export function Post({ post, onLike, onComment, onShare, onSave }: PostProps) {
  const { toast } = useToast();
  const [showFullContent, setShowFullContent] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);

  const contentPreview = post.content.slice(0, 150);
  const hasMoreContent = post.content.length > 150;

  const handleLike = async () => {
    if (isLiking) return;

    if (post.tokens > 500) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "This post exceeds the token limit",
      });
      return;
    }

    setIsLiking(true);
    try {
      await onLike(post.id);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to like post",
      });
    } finally {
      setIsLiking(false);
    }
  };

  const handleBookmark = async () => {
    if (isBookmarking) return;

    setIsBookmarking(true);
    try {
      await onSave(post.id);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to bookmark post",
      });
    } finally {
      setIsBookmarking(false);
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={post.userImage} />
              <AvatarFallback>{post.username[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{post.username}</p>
              <p className="text-xs text-muted-foreground">{post.timestamp}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div>
          {showFullContent ? (
            <p className="text-sm">{post.content}</p>
          ) : (
            <p className="text-sm">
              {contentPreview}
              {hasMoreContent && (
                <button
                  onClick={() => setShowFullContent(true)}
                  className="text-primary hover:underline ml-1"
                >
                  See more
                </button>
              )}
            </p>
          )}
        </div>

        {/* Media */}
        {post.mediaUrls.length > 0 && (
          <div className="aspect-video relative rounded-lg overflow-hidden">
            <img
              src={post.mediaUrls[0]}
              alt="Post content"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 relative"
              onClick={handleLike}
              disabled={isLiking}
            >
              <Heart
                className={cn(
                  "h-5 w-5",
                  post.isLiked && "fill-red-500 text-red-500",
                  isLiking && "opacity-0"
                )}
              />
              {isLiking && (
                <Loader2 className="h-5 w-5 animate-spin absolute inset-0 m-auto" />
              )}
              <span className={isLiking ? "opacity-50" : ""}>
                {post.likes > 0 && post.likes}
              </span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => onComment(post.id)}
            >
              <MessageSquare className="h-5 w-5" />
              {post.comments > 0 && post.comments}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => onShare(post.id)}
            >
              <Share2 className="h-5 w-5" />
              {post.shares > 0 && post.shares}
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBookmark}
            disabled={isBookmarking}
            className={cn(
              "relative",
              post.isBookmarked && "text-primary"
            )}
          >
            <Bookmark
              className={cn(
                "h-5 w-5",
                post.isBookmarked && "fill-current",
                isBookmarking && "opacity-0"
              )}
            />
            {isBookmarking && (
              <Loader2 className="h-5 w-5 animate-spin absolute inset-0 m-auto" />
            )}
          </Button>
        </div>

        {/* Token indicator */}
        <div className="text-xs text-muted-foreground">
          {post.tokens} tokens
        </div>
      </div>
    </Card>
  );
}
