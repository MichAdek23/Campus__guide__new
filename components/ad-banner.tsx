import { cn } from "@/lib/utils"
import { getActiveAdvertisements } from "@/lib/supabase/data-fetching"

interface AdBannerProps {
  position: string
  className?: string
}

export async function AdBanner({ position, className }: AdBannerProps) {
  const ad = await getActiveAdvertisements(position)

  // Different ad sizes based on position
  let adHeight = "h-24"

  switch (position) {
    case "top":
    case "bottom":
    case "middle":
      adHeight = "h-24 sm:h-32"
      break
    case "sidebar":
      adHeight = "h-64"
      break
    case "content":
      adHeight = "h-20"
      break
    default:
      adHeight = "h-24"
  }

  if (!ad) {
    return (
      <div
        className={cn(
          "w-full rounded-lg bg-muted/50 border border-dashed flex items-center justify-center",
          adHeight,
          className,
        )}
      >
        <p className="text-muted-foreground text-sm font-medium">Advertisement</p>
      </div>
    )
  }

  return (
    <a
      href={ad.link_url || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("w-full rounded-lg overflow-hidden block relative", adHeight, className)}
    >
      <img src={ad.image_url || "/placeholder.svg"} alt={ad.name} className="w-full h-full object-cover" />
      <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">Ad</div>
    </a>
  )
}
