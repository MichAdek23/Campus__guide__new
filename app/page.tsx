import { HeroSection } from "@/components/hero-section"
import { FeaturedScholarships } from "@/components/featured-scholarships"
import { UpcomingEvents } from "@/components/upcoming-events"
import { LatestNews } from "@/components/latest-news"
import { AdBanner } from "@/components/ad-banner"
import { Newsletter } from "@/components/newsletter"
import { getFeaturedScholarships, getUpcomingEvents, getLatestNews } from "@/lib/supabase/data-fetching"

export default async function Home() {
  // Fetch data for the homepage
  const scholarships = await getFeaturedScholarships()
  const events = await getUpcomingEvents()
  const news = await getLatestNews()

  return (
    <div className="container mx-auto px-4 py-8">
      <HeroSection />
      <AdBanner position="top" className="my-8" />
      <FeaturedScholarships scholarships={scholarships} />
      <AdBanner position="middle" className="my-8" />
      <UpcomingEvents events={events} />
      <LatestNews news={news} />
      <AdBanner position="bottom" className="my-8" />
      <Newsletter />
    </div>
  )
}
