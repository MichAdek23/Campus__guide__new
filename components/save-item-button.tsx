"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Bookmark, BookmarkCheck } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { getClientSideClient } from "@/lib/supabase/data-fetching"

interface SaveItemButtonProps {
  itemId: string
  itemType: "scholarship" | "event" | "news"
  initialSaved?: boolean
}

export function SaveItemButton({ itemId, itemType, initialSaved = false }: SaveItemButtonProps) {
  const [isSaved, setIsSaved] = useState(initialSaved)
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()

  const handleSave = async () => {
    if (!user) {
      // Redirect to login or show login modal
      return
    }

    setIsLoading(true)

    try {
      const supabase = getClientSideClient()

      if (isSaved) {
        // Remove from saved items
        await supabase.from("saved_items").delete().match({ user_id: user.id, item_id: itemId, item_type: itemType })

        setIsSaved(false)
      } else {
        // Add to saved items
        await supabase.from("saved_items").insert({ user_id: user.id, item_id: itemId, item_type: itemType })

        setIsSaved(true)
      }
    } catch (error) {
      console.error("Error saving item:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleSave}
      disabled={isLoading || !user}
      className="flex items-center gap-1"
    >
      {isSaved ? (
        <>
          <BookmarkCheck className="h-4 w-4" />
          <span>Saved</span>
        </>
      ) : (
        <>
          <Bookmark className="h-4 w-4" />
          <span>Save</span>
        </>
      )}
    </Button>
  )
}
