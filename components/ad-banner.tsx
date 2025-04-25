import { AdBannerClient } from "./ad-banner-client"

interface AdBannerProps {
  position: string
  className?: string
}

export function AdBanner(props: AdBannerProps) {
  return <AdBannerClient {...props} />
}
