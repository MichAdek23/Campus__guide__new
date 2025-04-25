import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarDays, Eye } from "lucide-react"
import { format } from "date-fns"

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
  news: News[]
}

export function LatestNews({ news }: LatestNewsProps) {
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
