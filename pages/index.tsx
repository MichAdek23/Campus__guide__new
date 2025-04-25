import Head from "next/head"
import { HeroSection } from "@/components/hero-section"
import { FeaturedScholarshipsClient } from "@/components/featured-scholarships-client"
import { UpcomingEventsClient } from "@/components/upcoming-events-client"
import { LatestNewsClient } from "@/components/latest-news-client"
import { Newsletter } from "@/components/newsletter"
import { AdBannerClient } from "@/components/ad-banner-client"

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Campus Guide Nigeria</title>
        <meta
          name="description"
          content="Your ultimate guide for scholarships, events, and news for Nigerian students"
        />
      </Head>

      <div>
        <HeroSection />

        <div className="container mx-auto px-4">
          <FeaturedScholarshipsClient />

          <AdBannerClient position="middle" className="my-8" />

          <UpcomingEventsClient />

          <LatestNewsClient />

          <Newsletter />
        </div>
      </div>
    </>
  )
}
