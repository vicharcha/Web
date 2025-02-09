// Types and constants that can be used on both client and server
export const PostCategories = {
  GENERAL: 'general',
  NEWS: 'news',
  ENTERTAINMENT: 'entertainment',
  SPORTS: 'sports',
  TECHNOLOGY: 'technology',
  ADULT: 'adult'
} as const;

export type PostCategory = typeof PostCategories[keyof typeof PostCategories];

export interface Post {
  id: string;
  userId: string;
  content: string;
  category: PostCategory;
  ageRestricted: boolean;
  mediaUrls: string[];
  createdAt: Date;
  updatedAt: Date;
}
