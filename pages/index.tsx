"use client"

import { useEffect, useState } from "react"
import Head from "next/head"
import { getClientSideClient } from "@/lib/supabase/data-fetching"
import FeaturedScholarships from "@/components/featured-scholarships-client"
import UpcomingEvents from "@/components/upcoming-events-client"
import LatestNews from "@/components/latest-news-client"
import Newsletter from "@/components/newsletter-client"
import AdBanner from "@/components/ad-banner-client"

export default function Home() {
  // Client-side data fetching
  const [scholarships, setScholarships] = useState([])
  const [events, setEvents] = useState([])
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const supabase = getClientSideClient()

      // Fetch featured scholarships
      const { data: scholarshipsData } = await supabase.from("scholarships").select().eq("featured", true).limit(3)

      // Fetch upcoming events
      const { data: eventsData } = await supabase
        .from("events")
        .select()
        .gt("event_date", new Date().toISOString())
        .order("event_date", { ascending: true })
        .limit(3)

      // Fetch latest news
      const { data: newsData } = await supabase.from("news").select().order("created_at", { ascending: false }).limit(3)

      setScholarships(scholarshipsData || [])
      setEvents(eventsData || [])
      setNews(newsData || [])
      setLoading(false)
    }

    fetchData()
  }, [])

  return (
    <>
      <Head>
        <title>Campus Guide Nigeria</title>
        <meta
          name="description"
          content="Your ultimate guide for scholarships, events, and news for Nigerian students"
        />
      </Head>

      <div className="container mx-auto px-4 py-8">
        {/* Hero section */}
        <section className="py-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to Campus Guide Nigeria</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Your ultimate guide for scholarships, events, and news for Nigerian students
          </p>
        </section>

        {/* Featured scholarships */}
        <FeaturedScholarships scholarships={scholarships} loading={loading} />

        {/* Ad banner */}
        <AdBanner position="content" className="my-12" />

        {/* Upcoming events */}
        <UpcomingEvents events={events} loading={loading} />

        {/* Latest news */}
        <LatestNews news={news} loading={loading} />

        {/* Newsletter */}
        <Newsletter />
      </div>
    </>
  )
}
