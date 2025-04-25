"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/lib/supabase/client"

interface Category {
  id: string
  name: string
}

interface EventFiltersProps {
  categories?: Category[]
}

export function EventFilters({ categories = [] }: EventFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get("category")?.split(",").filter(Boolean) || [],
  )
  const [location, setLocation] = useState(searchParams.get("location") || "all")
  const [date, setDate] = useState(searchParams.get("date") || "any")
  const [loadingCategories, setLoadingCategories] = useState(categories.length === 0)
  const [categoryList, setCategoryList] = useState<Category[]>(categories)

  useEffect(() => {
    if (categories.length === 0) {
      async function fetchCategories() {
        const { data } = await supabase
          .from("categories")
          .select("*")
          .eq("type", "event")
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    applyFilters()
  }

  const handleLocationChange = (value: string) => {
    setLocation(value)
  }

  const handleDateChange = (value: string) => {
    setDate(value)
  }

  const applyFilters = () => {
    const params = new URLSearchParams()

    if (search) {
      params.set("search", search)
    }

    if (selectedCategories.length > 0) {
      params.set("category", selectedCategories.join(","))
    }

    if (location && location !== "all") {
      params.set("location", location)
    }

    if (date && date !== "any") {
      params.set("date", date)
    }

    params.set("page", "1")
    router.push(`/events?${params.toString()}`)
  }

  const resetFilters = () => {
    setSearch("")
    setSelectedCategories([])
    setLocation("all")
    setDate("any")
    router.push("/events")
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-3">Search</h3>
        <form onSubmit={handleSearch} className="space-y-2">
          <Input placeholder="Search events..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <Button type="submit" size="sm">
            Search
          </Button>
        </form>
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
        <h3 className="font-medium mb-3">Location</h3>
        <RadioGroup value={location} onValueChange={handleLocationChange}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="all-locations" />
            <Label htmlFor="all-locations">All Locations</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="uniport" id="uniport" />
            <Label htmlFor="uniport">Uniport Only</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="port-harcourt" id="port-harcourt" />
            <Label htmlFor="port-harcourt">Port Harcourt</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="other" id="other-locations" />
            <Label htmlFor="other-locations">Other Locations</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <h3 className="font-medium mb-3">Date</h3>
        <Select value={date} onValueChange={handleDateChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select date range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This week</SelectItem>
            <SelectItem value="month">This month</SelectItem>
            <SelectItem value="custom">Custom range</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col space-y-2">
        <Button onClick={applyFilters}>Apply Filters</Button>
        <Button variant="outline" onClick={resetFilters}>
          Reset Filters
        </Button>
      </div>
    </div>
  )
}
