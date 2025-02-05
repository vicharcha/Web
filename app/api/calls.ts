import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json({
      calls: [
        {
          id: "1",
          caller: "user1",
          receiver: "user2",
          status: "missed",
          timestamp: "2023-10-01T12:00:00Z",
        },
        {
          id: "2",
          caller: "user3",
          receiver: "user4",
          status: "answered",
          timestamp: "2023-10-02T14:30:00Z",
        },
      ],
    });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
