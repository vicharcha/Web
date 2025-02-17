"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { MLPostAnalysis, MLStoriesAnalysis, MLRecommendations } from "@/lib/types"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/components/ui/use-toast"

interface MLContextType {
  postAnalysis: MLPostAnalysis | null
  storiesAnalysis: MLStoriesAnalysis | null
  recommendations: MLRecommendations | null
  isLoading: boolean
  refreshAnalysis: () => Promise<void>
}

const MLContext = createContext<MLContextType | undefined>(undefined)

export function MLProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [postAnalysis, setPostAnalysis] = useState<MLPostAnalysis | null>(null)
  const [storiesAnalysis, setStoriesAnalysis] = useState<MLStoriesAnalysis | null>(null)
  const [recommendations, setRecommendations] = useState<MLRecommendations | null>(null)

  const fetchMLAnalysis = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
  
    try {
      setIsLoading(true);
      // Fetch posts and stories to provide actual data for ML analysis
      const postsResponse = await fetch("/api/posts?category=general");
      const posts = await postsResponse.json();
  
      const storiesResponse = await fetch("/api/stories");
      const stories = await storiesResponse.json();
  
      const response = await fetch("/api/ml/homepage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          age: user.age || 0,
          isAgeVerified: user.isAgeVerified || false,
          posts, 
          stories
        })
      });
  
      if (!response.ok) throw new Error("ML analysis failed");
  
      const data = await response.json();
      setPostAnalysis(data.post_analysis);
      setStoriesAnalysis(data.stories_analysis);
      setRecommendations(data.recommendations);
    } catch (error) {
      console.error("Error fetching ML analysis:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch content analysis"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMLAnalysis()
  }, [user])

  return (
    <MLContext.Provider
      value={{
        postAnalysis,
        storiesAnalysis,
        recommendations,
        isLoading,
        refreshAnalysis: fetchMLAnalysis
      }}
    >
      {children}
    </MLContext.Provider>
  )
}

export function useML() {
  const context = useContext(MLContext)
  if (context === undefined) {
    throw new Error("useML must be used within a MLProvider")
  }
  return context
}
