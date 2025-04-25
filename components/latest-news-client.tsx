"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarDays, Eye } from "lucide-react"
import { format } from "date-fns"
import { supabase } from "@/lib/supabase/client"

interface News {
  id: string
  title: string
  excerpt: string
  created_at: string
  categories: { name: string } | null
  views: number
  image_url: string | null
}

interface LatestNewsProps {
  limit?: number
}

export function LatestNewsClient({ limit = 3 }: LatestNewsProps) {
  const [news, setNews] = useState<News[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchNews() {
      const { data, error } = await supabase
        .from("news")
        .select("*, categories(name)")
        .order("created_at", { ascending: false })
        .limit(limit)

      if (!error && data) {
        setNews(data)
      }
      setIsLoading(false)
    }

    fetchNews()
  }, [limit])

  if (isLoading) {
    return (
      <section className="py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Latest News</h2>
            <p className="text-muted-foreground mt-1">Loading news...</p>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array(limit)
            .fill(0)
            .map((_, i) => (
              <Card key={i} className="flex flex-col">
                <div className="relative h-48 w-full bg-muted"></div>
                <CardHeader className="pb-3">
                  <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                </CardHeader>
                <CardContent className="pb-4 flex-grow">
                  <div className="h-4 bg-muted rounded w-full mb-2"></div>
                  <div className="h-4 bg-muted rounded w-full mb-2"></div>
                  <div className="h-4 bg-muted rounded w-2/3 mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-muted rounded w-1/3"></div>
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0 mt-auto">
                  <div className="h-10 bg-muted rounded w-full"></div>
                </CardFooter>
              </Card>
            ))}
        </div>
      </section>
    )
  }

  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Latest News</h2>
          <p className="text-muted-foreground mt-1">Stay updated with the latest educational news</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/news">View All</Link>
        </Button>
      </div>

      {news.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No news articles available at the moment.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {news.map((item) => (
            <Card key={item.id} className="flex flex-col">
              <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                <img
                  src={item.image_url || "/placeholder.svg?height=200&width=300"}
                  alt={item.title}
                  className="object-cover w-full h-full"
                />
                <Badge className="absolute top-2 right-2">{item.categories?.name || "General"}</Badge>
              </div>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl line-clamp-2">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="pb-4 flex-grow">
                <p className="text-muted-foreground line-clamp-3 mb-4">{item.excerpt}</p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{format(new Date(item.created_at), "MMM d, yyyy")}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{item.views}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0 mt-auto">
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/news/${item.id}`}>Read More</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}
