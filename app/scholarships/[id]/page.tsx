import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { AdBanner } from "@/components/ad-banner"
import { getScholarshipById, getFeaturedScholarships } from "@/lib/supabase/data-fetching"
import { Calendar, Globe, GraduationCap, Clock, ExternalLink, Share2 } from "lucide-react"
import { format } from "date-fns"
import { SaveItemButton } from "@/components/save-item-button"

export default async function ScholarshipDetailPage({ params }: { params: { id: string } }) {
  const scholarship = await getScholarshipById(params.id)

  if (!scholarship) {
    notFound()
  }

  // Get related scholarships (same category)
  const relatedScholarships = await getFeaturedScholarships(3)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mb-6">
            <Link href="/scholarships" className="text-primary hover:underline mb-2 inline-block">
              &larr; Back to Scholarships
            </Link>
            <h1 className="text-3xl font-bold mt-2">{scholarship.title}</h1>
            <p className="text-xl text-muted-foreground">{scholarship.organization}</p>
          </div>

          {scholarship.image_url && (
            <div className="mb-6 rounded-lg overflow-hidden">
              <img
                src={scholarship.image_url || "/placeholder.svg"}
                alt={scholarship.title}
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Deadline</p>
                  <p className="font-medium">{format(new Date(scholarship.deadline), "MMMM d, yyyy")}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <GraduationCap className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">{scholarship.categories?.name || "General"}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <Globe className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{scholarship.location}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Award</p>
                  <p className="font-medium">{scholarship.amount}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="prose max-w-none dark:prose-invert mb-8">
            <h2>Description</h2>
            <div dangerouslySetInnerHTML={{ __html: scholarship.description }} />

            <h2>Eligibility</h2>
            <div dangerouslySetInnerHTML={{ __html: scholarship.eligibility }} />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            {scholarship.application_link && (
              <Button asChild size="lg" className="flex-1">
                <a href={scholarship.application_link} target="_blank" rel="noopener noreferrer">
                  Apply Now <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            )}

            <SaveItemButton itemId={scholarship.id} itemType="scholarship" className="flex-1" />

            <Button variant="outline" size="lg" className="flex-1">
              <Share2 className="mr-2 h-4 w-4" /> Share
            </Button>
          </div>

          <AdBanner position="content" className="my-8" />
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <h2 className="text-xl font-bold mb-4">Related Scholarships</h2>
            <div className="space-y-4">
              {relatedScholarships.map((related) => (
                <Card key={related.id} className={related.id === scholarship.id ? "hidden" : ""}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">
                        <Link href={`/scholarships/${related.id}`} className="hover:text-primary">
                          {related.title}
                        </Link>
                      </h3>
                      {related.is_hot && <Badge variant="destructive">Hot</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{related.organization}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Deadline: {format(new Date(related.deadline), "MMM d, yyyy")}</span>
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
