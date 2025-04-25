"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getClientSideClient } from "@/lib/supabase/data-fetching"

export default function Newsletter() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !email.includes("@")) {
      setMessage({ text: "Please provide a valid email address", type: "error" })
      return
    }

    setLoading(true)

    try {
      const supabase = getClientSideClient()

      // Check if email already exists
      const { data: existingSubscriber } = await supabase
        .from("newsletter_subscribers")
        .select()
        .eq("email", email)
        .single()

      if (existingSubscriber) {
        setMessage({ text: "You are already subscribed to our newsletter", type: "error" })
        return
      }

      // Add new subscriber
      const { error } = await supabase.from("newsletter_subscribers").insert({ email })

      if (error) throw error

      setMessage({ text: "Thank you for subscribing to our newsletter!", type: "success" })
      setEmail("")
    } catch (error) {
      console.error("Error subscribing to newsletter:", error)
      setMessage({ text: "Failed to subscribe. Please try again later.", type: "error" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-12 bg-muted rounded-lg">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Stay updated with the latest scholarships, events, and news for Nigerian students.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>
        {message && (
          <p className={`mt-4 ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>{message.text}</p>
        )}
      </div>
    </section>
  )
}
