"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { GraduationCap, Globe, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { supabase } from "@/lib/supabase/client"
import { Pagination } from "@/components/ui/pagination"

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

export function ScholarshipListClient() {
  const searchParams = useSearchParams()
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1
  const category = searchParams.get("category")
  const location = searchParams.get("location")
  const deadline = searchParams.get("deadline")
  const search = searchParams.get("search")

  const [scholarships, setScholarships] = useState<Scholarship[]>([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const limit = 6

  useEffect(() => {
    async function fetchScholarships() {
      setLoading(true)
      const startIndex = (page - 1) * limit

      let query = supabase.from("scholarships").select("*, categories(name)", { count: "exact" })

      // Apply filters
      if (category) {
        query = query.eq("categories.name", category)
      }

      if (location) {
        if (location === "nigeria") {
          query = query.ilike("location", "%nigeria%")
        } else if (location === "international") {
          query = query.not("location", "ilike", "%nigeria%")
        }
      }

      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
      }

      if (deadline) {
        const now = new Date()
        const endDate = new Date()

        if (deadline === "week") {
          endDate.setDate(now.getDate() + 7)
        } else if (deadline === "month") {
          endDate.setMonth(now.getMonth() + 1)
        } else if (deadline === "three_months") {
          endDate.setMonth(now.getMonth() + 3)
        }

        if (deadline !== "any") {
          query = query.lte("deadline", endDate.toISOString())
        }
      }

      const {
        data,
        error,
        count: totalCount,
      } = await query.order("deadline", { ascending: true }).range(startIndex, startIndex + limit - 1)

      if (error) {
        console.error("Error fetching scholarships:", error)
      } else {
        setScholarships(data || [])
        setCount(totalCount || 0)
      }

      setLoading(false)
    }

    fetchScholarships()
  }, [page, category, location, deadline, search])

  const totalPages = Math.ceil(count / limit)

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading scholarships...</p>
      </div>
    )
  }

  if (scholarships.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No scholarships found matching your criteria.</p>
      </div>
    )
  }

  return (
    <div>
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

      {totalPages > 1 && <Pagination currentPage={page} totalPages={totalPages} basePath="/scholarships" />}
    </div>
  )
}
