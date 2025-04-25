"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarDays, Eye } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { Pagination } from "@/components/ui/pagination"

interface News {
  id: string
  title: string
  excerpt: string
  created_at: string
  categories: { name: string } | null
  views: number
  image_url: string | null
}

export function NewsListClient() {
  const searchParams = useSearchParams()
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1
  const category = searchParams.get("category")
  const source = searchParams.get("source")
  const date = searchParams.get("date")
  const search = searchParams.get("search")

  const [news, setNews] = useState<News[]>([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const limit = 6

  useEffect(() => {
    async function fetchNews() {
      setLoading(true)
      const startIndex = (page - 1) * limit

      let query = supabase.from("news").select("*, categories(name)", { count: "exact" })

      // Apply filters
      if (category) {
        query = query.eq("categories.name", category)
      }

      if (search) {
        query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`)
      }

      if (date) {
        const now = new Date()
        const startDate = new Date()

        if (date === "today") {
          startDate.setHours(0, 0, 0, 0)
          query = query.gte("created_at", startDate.toISOString())
        } else if (date === "week") {
          startDate.setDate(now.getDate() - 7)
          query = query.gte("created_at", startDate.toISOString())
        } else if (date === "month") {
          startDate.setMonth(now.getMonth() - 1)
          query = query.gte("created_at", startDate.toISOString())
        } else if (date === "year") {
          startDate.setFullYear(now.getFullYear() - 1)
          query = query.gte("created_at", startDate.toISOString())
        }
      }

      const {
        data,
        error,
        count: totalCount,
      } = await query.order("created_at", { ascending: false }).range(startIndex, startIndex + limit - 1)

      if (error) {
        console.error("Error fetching news:", error)
      } else {
        setNews(data || [])
        setCount(totalCount || 0)
      }

      setLoading(false)
    }

    fetchNews()
  }, [page, category, source, date, search])

  const totalPages = Math.ceil(count / limit)

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading news...</p>
      </div>
    )
  }

  if (news.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No news found matching your criteria.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="space-y-6">
        {news.map((item) => (
          <Card key={item.id}>
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/4 h-48 md:h-auto">
                <img
                  src={item.image_url || "/placeholder.svg?height=200&width=300"}
                  alt={item.title}
                  className="object-cover w-full h-full rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
                />
              </div>

              <div className="flex-grow p-6">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-xl font-bold">{item.title}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <CalendarDays className="h-4 w-4" />
                        <span>{new Date(item.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{item.views} views</span>
                      </div>
                    </div>
                  </div>
                  <Badge>{item.categories?.name || "General"}</Badge>
                </div>

                <p className="text-muted-foreground mt-4 line-clamp-3">{item.excerpt}</p>
              </div>

              <div className="p-6 md:p-4 flex md:flex-col justify-between items-center md:items-end gap-4 border-t md:border-t-0 md:border-l">
                <Button asChild>
                  <Link href={`/news/${item.id}`}>Read More</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href={`/news/${item.id}`}>Share</Link>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {totalPages > 1 && <Pagination currentPage={page} totalPages={totalPages} basePath="/news" />}
    </div>
  )
}
