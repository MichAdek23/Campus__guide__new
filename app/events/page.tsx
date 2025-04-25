import { EventFilters } from "@/components/event-filters"
import { EventList } from "@/components/event-list"
import { AdBanner } from "@/components/ad-banner"
import { Pagination } from "@/components/ui/pagination"
import { getEvents, getCategories } from "@/lib/supabase/data-fetching"
import { Suspense } from "react"

export default async function EventsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const page = typeof searchParams.page === "string" ? Number.parseInt(searchParams.page) : 1
  const category = typeof searchParams.category === "string" ? searchParams.category : undefined
  const location = typeof searchParams.location === "string" ? searchParams.location : undefined
  const date = typeof searchParams.date === "string" ? searchParams.date : undefined
  const search = typeof searchParams.search === "string" ? searchParams.search : undefined

  const { events, count } = await getEvents(page, 6, {
    category,
    location,
    date,
    search,
  })

  const categories = await getCategories("event")

  const totalPages = Math.ceil(count / 6)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Campus Events</h1>
      <p className="text-muted-foreground mb-8">
        Stay updated with the latest events happening in Nigerian universities, especially at Uniport.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <EventFilters categories={categories} />
          <AdBanner position="sidebar" className="mt-8 hidden lg:block" />
        </div>
        <div className="lg:col-span-3">
          <Suspense fallback={<div>Loading events...</div>}>
            <EventList events={events} />
            <AdBanner position="content" className="my-8" />
            {totalPages > 1 && <Pagination currentPage={page} totalPages={totalPages} basePath="/events" />}
          </Suspense>
        </div>
      </div>
    </div>
  )
}
