import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getSupabaseClient } from "@/lib/supabase/client-singleton"
import { BookOpen, Calendar, Newspaper, Users, ImageIcon } from "lucide-react"

async function getAdminStats() {
  const supabase = getSupabaseClient()

  try {
    const [scholarships, events, news, users, ads] = await Promise.all([
      supabase.from("scholarships").select("id", { count: "exact" }),
      supabase.from("events").select("id", { count: "exact" }),
      supabase.from("news").select("id", { count: "exact" }),
      supabase.from("profiles").select("id", { count: "exact" }),
      supabase.from("advertisements").select("id", { count: "exact" }),
    ])

    return {
      scholarships: scholarships.count || 0,
      events: events.count || 0,
      news: news.count || 0,
      users: users.count || 0,
      ads: ads.count || 0,
    }
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return {
      scholarships: 0,
      events: 0,
      news: 0,
      users: 0,
      ads: 0,
    }
  }
}

export default async function AdminDashboard() {
  const stats = await getAdminStats()

  const statCards = [
    {
      title: "Total Scholarships",
      value: stats.scholarships,
      icon: BookOpen,
      color: "text-blue-600",
    },
    {
      title: "Total Events",
      value: stats.events,
      icon: Calendar,
      color: "text-green-600",
    },
    {
      title: "Total News",
      value: stats.news,
      icon: Newspaper,
      color: "text-purple-600",
    },
    {
      title: "Total Users",
      value: stats.users,
      icon: Users,
      color: "text-orange-600",
    },
    {
      title: "Active Ads",
      value: stats.ads,
      icon: ImageIcon,
      color: "text-red-600",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the Campus Guide Nigeria admin panel</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <a
              href="/admin/scholarships/new"
              className="block w-full rounded-md bg-primary px-3 py-2 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Add New Scholarship
            </a>
            <a
              href="/admin/events/new"
              className="block w-full rounded-md bg-secondary px-3 py-2 text-center text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
            >
              Add New Event
            </a>
            <a
              href="/admin/news/new"
              className="block w-full rounded-md bg-accent px-3 py-2 text-center text-sm font-medium text-accent-foreground hover:bg-accent/80"
            >
              Add New Article
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Activity tracking will be implemented here</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
