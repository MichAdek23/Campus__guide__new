"use client"

import Head from "next/head"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { supabase } from "@/lib/supabase/client"
import { NewsFilters } from "@/components/news-filters"
import { NewsList } from "@/components/news-list"
import { AdBannerClient } from "@/components/ad-banner-client"
import { Pagination } from "@/components/ui/pagination"

export default function NewsPage() {
  const router = useRouter()
  const { page = "1", category, source, date, search } = router.query

  const [news, setNews] = useState([])
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
        .eq("type", "news")
        .order("name", { ascending: true })

      setCategories(data || [])
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    async function fetchNews() {
      setLoading(true)

      const startIndex = (currentPage - 1) * limit

      let query = supabase.from("news").select("*, categories(name)", { count: "exact" })

      // Apply filters
      if (category) {
        const categoryArray = Array.isArray(category) ? category : [category]
        if (categoryArray.length === 1) {
          query = query.eq("categories.name", categoryArray[0])
        } else if (categoryArray.length > 1) {
          query = query.in("categories.name", categoryArray)
        }
      }

      if (search) {
        const searchTerm = Array.isArray(search) ? search[0] : search
        query = query.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`)
      }

      if (date) {
        const now = new Date()
        const startDate = new Date()

        if (date === "today") {
          startDate.setHours(0, 0, 0, 0)
          query = query.gte("created_at", startDate.toISOString())
        } else if (date === "week") {
          startDate.setDate(now.getDate() - 7)
          query = query.gte("created_at", startDate.toISOString())
        } else if (date === "month") {
          startDate.setMonth(now.getMonth() - 1)
          query = query.gte("created_at", startDate.toISOString())
        } else if (date === "year") {
          startDate.setFullYear(now.getFullYear() - 1)
          query = query.gte("created_at", startDate.toISOString())
        }
      }

      const {
        data,
        error,
        count: totalCount,
      } = await query.order("created_at", { ascending: false }).range(startIndex, startIndex + limit - 1)

      if (error) {
        console.error("Error fetching news:", error)
      } else {
        setNews(data || [])
        setCount(totalCount || 0)
      }

      setLoading(false)
    }

    fetchNews()
  }, [currentPage, category, source, date, search])

  const totalPages = Math.ceil(count / limit)

  return (
    <>
      <Head>
        <title>News | Campus Guide Nigeria</title>
        <meta
          name="description"
          content="Get the latest news from Nigerian universities and educational institutions"
        />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Campus News</h1>
        <p className="text-muted-foreground mb-8">
          Get the latest news from Nigerian universities and educational institutions, with focus on Uniport.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <NewsFilters categories={categories} />
            <AdBannerClient position="sidebar" className="mt-8 hidden lg:block" />
          </div>
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading news...</p>
              </div>
            ) : (
              <>
                <NewsList newsItems={news} />
                <AdBannerClient position="content" className="my-8" />
                {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/news" />}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
