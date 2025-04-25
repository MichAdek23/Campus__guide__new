import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarDays, Eye } from "lucide-react"

export function NewsList() {
  // Mock data - in a real app, this would come from an API or database
  const newsItems = [
    {
      id: 1,
      title: "Uniport Announces New Academic Calendar for 2024/2025",
      excerpt:
        "The University of Port Harcourt has released the academic calendar for the upcoming session with significant changes to accommodate for the recent nationwide adjustments in the academic system.",
      date: "April 28, 2024",
      category: "Academic",
      views: 1245,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 2,
      title: "Federal Government Increases Education Budget by 15%",
      excerpt:
        "In a move to improve the quality of education in Nigeria, the Federal Government has announced a 15% increase in the education budget for the 2024 fiscal year, with special focus on infrastructure development.",
      date: "April 25, 2024",
      category: "Policy",
      views: 982,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 3,
      title: "Nigerian Students Win International Science Competition",
      excerpt:
        "A team of Nigerian students from various universities has won the prestigious International Science and Innovation Competition held in London last week, bringing home the gold medal and a $50,000 prize.",
      date: "April 22, 2024",
      category: "Achievement",
      views: 756,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 4,
      title: "Uniport Faculty of Engineering Receives Major Equipment Donation",
      excerpt:
        "The Faculty of Engineering at the University of Port Harcourt has received a major donation of state-of-the-art laboratory equipment from Shell Petroleum Development Company valued at over ₦100 million.",
      date: "April 20, 2024",
      category: "Campus Life",
      views: 634,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 5,
      title: "New Scholarship Program Launched for STEM Students",
      excerpt:
        "The Ministry of Education in collaboration with tech giants has launched a new scholarship program targeting students in Science, Technology, Engineering, and Mathematics (STEM) fields across Nigerian universities.",
      date: "April 18, 2024",
      category: "Academic",
      views: 892,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 6,
      title: "Uniport Researchers Develop New Malaria Treatment Method",
      excerpt:
        "A team of researchers from the University of Port Harcourt's Faculty of Pharmaceutical Sciences has developed a new method for treating malaria that shows promising results in initial clinical trials.",
      date: "April 15, 2024",
      category: "Research",
      views: 721,
      image: "/placeholder.svg?height=200&width=300",
    },
  ]

  return (
    <div className="space-y-6">
      {newsItems.map((news) => (
        <Card key={news.id}>
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/4 h-48 md:h-auto">
              <img
                src={news.image || "/placeholder.svg"}
                alt={news.title}
                className="object-cover w-full h-full rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
              />
            </div>

            <div className="flex-grow p-6">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-xl font-bold">{news.title}</h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <CalendarDays className="h-4 w-4" />
                      <span>{news.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{news.views} views</span>
                    </div>
                  </div>
                </div>
                <Badge>{news.category}</Badge>
              </div>

              <p className="text-muted-foreground mt-4 line-clamp-3">{news.excerpt}</p>
            </div>

            <div className="p-6 md:p-4 flex md:flex-col justify-between items-center md:items-end gap-4 border-t md:border-t-0 md:border-l">
              <Button asChild>
                <Link href={`/news/${news.id}`}>Read More</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/news/${news.id}`}>Share</Link>
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
