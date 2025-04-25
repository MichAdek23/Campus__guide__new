"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function subscribeToNewsletter(formData: FormData) {
  const email = formData.get("email") as string

  if (!email || !email.includes("@")) {
    return { success: false, message: "Please provide a valid email address" }
  }

  try {
    const supabase = createServerClient()

    // Check if email already exists
    const { data: existingSubscriber } = await supabase
      .from("newsletter_subscribers")
      .select()
      .eq("email", email)
      .single()

    if (existingSubscriber) {
      return { success: false, message: "You are already subscribed to our newsletter" }
    }

    // Add new subscriber
    const { error } = await supabase.from("newsletter_subscribers").insert({ email })

    if (error) throw error

    return { success: true, message: "Thank you for subscribing to our newsletter!" }
  } catch (error) {
    console.error("Error subscribing to newsletter:", error)
    return { success: false, message: "Failed to subscribe. Please try again later." }
  }
}

export async function saveItem(itemId: string, itemType: string, userId: string) {
  try {
    const supabase = createServerClient()

    const { error } = await supabase
      .from("saved_items")
      .insert({ user_id: userId, item_id: itemId, item_type: itemType })

    if (error) throw error

    revalidatePath("/profile")
    return { success: true }
  } catch (error) {
    console.error("Error saving item:", error)
    return { success: false, error }
  }
}

export async function unsaveItem(itemId: string, itemType: string, userId: string) {
  try {
    const supabase = createServerClient()

    const { error } = await supabase
      .from("saved_items")
      .delete()
      .match({ user_id: userId, item_id: itemId, item_type: itemType })

    if (error) throw error

    revalidatePath("/profile")
    return { success: true }
  } catch (error) {
    console.error("Error unsaving item:", error)
    return { success: false, error }
  }
}
