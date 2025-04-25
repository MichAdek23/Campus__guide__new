import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarDays, MapPin, Clock } from "lucide-react"

export function EventList() {
  // Mock data - in a real app, this would come from an API or database
  const events = [
    {
      id: 1,
      title: "Uniport Career Fair 2024",
      organizer: "University of Port Harcourt",
      date: "May 20, 2024",
      time: "9:00 AM - 4:00 PM",
      location: "Uniport Convocation Arena",
      category: "Career",
      isFeatured: true,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 2,
      title: "Tech Meetup: AI in Education",
      organizer: "TechEd Nigeria",
      date: "June 5, 2024",
      time: "2:00 PM - 5:00 PM",
      location: "Uniport ICT Center",
      category: "Technology",
      isFeatured: false,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 3,
      title: "National Engineering Competition",
      organizer: "Nigerian Society of Engineers",
      date: "July 15-17, 2024",
      time: "All Day",
      location: "Multiple Venues",
      category: "Competition",
      isFeatured: true,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 4,
      title: "Cultural Day Celebration",
      organizer: "Student Union Government",
      date: "June 12, 2024",
      time: "10:00 AM - 6:00 PM",
      location: "Uniport Freedom Square",
      category: "Cultural",
      isFeatured: false,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 5,
      title: "Academic Writing Workshop",
      organizer: "Faculty of Humanities",
      date: "May 25, 2024",
      time: "12:00 PM - 3:00 PM",
      location: "Faculty of Humanities Building",
      category: "Academic",
      isFeatured: false,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 6,
      title: "Inter-University Sports Competition",
      organizer: "Nigerian Universities Games Association",
      date: "July 5-10, 2024",
      time: "Various Times",
      location: "University of Port Harcourt Sports Complex",
      category: "Sports",
      isFeatured: true,
      image: "/placeholder.svg?height=200&width=300",
    },
  ]

  return (
    <div className="space-y-6">
      {events.map((event) => (
        <Card key={event.id}>
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/4 h-48 md:h-auto relative">
              <img
                src={event.image || "/placeholder.svg"}
                alt={event.title}
                className="object-cover w-full h-full rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
              />
              <Badge className="absolute top-2 right-2">{event.category}</Badge>
            </div>

            <div className="flex-grow p-6">
              <div className="mb-2">
                <h3 className="text-xl font-bold">{event.title}</h3>
                <p className="text-muted-foreground">{event.organizer}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                <div className="flex items-center gap-2 text-sm">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{event.time}</span>
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
  )
}
