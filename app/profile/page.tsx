"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { getSupabaseClient } from "@/lib/supabase/client-singleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Calendar, Newspaper, Edit, Settings, Heart } from "lucide-react"
import { useRouter } from "next/navigation"

interface Profile {
  id: string
  username: string
  full_name: string
  avatar_url: string
  bio: string
  university: string
  course: string
  graduation_year: number
  created_at: string
}

interface SavedItem {
  id: string
  item_id: string
  item_type: "scholarship" | "event" | "news"
  created_at: string
  title: string
  description: string
}

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [savedItems, setSavedItems] = useState<SavedItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = getSupabaseClient()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/sign-in")
      return
    }

    if (user) {
      fetchProfile()
      fetchSavedItems()
    }
  }, [user, loading])

  const fetchProfile = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error("Error fetching profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSavedItems = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from("saved_items")
        .select(`
          id,
          item_id,
          item_type,
          created_at
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error

      // Fetch details for each saved item
      const itemsWithDetails = await Promise.all(
        data.map(async (item) => {
          let details = null
          try {
            const { data: itemData } = await supabase
              .from(item.item_type === "scholarship" ? "scholarships" : item.item_type === "event" ? "events" : "news")
              .select("title, description")
              .eq("id", item.item_id)
              .single()

            details = itemData
          } catch (error) {
            console.error(`Error fetching ${item.item_type} details:`, error)
          }

          return {
            ...item,
            title: details?.title || "Unknown",
            description: details?.description || "",
          }
        }),
      )

      setSavedItems(itemsWithDetails)
    } catch (error) {
      console.error("Error fetching saved items:", error)
    }
  }

  const removeSavedItem = async (itemId: string) => {
    try {
      const { error } = await supabase.from("saved_items").delete().eq("id", itemId)

      if (error) throw error

      setSavedItems(savedItems.filter((item) => item.id !== itemId))
    } catch (error) {
      console.error("Error removing saved item:", error)
    }
  }

  const getItemIcon = (type: string) => {
    switch (type) {
      case "scholarship":
        return <BookOpen className="h-4 w-4" />
      case "event":
        return <Calendar className="h-4 w-4" />
      case "news":
        return <Newspaper className="h-4 w-4" />
      default:
        return <Heart className="h-4 w-4" />
    }
  }

  const getItemColor = (type: string) => {
    switch (type) {
      case "scholarship":
        return "bg-blue-100 text-blue-800"
      case "event":
        return "bg-green-100 text-green-800"
      case "news":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!user || !profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-8">
            <p>Profile not found</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const savedByType = {
    scholarship: savedItems.filter((item) => item.item_type === "scholarship"),
    event: savedItems.filter((item) => item.item_type === "event"),
    news: savedItems.filter((item) => item.item_type === "news"),
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile.avatar_url || "/placeholder.svg"} alt={profile.full_name} />
              <AvatarFallback className="text-lg">
                {profile.full_name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("") || "U"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl font-bold">{profile.full_name}</h1>
                  <p className="text-muted-foreground">@{profile.username}</p>
                </div>
                <div className="flex gap-2 mt-2 md:mt-0">
                  <Button variant="outline" size="sm" onClick={() => router.push("/profile/edit")}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </div>
              </div>

              {profile.bio && <p className="text-sm text-muted-foreground">{profile.bio}</p>}

              <div className="flex flex-wrap gap-2">
                {profile.university && <Badge variant="secondary">{profile.university}</Badge>}
                {profile.course && <Badge variant="outline">{profile.course}</Badge>}
                {profile.graduation_year && <Badge variant="outline">Class of {profile.graduation_year}</Badge>}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Saved Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Saved Items ({savedItems.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All ({savedItems.length})</TabsTrigger>
              <TabsTrigger value="scholarship">Scholarships ({savedByType.scholarship.length})</TabsTrigger>
              <TabsTrigger value="event">Events ({savedByType.event.length})</TabsTrigger>
              <TabsTrigger value="news">News ({savedByType.news.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {savedItems.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No saved items yet</p>
              ) : (
                <div className="space-y-3">
                  {savedItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge className={getItemColor(item.item_type)}>
                          {getItemIcon(item.item_type)}
                          <span className="ml-1 capitalize">{item.item_type}</span>
                        </Badge>
                        <div>
                          <h4 className="font-medium">{item.title}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-1">{item.description}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSavedItem(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {Object.entries(savedByType).map(([type, items]) => (
              <TabsContent key={type} value={type} className="space-y-4">
                {items.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No saved {type}s yet</p>
                ) : (
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{item.title}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSavedItem(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
