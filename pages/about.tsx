import Head from "next/head"
import { AdBannerClient } from "@/components/ad-banner-client"

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About | Campus Guide Nigeria</title>
        <meta name="description" content="Learn about Campus Guide Nigeria and our mission" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">About Campus Guide Nigeria</h1>

        <div className="prose max-w-none dark:prose-invert">
          <p>
            Campus Guide Nigeria is your ultimate resource for scholarships, events, and news tailored for Nigerian
            students, with a special focus on the University of Port Harcourt (Uniport) community.
          </p>

          <p>
            <strong>Our Mission:</strong> To provide Nigerian students with timely, accurate, and relevant information
            about educational opportunities, campus events, and news that impact their academic journey.
          </p>

          <h2>What We Offer</h2>

          <ul>
            <li>
              <strong>Scholarships:</strong> Comprehensive database of local and international scholarship opportunities
              available to Nigerian students.
            </li>
            <li>
              <strong>Events:</strong> Up-to-date information about academic, cultural, and social events happening on
              campuses across Nigeria, with special focus on Uniport.
            </li>
            <li>
              <strong>News:</strong> The latest educational news, policy updates, and campus happenings that matter to
              Nigerian students.
            </li>
          </ul>

          <h2>Our Values</h2>

          <ul>
            <li>
              <strong>Accuracy:</strong> We verify all information before publication.
            </li>
            <li>
              <strong>Timeliness:</strong> We provide information when you need it most.
            </li>
            <li>
              <strong>Relevance:</strong> We focus on what matters to Nigerian students.
            </li>
            <li>
              <strong>Inclusivity:</strong> While we have a special focus on Uniport, we serve students from all
              Nigerian institutions.
            </li>
          </ul>

          <p>
            <em>
              Note: Campus Guide Nigeria is not affiliated with the University of Port Harcourt or any other educational
              institution.
            </em>
          </p>
        </div>

        <AdBannerClient position="about" className="my-8" />

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
          <p className="mb-4">Have questions, suggestions, or want to advertise with us? Reach out!</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-2">Email</h3>
              <p>info@campusguide.ng</p>

              <h3 className="text-xl font-semibold mb-2 mt-4">Phone</h3>
              <p>+234 800 123 4567</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-primary hover:text-primary/80">
                  Twitter
                </a>
                <a href="#" className="text-primary hover:text-primary/80">
                  Facebook
                </a>
                <a href="#" className="text-primary hover:text-primary/80">
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
