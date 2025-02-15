"use client";

import { useState, useEffect } from 'react';
import { useAuth } from "@/components/auth-provider"

type Post = {
  id: string;
  user: string;
  content: string;
  likes: number;
  comments: string[];
};

export default function Feed() {
  const { user } = useAuth();
  const [internalPosts, setInternalPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');

useEffect(() => {
  // Fetch posts from an API or local storage
  const fetchedPosts = [
    { id: '1', user: 'User1', content: 'Hello World!', likes: 5, comments: ['Nice post!'] },
    { id: '2', user: 'User2', content: 'Another post', likes: 3, comments: ['Cool!'] },
  ];
  setInternalPosts(fetchedPosts);
}, []);

const handleCreatePost = () => {
  if (newPost.trim() === '') return;

  const newPostObj = {
    id: (internalPosts.length + 1).toString(),
    user: user?.name || 'Anonymous',
    content: newPost,
    likes: 0,
    comments: [],
  };

  setInternalPosts([newPostObj, ...internalPosts]);
  setNewPost('');
};

const handleLike = (postId: string) => {
  setInternalPosts(internalPosts.map(post => post.id === postId ? { ...post, likes: post.likes + 1 } : post));
};

const handleComment = (postId: string, comment: string) => {
  setInternalPosts(internalPosts.map(post => post.id === postId ? { ...post, comments: [...post.comments, comment] } : post));
};

return (
  <div className="w-full max-w-2xl mx-auto p-4">
    <div className="mb-4">
      <textarea
        value={newPost}
        onChange={(e) => setNewPost(e.target.value)}
        className="w-full p-2 border rounded"
        placeholder="What's on your mind?"
      />
      <button
        onClick={handleCreatePost}
        className="mt-2 bg-blue-500 text-white py-2 px-4 rounded"
      >
        Post
      </button>
    </div>
    <div>
      {internalPosts.map(post => (
        <div key={post.id} className="mb-4 p-4 border rounded">
          <h3 className="text-lg font-semibold">{post.user}</h3>
          <p>{post.content}</p>
          <div className="flex items-center mt-2">
            <button
              onClick={() => handleLike(post.id)}
              className="mr-2 text-blue-500"
            >
              Like ({post.likes})
            </button>
            <button
              onClick={() => handleComment(post.id, prompt('Enter your comment:') || '')}
              className="text-blue-500"
            >
              Comment
            </button>
          </div>
          <div className="mt-2">
            {post.comments.map((comment, index) => (
              <p key={index} className="text-gray-600">{comment}</p>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);
}
