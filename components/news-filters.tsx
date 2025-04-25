"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function NewsFilters() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-3">Search</h3>
        <Input placeholder="Search news..." />
      </div>

      <div>
        <h3 className="font-medium mb-3">Category</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="academic-news" />
            <Label htmlFor="academic-news">Academic</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="policy-news" />
            <Label htmlFor="policy-news">Policy</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="achievement-news" />
            <Label htmlFor="achievement-news">Achievement</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="campus-news" />
            <Label htmlFor="campus-news">Campus Life</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="research-news" />
            <Label htmlFor="research-news">Research</Label>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Source</h3>
        <Select>
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
        <Select>
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

      <Button className="w-full">Apply Filters</Button>
    </div>
  )
}
