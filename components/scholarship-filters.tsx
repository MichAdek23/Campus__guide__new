"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { supabase } from "@/lib/supabase/client"

interface Category {
  id: string
  name: string
}

interface ScholarshipFiltersProps {
  categories?: Category[]
}

export function ScholarshipFilters({ categories = [] }: ScholarshipFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [selectedCategories, setSelectedCategories] = useState<string[]>(searchParams.get("category")?.split(",") || [])
  const [location, setLocation] = useState(searchParams.get("location") || "all")
  const [amount, setAmount] = useState([0, 1000000])
  const [deadline, setDeadline] = useState(searchParams.get("deadline") || "any")
  const [loadingCategories, setLoadingCategories] = useState(categories.length === 0)
  const [categoryList, setCategoryList] = useState<Category[]>(categories)

  useEffect(() => {
    if (categories.length === 0) {
      async function fetchCategories() {
        const { data } = await supabase
          .from("categories")
          .select("*")
          .eq("type", "scholarship")
          .order("name", { ascending: true })

        if (data) {
          setCategoryList(data)
        }
        setLoadingCategories(false)
      }

      fetchCategories()
    }
  }, [categories])

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category])
    } else {
      setSelectedCategories(selectedCategories.filter((c) => c !== category))
    }
  }

  const applyFilters = () => {
    const params = new URLSearchParams()

    if (search) params.set("search", search)
    if (selectedCategories.length > 0) params.set("category", selectedCategories.join(","))
    if (location !== "all") params.set("location", location)
    if (deadline !== "any") params.set("deadline", deadline)

    router.push(`/scholarships?${params.toString()}`)
  }

  const resetFilters = () => {
    setSearch("")
    setSelectedCategories([])
    setLocation("all")
    setAmount([0, 1000000])
    setDeadline("any")
    router.push("/scholarships")
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-3">Search</h3>
        <Input placeholder="Search scholarships..." value={search} onChange={(e) => setSearch(e.target.value)} />
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
                  id={category.id}
                  checked={selectedCategories.includes(category.name)}
                  onCheckedChange={(checked) => handleCategoryChange(category.name, checked as boolean)}
                />
                <Label htmlFor={category.id}>{category.name}</Label>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="font-medium mb-3">Location</h3>
        <RadioGroup value={location} onValueChange={setLocation}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="all" />
            <Label htmlFor="all">All Locations</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="nigeria" id="nigeria" />
            <Label htmlFor="nigeria">Nigeria Only</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="international" id="international" />
            <Label htmlFor="international">International</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <h3 className="font-medium mb-3">Amount Range</h3>
        <div className="space-y-4">
          <Slider defaultValue={[0, 1000000]} max={1000000} step={50000} onValueChange={setAmount} />
          <div className="flex items-center justify-between">
            <span>₦{amount[0].toLocaleString()}</span>
            <span>₦{amount[1].toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Deadline</h3>
        <Select value={deadline} onValueChange={setDeadline}>
          <SelectTrigger>
            <SelectValue placeholder="Select deadline" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any time</SelectItem>
            <SelectItem value="week">Within a week</SelectItem>
            <SelectItem value="month">Within a month</SelectItem>
            <SelectItem value="three_months">Within 3 months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Button className="w-full" onClick={applyFilters}>
          Apply Filters
        </Button>
        <Button variant="outline" className="w-full" onClick={resetFilters}>
          Reset Filters
        </Button>
      </div>
    </div>
  )
}
