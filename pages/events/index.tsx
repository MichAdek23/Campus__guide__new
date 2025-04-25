"use client"

import Head from "next/head"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { supabase } from "@/lib/supabase/client"
import { EventFilters } from "@/components/event-filters"
import { EventList } from "@/components/event-list"
import { AdBannerClient } from "@/components/ad-banner-client"
import { Pagination } from "@/components/ui/pagination"

export default function EventsPage() {
  const router = useRouter()
  const { page = "1", category, location, date, search } = router.query

  const [events, setEvents] = useState([])
  const [categories, setCategories] = useState([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const currentPage = Number.parseInt(Array.isArray(page) ? page[0] : page, 10)
  const limit = 6

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase
        .from("categories")
        .select("*")
        .eq("type", "event")
        .order("name", { ascending: true })

      setCategories(data || [])
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true)

      const startIndex = (currentPage - 1) * limit
      const now = new Date().toISOString()

      let query = supabase.from("events").select("*, categories(name)", { count: "exact" }).gte("end_date", now)

      // Apply filters
      if (category) {
        const categoryArray = Array.isArray(category) ? category : [category]
        if (categoryArray.length === 1) {
          query = query.eq("categories.name", categoryArray[0])
        } else if (categoryArray.length > 1) {
          query = query.in("categories.name", categoryArray)
        }
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
        const searchTerm = Array.isArray(search) ? search[0] : search
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
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
  }, [currentPage, category, location, date, search])

  const totalPages = Math.ceil(count / limit)

  return (
    <>
      <Head>
        <title>Events | Campus Guide Nigeria</title>
        <meta name="description" content="Stay updated with the latest events happening in Nigerian universities" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Campus Events</h1>
        <p className="text-muted-foreground mb-8">
          Stay updated with the latest events happening in Nigerian universities, especially at Uniport.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <EventFilters categories={categories} />
            <AdBannerClient position="sidebar" className="mt-8 hidden lg:block" />
          </div>
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading events...</p>
              </div>
            ) : (
              <>
                <EventList events={events} />
                <AdBannerClient position="content" className="my-8" />
                {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/events" />}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
