"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { getClientSideClient } from "@/lib/supabase/data-fetching"

interface Ad {
  id: string
  title: string
  image_url: string
  link_url: string
  position: string
}

interface AdBannerProps {
  position: "sidebar" | "content" | "header"
  className?: string
}

export default function AdBanner({ position, className = "" }: AdBannerProps) {
  const [ad, setAd] = useState<Ad | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAd() {
      try {
        const supabase = getClientSideClient()

        const { data } = await supabase
          .from("ads")
          .select()
          .eq("position", position)
          .eq("is_active", true)
          .order("created_at", { ascending: false })
          .limit(1)
          .single()

        setAd(data || null)
      } catch (error) {
        console.error("Error fetching ad:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAd()
  }, [position])

  if (loading || !ad) {
    return null
  }

  return (
    <div className={`rounded-lg overflow-hidden border ${className}`}>
      <Link href={ad.link_url} target="_blank" rel="noopener noreferrer">
        <div className="relative aspect-[5/1]">
          <Image
            src={ad.image_url || "/placeholder.svg?height=200&width=1000"}
            alt={ad.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-2 text-center text-xs text-muted-foreground">Advertisement: {ad.title}</div>
      </Link>
    </div>
  )
}
