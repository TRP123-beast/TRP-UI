import Script from "next/script"

export default async function MapInitializer() {
  // This keeps the API key on the server side
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""

  if (!apiKey) {
    return <div className="p-4 bg-yellow-50 text-yellow-800 rounded-md">Google Maps API key not configured</div>
  }

  // The API key is only included in server-rendered HTML
  return (
    <Script
      src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`}
      strategy="afterInteractive"
      onLoad={() => {
        window.dispatchEvent(new Event("google-maps-loaded"))
      }}
    />
  )
}
