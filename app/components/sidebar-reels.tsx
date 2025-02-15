"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronUp, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ReelPlayer } from "@/components/reel-player"
import { CommentDialog } from "@/components/comment-dialog"
import { ShareDialog } from "@/components/share-dialog"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"
import { type FeedPost, type PostCategory, PostCategories } from "@/lib/types"

interface Comment {
  id: number;
  username: string;
  content: string;
  timestamp: string;
  likes: number;
  isPremium?: boolean;
}

interface Reel {
  id: number;
  username: string;
  userImage: string;
  videoUrl: string;
  title: string;
  description: string;
  likes: number;
  comments: number;
  shares: number;
  isVerified: boolean;
  isPremium: boolean;
  timestamp: string;
  comments_data: Comment[];
}

const reels: Reel[] = [
  {
    id: 1,
    username: "johndoe",
    userImage: "/placeholder-user.jpg",
    videoUrl: "/placeholder.mp4",
    title: "Check out this amazing view! 🌅",
    description: "Beautiful sunset at the beach #sunset #vibes",
    likes: 1200,
    comments: 89,
    shares: 45,
    isVerified: true,
    isPremium: true,
    timestamp: new Date().toISOString(),
    comments_data: Array(89).fill({}).map((_, i) => ({
      id: i + 1,
      username: `user${i + 1}`,
      content: "Amazing view! 🌅",
      timestamp: new Date().toISOString(),
      likes: Math.floor(Math.random() * 100),
      isPremium: Math.random() > 0.8
    }))
  },
  {
    id: 2,
    username: "sarahsmith",
    userImage: "/placeholder-user.jpg",
    videoUrl: "/placeholder.mp4",
    title: "New dance challenge 💃",
    description: "Try this new dance trend! #dancechallenge",
    likes: 3500,
    comments: 245,
    shares: 123,
    isVerified: false,
    isPremium: false,
    timestamp: new Date().toISOString(),
    comments_data: Array(245).fill({}).map((_, i) => ({
      id: i + 1,
      username: `user${i + 1}`,
      content: "Great moves! 🔥",
      timestamp: new Date().toISOString(),
      likes: Math.floor(Math.random() * 100),
      isPremium: Math.random() > 0.8
    }))
  },
  {
    id: 3,
    username: "+91 91828 83649",
    userImage: "/placeholder-user.jpg",
    videoUrl: "/placeholder.mp4",
    title: "Tech tutorial",
    description: "Quick tips for developers #coding #tech",
    likes: 850,
    comments: 56,
    shares: 22,
    isVerified: false,
    isPremium: true,
    timestamp: new Date().toISOString(),
    comments_data: Array(56).fill({}).map((_, i) => ({
      id: i + 1,
      username: `user${i + 1}`,
      content: "Very helpful! 👨‍💻",
      timestamp: new Date().toISOString(),
      likes: Math.floor(Math.random() * 100),
      isPremium: Math.random() > 0.8
    }))
  }
];

export function SidebarReels() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedReel, setSelectedReel] = useState<number | null>(null);
  const [showComments, setShowComments] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleCommentClick = (reelId: number) => {
    setSelectedReel(reelId);
    setShowComments(true);
  };

  const handleShareClick = (reelId: number) => {
    setSelectedReel(reelId);
    setShowShare(true);
  };

  const handleCommentClose = () => {
    setShowComments(false);
    setSelectedReel(null);
  };

  const handleShareClose = () => {
    setShowShare(false);
    setSelectedReel(null);
  };

  const scrollToReel = (index: number) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const itemHeight = container.clientHeight;
      container.scrollTo({
        top: index * itemHeight,
        behavior: "smooth"
      });
      setCurrentIndex(index);
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollPosition = container.scrollTop;
      const itemHeight = container.clientHeight;
      const newIndex = Math.round(scrollPosition / itemHeight);
      setCurrentIndex(newIndex);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const selectedReelData = selectedReel ? reels.find(r => r.id === selectedReel) : null;

  return (
    <div className="relative h-[calc(100vh-6rem)]">
      {/* Navigation Controls - Fixed on sides */}
      {!isMobile && (
        <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 text-white border-white/20",
                "hover:border-white/40 transition-all duration-300",
                "disabled:opacity-50"
              )}
              onClick={() => scrollToReel(currentIndex - 1)}
              disabled={currentIndex === 0}
            >
              <ChevronUp className="h-6 w-6" />
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 text-white border-white/20",
                "hover:border-white/40 transition-all duration-300",
                "disabled:opacity-50"
              )}
              onClick={() => scrollToReel(currentIndex + 1)}
              disabled={currentIndex === reels.length - 1}
            >
              <ChevronDown className="h-6 w-6" />
            </Button>
          </motion.div>
        </div>
      )}

      {/* Reels Container */}
      <div 
        ref={scrollContainerRef}
        className="h-full overflow-y-auto snap-y snap-mandatory scrollbar-none"
        style={{ 
          scrollSnapType: "y mandatory",
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        <style jsx global>{`
          .scrollbar-none::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {reels.map((reel, index) => (
          <motion.div 
            key={index}
            className="h-full snap-start snap-always"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <ReelPlayer
              id={reel.id}
              username={reel.username}
              userImage={reel.userImage}
              videoUrl={reel.videoUrl}
              title={reel.title}
              description={reel.description}
              likes={reel.likes}
              comments={reel.comments}
              shares={reel.shares}
              isVerified={reel.isVerified}
              onCommentClick={() => handleCommentClick(reel.id)}
              onShareClick={() => handleShareClick(reel.id)}
            />
          </motion.div>
        ))}
      </div>

      {/* Comment Dialog */}
      {selectedReelData && (
        <CommentDialog
          variant="sidebar"
          isOpen={showComments}
          onClose={handleCommentClose}
          post={{
            id: selectedReelData.id.toString(),
            userId: selectedReelData.id.toString(),
            category: PostCategories.ENTERTAINMENT,
            ageRestricted: false,
            mediaUrls: [selectedReelData.videoUrl],
            createdAt: new Date(selectedReelData.timestamp),
            updatedAt: new Date(selectedReelData.timestamp),
            username: selectedReelData.username,
            userImage: selectedReelData.userImage,
            content: selectedReelData.description,
            likes: selectedReelData.likes,
            comments: selectedReelData.comments_data.length,
            shares: selectedReelData.shares,
            isLiked: false,
            isBookmarked: false,
            categories: [PostCategories.ENTERTAINMENT],
            isSponsored: false,
            isPremium: selectedReelData.isPremium,
            isVerified: selectedReelData.isVerified,
            timestamp: selectedReelData.timestamp
          }}
          onAddComment={() => {}}
        />
      )}

      {/* Share Dialog */}
      {selectedReelData && (
        <ShareDialog
          isOpen={showShare}
          onClose={handleShareClose}
          post={{
            id: selectedReelData.id.toString(),
            userId: selectedReelData.id.toString(),
            category: PostCategories.ENTERTAINMENT,
            ageRestricted: false,
            mediaUrls: [selectedReelData.videoUrl],
            createdAt: new Date(selectedReelData.timestamp),
            updatedAt: new Date(selectedReelData.timestamp),
            username: selectedReelData.username,
            userImage: selectedReelData.userImage,
            content: selectedReelData.description,
            likes: selectedReelData.likes,
            comments: selectedReelData.comments_data.length,
            shares: selectedReelData.shares,
            isLiked: false,
            isBookmarked: false,
            categories: [PostCategories.ENTERTAINMENT],
            isSponsored: false,
            isPremium: selectedReelData.isPremium,
            isVerified: selectedReelData.isVerified,
            timestamp: selectedReelData.timestamp
          }}
        />
      )}
    </div>
  );
}
