"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarDays, MapPin, Clock } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { Pagination } from "@/components/ui/pagination"

interface Event {
  id: string
  title: string
  organizer: string
  start_date: string
  end_date: string
  location: string
  category_id: string | null
  categories: { name: string } | null
  is_featured: boolean
}

export function EventListClient() {
  const searchParams = useSearchParams()
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1
  const category = searchParams.get("category")
  const location = searchParams.get("location")
  const date = searchParams.get("date")
  const search = searchParams.get("search")

  const [events, setEvents] = useState<Event[]>([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const limit = 6

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true)
      const startIndex = (page - 1) * limit
      const now = new Date().toISOString()

      let query = supabase.from("events").select("*, categories(name)", { count: "exact" }).gte("end_date", now)

      // Apply filters
      if (category) {
        query = query.eq("categories.name", category)
      }

      if (location) {
        if (location === "uniport") {
          query = query.ilike("location", "%uniport%")
        } else if (location === "port-harcourt") {
          query = query.ilike("location", "%port harcourt%")
        } else if (location === "other") {
          query = query.not("location", "ilike", "%uniport%").not("location", "ilike", "%port harcourt%")
        }
      }

      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
      }

      if (date) {
        const today = new Date()
        const endDate = new Date()

        if (date === "today") {
          endDate.setHours(23, 59, 59, 999)
          query = query.lte("start_date", endDate.toISOString()).gte("start_date", today.toISOString())
        } else if (date === "week") {
          endDate.setDate(today.getDate() + 7)
          query = query.lte("start_date", endDate.toISOString())
        } else if (date === "month") {
          endDate.setMonth(today.getMonth() + 1)
          query = query.lte("start_date", endDate.toISOString())
        }
      }

      const {
        data,
        error,
        count: totalCount,
      } = await query.order("start_date", { ascending: true }).range(startIndex, startIndex + limit - 1)

      if (error) {
        console.error("Error fetching events:", error)
      } else {
        setEvents(data || [])
        setCount(totalCount || 0)
      }

      setLoading(false)
    }

    fetchEvents()
  }, [page, category, location, date, search])

  const totalPages = Math.ceil(count / limit)

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading events...</p>
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No events found matching your criteria.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="space-y-6">
        {events.map((event) => (
          <Card key={event.id}>
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/4 h-48 md:h-auto relative">
                <img
                  src={"/placeholder.svg?height=200&width=300"}
                  alt={event.title}
                  className="object-cover w-full h-full rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
                />
                <Badge className="absolute top-2 right-2">{event.categories?.name || "General"}</Badge>
              </div>

              <div className="flex-grow p-6">
                <div className="mb-2">
                  <h3 className="text-xl font-bold">{event.title}</h3>
                  <p className="text-muted-foreground">{event.organizer}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(event.start_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {new Date(event.start_date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-4 flex md:flex-col justify-between items-center md:items-end gap-4 border-t md:border-t-0 md:border-l">
                <Button asChild>
                  <Link href={`/events/${event.id}`}>Register</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href={`/events/${event.id}`}>Details</Link>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {totalPages > 1 && <Pagination currentPage={page} totalPages={totalPages} basePath="/events" />}
    </div>
  )
}
