import { HeroSection } from "@/components/hero-section"
import { FeaturedScholarshipsClient } from "@/components/featured-scholarships-client"
import { UpcomingEventsClient } from "@/components/upcoming-events-client"
import { LatestNewsClient } from "@/components/latest-news-client"
import { Newsletter } from "@/components/newsletter"
import { AdBanner } from "@/components/ad-banner"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <HeroSection />
      <AdBanner position="top" className="my-8" />
      <FeaturedScholarshipsClient />
      <AdBanner position="middle" className="my-8" />
      <UpcomingEventsClient />
      <LatestNewsClient />
      <AdBanner position="bottom" className="my-8" />
      <Newsletter />
    </div>
  )
}
