"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { AdBanner } from "@/components/ad-banner"
import { CalendarDays, Eye, Share2 } from "lucide-react"
import { format } from "date-fns"
import { SaveItemButton } from "@/components/save-item-button"
import { supabase } from "@/lib/supabase/client"

interface News {
  id: string
  title: string
  content: string
  created_at: string
  views: number
  image_url: string | null
  categories: { name: string } | null
}

export default function NewsDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [news, setNews] = useState<News | null>(null)
  const [relatedNews, setRelatedNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      // Get news by ID
      const { data: newsData, error: newsError } = await supabase
        .from("news")
        .select("*, categories(name)")
        .eq("id", id)
        .single()

      if (newsError) {
        console.error("Error fetching news:", newsError)
      } else {
        setNews(newsData)

        // Increment view count
        await supabase
          .from("news")
          .update({ views: (newsData.views || 0) + 1 })
          .eq("id", id)
      }

      // Get related news
      const { data: relatedData, error: relatedError } = await supabase
        .from("news")
        .select("*, categories(name)")
        .order("created_at", { ascending: false })
        .limit(3)

      if (relatedError) {
        console.error("Error fetching related news:", relatedError)
      } else {
        setRelatedNews(relatedData || [])
      }

      setLoading(false)
    }

    fetchData()
  }, [id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading news article...</p>
        </div>
      </div>
    )
  }

  if (!news) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">News Article Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The news article you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link href="/news">Back to News</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mb-6">
            <Link href="/news" className="text-primary hover:underline mb-2 inline-block">
              &larr; Back to News
            </Link>
            <h1 className="text-3xl font-bold mt-2">{news.title}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <Badge>{news.categories?.name || "General"}</Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <CalendarDays className="h-4 w-4" />
                <span>{format(new Date(news.created_at), "MMMM d, yyyy")}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Eye className="h-4 w-4" />
                <span>{news.views} views</span>
              </div>
            </div>
          </div>

          {news.image_url && (
            <div className="mb-6 rounded-lg overflow-hidden">
              <img src={news.image_url || "/placeholder.svg"} alt={news.title} className="w-full h-auto object-cover" />
            </div>
          )}

          <div className="prose max-w-none dark:prose-invert mb-8">
            <div dangerouslySetInnerHTML={{ __html: news.content }} />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <SaveItemButton itemId={news.id} itemType="news" className="flex-1" />

            <Button variant="outline" size="lg" className="flex-1">
              <Share2 className="mr-2 h-4 w-4" /> Share
            </Button>
          </div>

          <AdBanner position="content" className="my-8" />
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <h2 className="text-xl font-bold mb-4">Related News</h2>
            <div className="space-y-4">
              {relatedNews.map((related) => (
                <Card key={related.id} className={related.id === news.id ? "hidden" : ""}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">
                        <Link href={`/news/${related.id}`} className="hover:text-primary">
                          {related.title}
                        </Link>
                      </h3>
                      <Badge>{related.categories?.name || "General"}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarDays className="h-4 w-4" />
                      <span>{format(new Date(related.created_at), "MMM d, yyyy")}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <AdBanner position="sidebar" className="mt-8" />
          </div>
        </div>
      </div>
    </div>
  )
}
