"use client"

import { useEffect } from "react"

export default function DeletePagesDirectory() {
  useEffect(() => {
    console.log("This is a client component that doesn't use any server components")
  }, [])

  return <div>This is a client component that doesn't use any server components</div>
}
