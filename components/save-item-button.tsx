"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Bookmark } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { saveItem, unsaveItem, isItemSaved } from "@/lib/supabase/data-fetching"

interface SaveItemButtonProps {
  itemId: string
  itemType: "scholarship" | "event" | "news"
  className?: string
}

export function SaveItemButton({ itemId, itemType, className }: SaveItemButtonProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [saved, setSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const checkIfSaved = async () => {
      if (user) {
        const result = await isItemSaved(user.id, itemId, itemType)
        setSaved(result)
      }
    }

    checkIfSaved()
  }, [user, itemId, itemType])

  const handleSaveToggle = async () => {
    if (!user) {
      router.push(`/auth/sign-in?redirect=${encodeURIComponent(window.location.pathname)}`)
      return
    }

    setIsLoading(true)

    try {
      if (saved) {
        await unsaveItem(user.id, itemId, itemType)
        setSaved(false)
      } else {
        await saveItem(user.id, itemId, itemType)
        setSaved(true)
      }
    } catch (error) {
      console.error("Error toggling save status:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant={saved ? "default" : "outline"}
      size="lg"
      onClick={handleSaveToggle}
      disabled={isLoading}
      className={className}
    >
      <Bookmark className="mr-2 h-4 w-4" fill={saved ? "currentColor" : "none"} />
      {saved ? "Saved" : "Save"}
    </Button>
  )
}
