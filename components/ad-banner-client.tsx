"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase/client"

interface Ad {
  id: string
  name: string
  description: string | null
  image_url: string
  link_url: string | null
  position: string
}

interface AdBannerProps {
  position: string
  className?: string
}

export function AdBannerClient({ position, className }: AdBannerProps) {
  const [ad, setAd] = useState<Ad | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchAd() {
      const now = new Date().toISOString()

      const { data, error } = await supabase
        .from("advertisements")
        .select("*")
        .eq("position", position)
        .eq("is_active", true)
        .lte("start_date", now)
        .gte("end_date", now)
        .order("created_at", { ascending: false })
        .limit(1)

      if (!error && data && data.length > 0) {
        setAd(data[0])
      }
      setIsLoading(false)
    }

    fetchAd()
  }, [position])

  if (isLoading) {
    return (
      <div
        className={cn(
          "w-full rounded-lg bg-muted/50 border border-dashed flex items-center justify-center h-24",
          className,
        )}
      >
        <p className="text-muted-foreground text-sm font-medium">Loading advertisement...</p>
      </div>
    )
  }

  if (!ad) {
    return (
      <div
        className={cn(
          "w-full rounded-lg bg-muted/50 border border-dashed flex items-center justify-center h-24",
          className,
        )}
      >
        <p className="text-muted-foreground text-sm font-medium">Advertisement</p>
      </div>
    )
  }

  return (
    <a
      href={ad.link_url || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("w-full rounded-lg overflow-hidden block relative h-24", className)}
    >
      <img src={ad.image_url || "/placeholder.svg"} alt={ad.name} className="w-full h-full object-cover" />
      <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">Ad</div>
    </a>
  )
}
