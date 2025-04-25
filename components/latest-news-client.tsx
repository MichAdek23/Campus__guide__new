"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface News {
  id: string
  title: string
  summary: string
  image_url: string
  created_at: string
}

interface LatestNewsProps {
  news: News[]
  loading: boolean
}

export default function LatestNews({ news, loading }: LatestNewsProps) {
  if (loading) {
    return (
      <section className="py-8">
        <h2 className="text-3xl font-bold mb-6">Latest News</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <div className="relative w-full h-48">
                <Skeleton className="absolute inset-0" />
              </div>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="py-8">
      <h2 className="text-3xl font-bold mb-6">Latest News</h2>
      {news.length === 0 ? (
        <p className="text-muted-foreground">No news available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.map((item) => (
            <Card key={item.id}>
              <div className="relative w-full h-48">
                <Image
                  src={item.image_url || "/placeholder.svg?height=200&width=400"}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-2">{item.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{new Date(item.created_at).toLocaleDateString()}</p>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-sm text-muted-foreground">{item.summary}</p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/news/${item.id}`}>Read More</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      <div className="mt-6 text-center">
        <Button asChild variant="outline">
          <Link href="/news">View All News</Link>
        </Button>
      </div>
    </section>
  )
}
