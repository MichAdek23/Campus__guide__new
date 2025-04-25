import type { NextApiRequest, NextApiResponse } from "next"
import { getScholarshipsApi } from "@/lib/supabase/data-fetching"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { page, limit, ...filters } = req.query

  const pageNum = typeof page === "string" ? Number.parseInt(page) : 1
  const limitNum = typeof limit === "string" ? Number.parseInt(limit) : 10

  try {
    const scholarships = await getScholarshipsApi(pageNum, limitNum, filters)
    res.status(200).json(scholarships)
  } catch (error) {
    console.error("Error fetching scholarships:", error)
    res.status(500).json({ error: "Failed to fetch scholarships" })
  }
}
