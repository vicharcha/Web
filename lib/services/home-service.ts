export interface HomeData {
  username: string;
  userImage: string;
  postImage: string;
  likes: number;
  caption: string;
  comments: number;
}

export async function getHomeData(): Promise<HomeData[]> {
  try {
    // Simulate fetching home data
    const homeData: HomeData[] = [
      {
        username: 'user1',
        userImage: 'https://example.com/user1.jpg',
        postImage: 'https://example.com/post1.jpg',
        likes: 100,
        caption: 'First post!',
        comments: 10,
      },
      {
        username: 'user2',
        userImage: 'https://example.com/user2.jpg',
        postImage: 'https://example.com/post2.jpg',
        likes: 200,
        caption: 'Second post!',
        comments: 20,
      },
    ];
    return homeData;
  } catch (error) {
    console.error('Error fetching home data', error);
    throw error;
  }
}
