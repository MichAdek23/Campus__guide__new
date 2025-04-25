"use client"

import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, MapPin } from "lucide-react"

interface Event {
  id: string
  title: string
  event_date: string
  location: string
  description: string
}

interface UpcomingEventsProps {
  events: Event[]
  loading: boolean
}

export default function UpcomingEvents({ events, loading }: UpcomingEventsProps) {
  if (loading) {
    return (
      <section className="py-8">
        <h2 className="text-3xl font-bold mb-6">Upcoming Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-2">
                  <Skeleton className="h-4 w-4 mr-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="flex items-center mb-4">
                  <Skeleton className="h-4 w-4 mr-2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
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
      <h2 className="text-3xl font-bold mb-6">Upcoming Events</h2>
      {events.length === 0 ? (
        <p className="text-muted-foreground">No upcoming events at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id}>
              <CardHeader>
                <CardTitle>{event.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-2">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{new Date(event.event_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center mb-4">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{event.location}</span>
                </div>
                <p className="line-clamp-3 text-sm text-muted-foreground">{event.description}</p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/events/${event.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      <div className="mt-6 text-center">
        <Button asChild variant="outline">
          <Link href="/events">View All Events</Link>
        </Button>
      </div>
    </section>
  )
}
