import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="py-12 md:py-24 lg:py-32 bg-muted rounded-xl overflow-hidden relative">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-4">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
              Your Campus Guide in Nigeria
            </div>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Discover Opportunities for Nigerian Students
            </h1>
            <p className="text-muted-foreground md:text-xl">
              Stay updated with the latest scholarships, events, and news tailored for Nigerian students, with special
              focus on Uniport.
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg">
                <Link href="/scholarships">Explore Scholarships</Link>
              </Button>
              <Button variant="outline" size="lg">
                <Link href="/events">View Events</Link>
              </Button>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-green-500/10 z-10"></div>
              <img
                src="/placeholder.svg?height=500&width=800"
                alt="Nigerian students on campus"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
