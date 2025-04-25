"use client"

import Head from "next/head"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { supabase } from "@/lib/supabase/client"
import { ScholarshipFilters } from "@/components/scholarship-filters"
import { ScholarshipList } from "@/components/scholarship-list"
import { AdBannerClient } from "@/components/ad-banner-client"
import { Pagination } from "@/components/ui/pagination"

export default function ScholarshipsPage() {
  const router = useRouter()
  const { page = "1", category, location, deadline, search } = router.query

  const [scholarships, setScholarships] = useState([])
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
        .eq("type", "scholarship")
        .order("name", { ascending: true })

      setCategories(data || [])
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    async function fetchScholarships() {
      setLoading(true)

      const startIndex = (currentPage - 1) * limit

      let query = supabase.from("scholarships").select("*, categories(name)", { count: "exact" })

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
        if (location === "nigeria") {
          query = query.ilike("location", "%nigeria%")
        } else if (location === "international") {
          query = query.not("location", "ilike", "%nigeria%")
        }
      }

      if (search) {
        const searchTerm = Array.isArray(search) ? search[0] : search
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      }

      if (deadline) {
        const now = new Date()
        const endDate = new Date()

        if (deadline === "week") {
          endDate.setDate(now.getDate() + 7)
        } else if (deadline === "month") {
          endDate.setMonth(now.getMonth() + 1)
        } else if (deadline === "three_months") {
          endDate.setMonth(now.getMonth() + 3)
        }

        if (deadline !== "any") {
          query = query.lte("deadline", endDate.toISOString())
        }
      }

      const {
        data,
        error,
        count: totalCount,
      } = await query.order("deadline", { ascending: true }).range(startIndex, startIndex + limit - 1)

      if (error) {
        console.error("Error fetching scholarships:", error)
      } else {
        setScholarships(data || [])
        setCount(totalCount || 0)
      }

      setLoading(false)
    }

    fetchScholarships()
  }, [currentPage, category, location, deadline, search])

  const totalPages = Math.ceil(count / limit)

  return (
    <>
      <Head>
        <title>Scholarships | Campus Guide Nigeria</title>
        <meta name="description" content="Find the latest scholarships available for Nigerian students" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Scholarships</h1>
        <p className="text-muted-foreground mb-8">
          Find the latest scholarships available for Nigerian students, with special focus on opportunities for Uniport
          students.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <ScholarshipFilters categories={categories} />
            <AdBannerClient position="sidebar" className="mt-8 hidden lg:block" />
          </div>
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading scholarships...</p>
              </div>
            ) : (
              <>
                <ScholarshipList scholarships={scholarships} />
                <AdBannerClient position="content" className="my-8" />
                {totalPages > 1 && (
                  <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/scholarships" />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
