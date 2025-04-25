"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarDays, MapPin, Clock } from "lucide-react"
import { format } from "date-fns"
import { supabase } from "@/lib/supabase/client"

interface Event {
  id: string
  title: string
  organizer: string
  start_date: string
  end_date: string
  location: string
  categories: { name: string } | null
  is_featured: boolean
}

interface UpcomingEventsProps {
  limit?: number
}

export function UpcomingEventsClient({ limit = 3 }: UpcomingEventsProps) {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchEvents() {
      const now = new Date().toISOString()

      const { data, error } = await supabase
        .from("events")
        .select("*, categories(name)")
        .gte("end_date", now)
        .order("start_date", { ascending: true })
        .limit(limit)

      if (!error && data) {
        setEvents(data)
      }
      setIsLoading(false)
    }

    fetchEvents()
  }, [limit])

  if (isLoading) {
    return (
      <section className="py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Upcoming Events</h2>
            <p className="text-muted-foreground mt-1">Loading events...</p>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array(limit)
            .fill(0)
            .map((_, i) => (
              <Card key={i} className="flex flex-col">
                <CardHeader className="pb-3">
                  <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent className="pb-4 flex-grow">
                  <div className="grid gap-2">
                    <div className="h-4 bg-muted rounded w-full"></div>
                    <div className="h-4 bg-muted rounded w-full"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0 mt-auto">
                  <div className="h-10 bg-muted rounded w-full"></div>
                </CardFooter>
              </Card>
            ))}
        </div>
      </section>
    )
  }

  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Upcoming Events</h2>
          <p className="text-muted-foreground mt-1">Don't miss these exciting campus events</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/events">View All</Link>
        </Button>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No upcoming events available at the moment.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card key={event.id} className="flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-xl">{event.title}</CardTitle>
                    <CardDescription>{event.organizer}</CardDescription>
                  </div>
                  <Badge variant={event.is_featured ? "default" : "secondary"}>
                    {event.categories?.name || "General"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-4 flex-grow">
                <div className="grid gap-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    <span>{format(new Date(event.start_date), "MMM d, yyyy")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{format(new Date(event.start_date), "h:mm a")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0 mt-auto">
                <Button asChild className="w-full">
                  <Link href={`/events/${event.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}
