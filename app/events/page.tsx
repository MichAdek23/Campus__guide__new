import { EventFilters } from "@/components/event-filters"
import { EventList } from "@/components/event-list"
import { AdBanner } from "@/components/ad-banner"
import { Suspense } from "react"

export default function EventsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const page = typeof searchParams.page === "string" ? Number.parseInt(searchParams.page) : 1

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Campus Events</h1>
      <p className="text-muted-foreground mb-8">
        Stay updated with the latest events happening in Nigerian universities, especially at Uniport.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <EventFilters />
          <AdBanner position="sidebar" className="mt-8 hidden lg:block" />
        </div>
        <div className="lg:col-span-3">
          <Suspense fallback={<div>Loading events...</div>}>
            <EventList />
            <AdBanner position="content" className="my-8" />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
