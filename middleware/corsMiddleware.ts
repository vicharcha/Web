import cors from 'cors';
import type { NextApiRequest, NextApiResponse } from 'next';

const corsHandler = cors({
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  origin: process.env.ALLOWED_ORIGIN || "http://localhost:3000",
  optionsSuccessStatus: 200,
});

export function corsMiddleware(req: NextApiRequest, res: NextApiResponse) {
  return new Promise((resolve, reject) => {
    corsHandler(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result)
      }
      return resolve(result)
    })
  })
}

