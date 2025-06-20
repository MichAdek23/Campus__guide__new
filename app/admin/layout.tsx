import type React from "react"
import { redirect } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase/client-singleton"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { BarChart3, Users, BookOpen, Calendar, Newspaper, Settings, Tag, ImageIcon } from "lucide-react"

async function checkAdminAccess() {
  const supabase = getSupabaseClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      redirect("/auth/sign-in")
    }

    // Check if user has admin role
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (!profile || profile.role !== "admin") {
      redirect("/")
    }
  } catch (error) {
    redirect("/auth/sign-in")
  }
}

const adminNavItems = [
  { title: "Dashboard", href: "/admin", icon: BarChart3 },
  { title: "Scholarships", href: "/admin/scholarships", icon: BookOpen },
  { title: "Events", href: "/admin/events", icon: Calendar },
  { title: "News", href: "/admin/news", icon: Newspaper },
  { title: "Categories", href: "/admin/categories", icon: Tag },
  { title: "Advertisements", href: "/admin/advertisements", icon: ImageIcon },
  { title: "Users", href: "/admin/users", icon: Users },
  { title: "Settings", href: "/admin/settings", icon: Settings },
]

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await checkAdminAccess()

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader>
            <h2 className="text-lg font-semibold px-4 py-2">Admin Panel</h2>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {adminNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild>
                    <a href={item.href} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      {item.title}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </SidebarProvider>
  )
}
