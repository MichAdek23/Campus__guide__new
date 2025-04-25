"use client"

import Head from "next/head"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AdBannerClient } from "@/components/ad-banner-client"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitSuccess(true)
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      })

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false)
      }, 5000)
    }, 1500)
  }

  return (
    <>
      <Head>
        <title>Contact | Campus Guide Nigeria</title>
        <meta name="description" content="Contact Campus Guide Nigeria with your questions or feedback" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
        <p className="text-muted-foreground mb-8">Have questions or feedback? We'd love to hear from you!</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            {submitSuccess ? (
              <div className="bg-green-100 dark:bg-green-900 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-6">
                <h3 className="text-green-800 dark:text-green-200 font-medium text-lg">Message Sent!</h3>
                <p className="text-green-700 dark:text-green-300">
                  Thank you for contacting us. We'll get back to you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Your Name
                  </label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Subject
                  </label>
                  <Input id="subject" name="subject" value={formData.subject} onChange={handleChange} required />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            )}

            <AdBannerClient position="contact-form" className="mt-8" />
          </div>

          <div>
            <div className="bg-muted rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-muted-foreground">info@campusguide.ng</p>
                </div>

                <div>
                  <h3 className="font-medium">Phone</h3>
                  <p className="text-muted-foreground">+234 800 123 4567</p>
                </div>

                <div>
                  <h3 className="font-medium">Address</h3>
                  <p className="text-muted-foreground">
                    Port Harcourt, Rivers State
                    <br />
                    Nigeria
                  </p>
                </div>

                <div>
                  <h3 className="font-medium">Social Media</h3>
                  <div className="flex space-x-4 mt-2">
                    <a href="#" className="text-primary hover:text-primary/80">
                      Twitter
                    </a>
                    <a href="#" className="text-primary hover:text-primary/80">
                      Facebook
                    </a>
                    <a href="#" className="text-primary hover:text-primary/80">
                      Instagram
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Advertise With Us</h2>
              <p className="mb-4">
                Interested in advertising on Campus Guide Nigeria? We offer various ad placement options to help you
                reach Nigerian students.
              </p>
              <Button variant="outline">View Advertising Options</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
