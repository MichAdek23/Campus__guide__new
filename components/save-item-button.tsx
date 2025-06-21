"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useSupabase } from "@/hooks/use-supabase"
import { toast } from "@/hooks/use-toast"

interface SaveItemButtonProps {
  itemId: string
  itemType: "scholarship" | "event" | "news"
  className?: string
}

export function SaveItemButton({ itemId, itemType, className }: SaveItemButtonProps) {
  const [isSaved, setIsSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  // Use the singleton client through the hook
  const supabase = useSupabase()

  useEffect(() => {
    if (user) {
      checkIfSaved()
    }
  }, [user, itemId])

  const checkIfSaved = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from("saved_items")
        .select("id")
        .eq("user_id", user.id)
        .eq("item_id", itemId)
        .eq("item_type", itemType)
        .single()

      if (error && error.code !== "PGRST116") {
        console.error("Error checking saved status:", error)
        return
      }

      setIsSaved(!!data)
    } catch (error) {
      console.error("Error checking saved status:", error)
    }
  }

  const toggleSave = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save items",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      if (isSaved) {
        const { error } = await supabase
          .from("saved_items")
          .delete()
          .eq("user_id", user.id)
          .eq("item_id", itemId)
          .eq("item_type", itemType)

        if (error) throw error

        setIsSaved(false)
        toast({
          title: "Item removed",
          description: "Item removed from your saved list",
        })
      } else {
        const { error } = await supabase.from("saved_items").insert({
          user_id: user.id,
          item_id: itemId,
          item_type: itemType,
        })

        if (error) throw error

        setIsSaved(true)
        toast({
          title: "Item saved",
          description: "Item added to your saved list",
        })
      }
    } catch (error) {
      console.error("Error toggling save status:", error)
      toast({
        title: "Error",
        description: "Failed to update saved status",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant={isSaved ? "default" : "outline"}
      size="sm"
      onClick={toggleSave}
      disabled={loading}
      className={className}
    >
      <Heart className={`h-4 w-4 mr-2 ${isSaved ? "fill-current" : ""}`} />
      {isSaved ? "Saved" : "Save"}
    </Button>
  )
}
