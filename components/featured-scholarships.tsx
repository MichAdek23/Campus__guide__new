import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { GraduationCap, Globe, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Scholarship {
  id: string
  title: string
  organization: string
  amount: string
  deadline: string
  location: string
  is_hot: boolean
  categories: { name: string } | null
}

interface FeaturedScholarshipsProps {
  scholarships: Scholarship[]
}

export function FeaturedScholarships({ scholarships }: FeaturedScholarshipsProps) {
  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Featured Scholarships</h2>
          <p className="text-muted-foreground mt-1">Latest scholarship opportunities for Nigerian students</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/scholarships">View All</Link>
        </Button>
      </div>

      {scholarships.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No featured scholarships available at the moment.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {scholarships.map((scholarship) => (
            <Card key={scholarship.id} className="flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-xl">{scholarship.title}</CardTitle>
                    <CardDescription>{scholarship.organization}</CardDescription>
                  </div>
                  {scholarship.is_hot && <Badge variant="destructive">Hot</Badge>}
                </div>
              </CardHeader>
              <CardContent className="pb-4 flex-grow">
                <div className="grid gap-2">
                  <div className="flex items-center gap-2 text-sm">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <span>{scholarship.categories?.name || "General"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span>{scholarship.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>
                      Deadline:{" "}
                      {new Date(scholarship.deadline) > new Date()
                        ? `${formatDistanceToNow(new Date(scholarship.deadline))} left`
                        : "Expired"}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0 mt-auto">
                <Button asChild className="w-full">
                  <Link href={`/scholarships/${scholarship.id}`}>Apply Now</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}
