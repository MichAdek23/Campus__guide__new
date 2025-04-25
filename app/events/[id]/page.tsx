"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { AdBanner } from "@/components/ad-banner"
import { Calendar, MapPin, Clock, ExternalLink, Share2, User } from "lucide-react"
import { format } from "date-fns"
import { SaveItemButton } from "@/components/save-item-button"
import { supabase } from "@/lib/supabase/client"

interface Event {
  id: string
  title: string
  organizer: string
  description: string
  start_date: string
  end_date: string
  location: string
  registration_link: string | null
  image_url: string | null
  categories: { name: string } | null
}

export default function EventDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [event, setEvent] = useState<Event | null>(null)
  const [relatedEvents, setRelatedEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      // Get event by ID
      const { data: eventData, error: eventError } = await supabase
        .from("events")
        .select("*, categories(name)")
        .eq("id", id)
        .single()

      if (eventError) {
        console.error("Error fetching event:", eventError)
      } else {
        setEvent(eventData)
      }

      // Get related events
      const now = new Date().toISOString()
      const { data: relatedData, error: relatedError } = await supabase
        .from("events")
        .select("*, categories(name)")
        .gte("end_date", now)
        .order("start_date", { ascending: true })
        .limit(3)

      if (relatedError) {
        console.error("Error fetching related events:", relatedError)
      } else {
        setRelatedEvents(relatedData || [])
      }

      setLoading(false)
    }

    fetchData()
  }, [id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading event details...</p>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
          <p className="text-muted-foreground mb-6">The event you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link href="/events">Back to Events</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mb-6">
            <Link href="/events" className="text-primary hover:underline mb-2 inline-block">
              &larr; Back to Events
            </Link>
            <h1 className="text-3xl font-bold mt-2">{event.title}</h1>
            <p className="text-xl text-muted-foreground">{event.organizer}</p>
          </div>

          {event.image_url && (
            <div className="mb-6 rounded-lg overflow-hidden">
              <img
                src={event.image_url || "/placeholder.svg"}
                alt={event.title}
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{format(new Date(event.start_date), "MMMM d, yyyy")}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-medium">
                    {format(new Date(event.start_date), "h:mm a")} - {format(new Date(event.end_date), "h:mm a")}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{event.location}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <User className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">{event.categories?.name || "General"}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="prose max-w-none dark:prose-invert mb-8">
            <h2>Description</h2>
            <div dangerouslySetInnerHTML={{ __html: event.description }} />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            {event.registration_link && (
              <Button asChild size="lg" className="flex-1">
                <a href={event.registration_link} target="_blank" rel="noopener noreferrer">
                  Register Now <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            )}

            <SaveItemButton itemId={event.id} itemType="event" className="flex-1" />

            <Button variant="outline" size="lg" className="flex-1">
              <Share2 className="mr-2 h-4 w-4" /> Share
            </Button>
          </div>

          <AdBanner position="content" className="my-8" />
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <h2 className="text-xl font-bold mb-4">Related Events</h2>
            <div className="space-y-4">
              {relatedEvents.map((related) => (
                <Card key={related.id} className={related.id === event.id ? "hidden" : ""}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">
                        <Link href={`/events/${related.id}`} className="hover:text-primary">
                          {related.title}
                        </Link>
                      </h3>
                      <Badge>{related.categories?.name || "General"}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{related.organizer}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{format(new Date(related.start_date), "MMM d, yyyy")}</span>
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
