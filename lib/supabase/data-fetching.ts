import { createServerClient } from "./server"
import { createApiClient } from "./api-client"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"
import { supabase as supabaseClient } from "./client"

// Create a singleton client for client-side usage
let clientSideClient: ReturnType<typeof createClient<Database>> | null = null

export function getClientSideClient() {
  if (!clientSideClient && typeof window !== "undefined") {
    clientSideClient = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
  }
  return clientSideClient || supabaseClient
}

// API route data fetching functions for pages directory
export async function getScholarshipsApi(
  page = 1,
  limit = 10,
  filters: {
    category?: string
    location?: string
    deadline?: string
    search?: string
    minAmount?: number
    maxAmount?: number
  } = {},
) {
  const supabase = createApiClient()
  const startIndex = (page - 1) * limit

  let query = supabase.from("scholarships").select("*, categories(name)", { count: "exact" })

  // Apply filters
  if (filters.category) {
    query = query.eq("categories.name", filters.category)
  }

  if (filters.location) {
    if (filters.location === "nigeria") {
      query = query.ilike("location", "%nigeria%")
    } else if (filters.location === "international") {
      query = query.not("location", "ilike", "%nigeria%")
    }
  }

  if (filters.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }

  if (filters.deadline) {
    const now = new Date()
    const endDate = new Date()

    if (filters.deadline === "week") {
      endDate.setDate(now.getDate() + 7)
    } else if (filters.deadline === "month") {
      endDate.setMonth(now.getMonth() + 1)
    } else if (filters.deadline === "three_months") {
      endDate.setMonth(now.getMonth() + 3)
    }

    if (filters.deadline !== "any") {
      query = query.lte("deadline", endDate.toISOString())
    }
  }

  const { data, error, count } = await query
    .order("deadline", { ascending: true })
    .range(startIndex, startIndex + limit - 1)

  if (error) {
    console.error("Error fetching scholarships:", error)
    return { scholarships: [], count: 0 }
  }

  return { scholarships: data, count: count || 0 }
}

// Scholarships
export async function getFeaturedScholarships(limit = 3) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("scholarships")
    .select("*, categories(name)")
    .eq("is_featured", true)
    .order("deadline", { ascending: true })
    .limit(limit)

  if (error) {
    console.error("Error fetching featured scholarships:", error)
    return []
  }

  return data
}

// Server-side data fetching functions for app directory
export async function getScholarships(
  page = 1,
  limit = 10,
  filters: {
    category?: string
    location?: string
    deadline?: string
    search?: string
    minAmount?: number
    maxAmount?: number
  } = {},
) {
  const supabase = createServerClient()
  const startIndex = (page - 1) * limit

  let query = supabase.from("scholarships").select("*, categories(name)", { count: "exact" })

  // Apply filters
  if (filters.category) {
    query = query.eq("categories.name", filters.category)
  }

  if (filters.location) {
    if (filters.location === "nigeria") {
      query = query.ilike("location", "%nigeria%")
    } else if (filters.location === "international") {
      query = query.not("location", "ilike", "%nigeria%")
    }
  }

  if (filters.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }

  if (filters.deadline) {
    const now = new Date()
    const endDate = new Date()

    if (filters.deadline === "week") {
      endDate.setDate(now.getDate() + 7)
    } else if (filters.deadline === "month") {
      endDate.setMonth(now.getMonth() + 1)
    } else if (filters.deadline === "three_months") {
      endDate.setMonth(now.getMonth() + 3)
    }

    if (filters.deadline !== "any") {
      query = query.lte("deadline", endDate.toISOString())
    }
  }

  const { data, error, count } = await query
    .order("deadline", { ascending: true })
    .range(startIndex, startIndex + limit - 1)

  if (error) {
    console.error("Error fetching scholarships:", error)
    return { scholarships: [], count: 0 }
  }

  return { scholarships: data, count: count || 0 }
}

// Events
export async function getUpcomingEvents(limit = 3) {
  const supabase = createServerClient()
  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from("events")
    .select("*, categories(name)")
    .gte("end_date", now)
    .order("start_date", { ascending: true })
    .limit(limit)

  if (error) {
    console.error("Error fetching upcoming events:", error)
    return []
  }

  return data
}

export async function getEvents(
  page = 1,
  limit = 6,
  filters: {
    category?: string
    location?: string
    date?: string
    search?: string
  } = {},
) {
  const supabase = createServerClient()
  const startIndex = (page - 1) * limit
  const now = new Date().toISOString()

  let query = supabase.from("events").select("*, categories(name)", { count: "exact" }).gte("end_date", now)

  // Apply filters
  if (filters.category) {
    query = query.eq("categories.name", filters.category)
  }

  if (filters.location) {
    if (filters.location === "uniport") {
      query = query.ilike("location", "%uniport%")
    } else if (filters.location === "port-harcourt") {
      query = query.ilike("location", "%port harcourt%")
    } else if (filters.location === "other") {
      query = query.not("location", "ilike", "%uniport%").not("location", "ilike", "%port harcourt%")
    }
  }

  if (filters.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }

  if (filters.date) {
    const today = new Date()
    const endDate = new Date()

    if (filters.date === "today") {
      endDate.setHours(23, 59, 59, 999)
      query = query.lte("start_date", endDate.toISOString()).gte("start_date", today.toISOString())
    } else if (filters.date === "week") {
      endDate.setDate(today.getDate() + 7)
      query = query.lte("start_date", endDate.toISOString())
    } else if (filters.date === "month") {
      endDate.setMonth(today.getMonth() + 1)
      query = query.lte("start_date", endDate.toISOString())
    }
  }

  const { data, error, count } = await query
    .order("start_date", { ascending: true })
    .range(startIndex, startIndex + limit - 1)

  if (error) {
    console.error("Error fetching events:", error)
    return { events: [], count: 0 }
  }

  return { events: data, count: count || 0 }
}

export async function getEventById(id: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("events").select("*, categories(name)").eq("id", id).single()

  if (error) {
    console.error("Error fetching event:", error)
    return null
  }

  return data
}

// News
export async function getLatestNews(limit = 3) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("news")
    .select("*, categories(name)")
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching latest news:", error)
    return []
  }

  return data
}

export async function getNews(
  page = 1,
  limit = 6,
  filters: {
    category?: string
    source?: string
    date?: string
    search?: string
  } = {},
) {
  const supabase = createServerClient()
  const startIndex = (page - 1) * limit

  let query = supabase.from("news").select("*, categories(name)", { count: "exact" })

  // Apply filters
  if (filters.category) {
    query = query.eq("categories.name", filters.category)
  }

  if (filters.search) {
    query = query.or(`title.ilike.%${filters.search}%,content.ilike.%${filters.search}%`)
  }

  if (filters.date) {
    const now = new Date()
    const startDate = new Date()

    if (filters.date === "today") {
      startDate.setHours(0, 0, 0, 0)
      query = query.gte("created_at", startDate.toISOString())
    } else if (filters.date === "week") {
      startDate.setDate(now.getDate() - 7)
      query = query.gte("created_at", startDate.toISOString())
    } else if (filters.date === "month") {
      startDate.setMonth(now.getMonth() - 1)
      query = query.gte("created_at", startDate.toISOString())
    } else if (filters.date === "year") {
      startDate.setFullYear(now.getFullYear() - 1)
      query = query.gte("created_at", startDate.toISOString())
    }
  }

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(startIndex, startIndex + limit - 1)

  if (error) {
    console.error("Error fetching news:", error)
    return { news: [], count: 0 }
  }

  return { news: data, count: count || 0 }
}

export async function getNewsById(id: string) {
  const supabase = createServerClient()

  // First, get the news item
  const { data, error } = await supabase.from("news").select("*, categories(name)").eq("id", id).single()

  if (error) {
    console.error("Error fetching news:", error)
    return null
  }

  // Then, increment the view count
  if (data) {
    const { error: updateError } = await supabase
      .from("news")
      .update({ views: (data.views || 0) + 1 })
      .eq("id", id)

    if (updateError) {
      console.error("Error updating view count:", updateError)
    }
  }

  return data
}

// Advertisements
export async function getActiveAdvertisements(position: string) {
  const supabase = createServerClient()
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

  if (error) {
    console.error("Error fetching advertisements:", error)
    return null
  }

  return data[0] || null
}

// Categories
export async function getCategories(type: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("type", type)
    .order("name", { ascending: true })

  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }

  return data
}

// Newsletter
export async function subscribeToNewsletter(email: string) {
  const { data, error } = await supabaseClient.from("newsletter_subscriptions").insert([{ email, is_active: true }])

  if (error) {
    if (error.code === "23505") {
      // Unique violation
      return { success: false, message: "This email is already subscribed." }
    }
    console.error("Error subscribing to newsletter:", error)
    return { success: false, message: "An error occurred. Please try again." }
  }

  return { success: true, message: "Successfully subscribed to the newsletter!" }
}

// Saved Items
export async function saveItem(userId: string, itemId: string, itemType: "scholarship" | "event" | "news") {
  const { data, error } = await supabaseClient
    .from("saved_items")
    .insert([{ user_id: userId, item_id: itemId, item_type: itemType }])

  if (error) {
    if (error.code === "23505") {
      // Unique violation
      return { success: false, message: "Item already saved." }
    }
    console.error("Error saving item:", error)
    return { success: false, message: "An error occurred. Please try again." }
  }

  return { success: true, message: "Item saved successfully!" }
}

export async function unsaveItem(userId: string, itemId: string, itemType: "scholarship" | "event" | "news") {
  const { error } = await supabaseClient
    .from("saved_items")
    .delete()
    .eq("user_id", userId)
    .eq("item_id", itemId)
    .eq("item_type", itemType)

  if (error) {
    console.error("Error unsaving item:", error)
    return { success: false, message: "An error occurred. Please try again." }
  }

  return { success: true, message: "Item removed from saved items." }
}

export async function getSavedItems(userId: string, itemType?: "scholarship" | "event" | "news") {
  const supabase = createServerClient()

  let query = supabase.from("saved_items").select("*").eq("user_id", userId)

  if (itemType) {
    query = query.eq("item_type", itemType)
  }

  const { data, error } = await query.order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching saved items:", error)
    return []
  }

  // Fetch the actual items
  const items = await Promise.all(
    data.map(async (savedItem) => {
      if (savedItem.item_type === "scholarship") {
        return getScholarshipById(savedItem.item_id)
      } else if (savedItem.item_type === "event") {
        return getEventById(savedItem.item_id)
      } else if (savedItem.item_type === "news") {
        return getNewsById(savedItem.item_id)
      }
      return null
    }),
  )

  return items.filter(Boolean)
}

export async function isItemSaved(userId: string, itemId: string, itemType: "scholarship" | "event" | "news") {
  const { data, error } = await supabaseClient
    .from("saved_items")
    .select("*")
    .eq("user_id", userId)
    .eq("item_id", itemId)
    .eq("item_type", itemType)
    .single()

  if (error) {
    if (error.code === "PGRST116") {
      // No rows returned
      return false
    }
    console.error("Error checking if item is saved:", error)
    return false
  }

  return Boolean(data)
}

export async function getScholarshipById(id: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("scholarships").select("*, categories(name)").eq("id", id).single()

  if (error) {
    console.error("Error fetching scholarship:", error)
    return null
  }

  return data
}
