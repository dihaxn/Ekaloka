import { NextApiRequest, NextApiResponse } from 'next'

export function withCORS(handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*') // In production, restrict this to your domain
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
    res.setHeader('Access-Control-Allow-Credentials', 'true')

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.status(200).end()
      return
    }

    // Call the actual handler
    await handler(req, res)
  }
}
