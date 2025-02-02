import { query } from '../db'

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
    const res = await query<HomeData>('SELECT * FROM home_data')
    return res.rows
  } catch (error) {
    console.error('Error fetching home data', error)
    throw error
  }
}
