"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/lib/supabase/client"

interface Category {
  id: string
  name: string
}

interface NewsFiltersProps {
  categories?: Category[]
}

export function NewsFilters({ categories = [] }: NewsFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get("category")?.split(",").filter(Boolean) || [],
  )
  const [source, setSource] = useState(searchParams.get("source") || "all")
  const [date, setDate] = useState(searchParams.get("date") || "any")
  const [loadingCategories, setLoadingCategories] = useState(categories.length === 0)
  const [categoryList, setCategoryList] = useState<Category[]>(categories)

  useEffect(() => {
    if (categories.length === 0) {
      async function fetchCategories() {
        const { data } = await supabase
          .from("categories")
          .select("*")
          .eq("type", "news")
          .order("name", { ascending: true })

        if (data) {
          setCategoryList(data)
        }
        setLoadingCategories(false)
      }

      fetchCategories()
    }
  }, [categories])

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    setSelectedCategories((prev) => {
      if (checked) {
        return [...prev, categoryId]
      } else {
        return prev.filter((id) => id !== categoryId)
      }
    })
  }

  const applyFilters = () => {
    const params = new URLSearchParams()

    if (search) {
      params.set("search", search)
    }

    if (selectedCategories.length > 0) {
      params.set("category", selectedCategories.join(","))
    }

    if (source && source !== "all") {
      params.set("source", source)
    }

    if (date && date !== "any") {
      params.set("date", date)
    }

    params.set("page", "1")
    router.push(`/news?${params.toString()}`)
  }

  const resetFilters = () => {
    setSearch("")
    setSelectedCategories([])
    setSource("all")
    setDate("any")
    router.push("/news")
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-3">Search</h3>
        <Input placeholder="Search news..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div>
        <h3 className="font-medium mb-3">Category</h3>
        {loadingCategories ? (
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-6 bg-muted rounded animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {categoryList.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category.id}`}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={(checked) => handleCategoryChange(category.id, checked === true)}
                />
                <Label htmlFor={`category-${category.id}`}>{category.name}</Label>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="font-medium mb-3">Source</h3>
        <Select value={source} onValueChange={setSource}>
          <SelectTrigger>
            <SelectValue placeholder="Select source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            <SelectItem value="uniport">Uniport</SelectItem>
            <SelectItem value="government">Government</SelectItem>
            <SelectItem value="media">Media Outlets</SelectItem>
            <SelectItem value="other">Other Sources</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="font-medium mb-3">Date</h3>
        <Select value={date} onValueChange={setDate}>
          <SelectTrigger>
            <SelectValue placeholder="Select date range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This week</SelectItem>
            <SelectItem value="month">This month</SelectItem>
            <SelectItem value="year">This year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button className="w-full" onClick={applyFilters}>
        Apply Filters
      </Button>
      <Button variant="outline" className="w-full" onClick={resetFilters}>
        Reset Filters
      </Button>
    </div>
  )
}
