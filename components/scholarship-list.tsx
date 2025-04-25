import Link from "next/link"
import { Card } from "@/components/ui/card"
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

interface ScholarshipListProps {
  scholarships: Scholarship[]
}

export function ScholarshipList({ scholarships }: ScholarshipListProps) {
  if (scholarships.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No scholarships found matching your criteria.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {scholarships.map((scholarship) => (
        <Card key={scholarship.id}>
          <div className="flex flex-col md:flex-row">
            <div className="flex-grow p-6">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-xl font-bold">{scholarship.title}</h3>
                  <p className="text-muted-foreground">{scholarship.organization}</p>
                </div>
                {scholarship.is_hot && <Badge variant="destructive">Hot</Badge>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
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
                <div className="flex items-center gap-2 text-sm font-medium">
                  <span>Amount: {scholarship.amount}</span>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-4 flex md:flex-col justify-between items-center md:items-end gap-4 border-t md:border-t-0 md:border-l">
              <Button asChild>
                <Link href={`/scholarships/${scholarship.id}`}>Apply Now</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/scholarships/${scholarship.id}`}>Details</Link>
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
