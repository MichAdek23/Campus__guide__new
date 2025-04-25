"use client"

import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface Scholarship {
  id: string
  title: string
  organization: string
  deadline: string
  amount: string
  description: string
}

interface FeaturedScholarshipsProps {
  scholarships: Scholarship[]
  loading: boolean
}

export default function FeaturedScholarships({ scholarships, loading }: FeaturedScholarshipsProps) {
  if (loading) {
    return (
      <section className="py-8">
        <h2 className="text-3xl font-bold mb-6">Featured Scholarships</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
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
      <h2 className="text-3xl font-bold mb-6">Featured Scholarships</h2>
      {scholarships.length === 0 ? (
        <p className="text-muted-foreground">No featured scholarships available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {scholarships.map((scholarship) => (
            <Card key={scholarship.id}>
              <CardHeader>
                <CardTitle>{scholarship.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{scholarship.organization}</p>
              </CardHeader>
              <CardContent>
                <p className="mb-2">
                  <span className="font-medium">Amount:</span> {scholarship.amount}
                </p>
                <p className="mb-4">
                  <span className="font-medium">Deadline:</span> {new Date(scholarship.deadline).toLocaleDateString()}
                </p>
                <p className="line-clamp-3 text-sm text-muted-foreground">{scholarship.description}</p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/scholarships/${scholarship.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      <div className="mt-6 text-center">
        <Button asChild variant="outline">
          <Link href="/scholarships">View All Scholarships</Link>
        </Button>
      </div>
    </section>
  )
}
