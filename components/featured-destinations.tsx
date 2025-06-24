import { Card, CardContent } from "@/components/ui/card"
import { MapPinIcon, ChevronRightIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function FeaturedDestinations() {
  const destinations = [
    {
      id: 1,
      name: "Badimalika temple",
      image: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Badi_Malika.png",
      description: "Hindu temple located in Triveni Municipality, Bajura district",
      properties: 240,
    },
    {
      id: 2,
      name: "Santorini, Greece",
      image: "/placeholder.svg?height=400&width=600",
      description: "Iconic white buildings with breathtaking sea views",
      properties: 186,
    },
    {
      id: 3,
      name: "Kyoto, Japan",
      image: "/placeholder.svg?height=400&width=600",
      description: "Ancient temples and beautiful cherry blossoms",
      properties: 320,
    },
    {
      id: 4,
      name: "Machu Picchu, Peru",
      image: "/placeholder.svg?height=400&width=600",
      description: "Historic Incan citadel set among breathtaking mountains",
      properties: 95,
    },
  ]

  return (
    <section className="py-16 bg-muted/50">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col items-center justify-between gap-4 mb-12 md:flex-row">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Featured Destinations</h2>
            <p className="text-muted-foreground">Explore our handpicked destinations around the world</p>
          </div>
          <Link href="/destinations" className="flex items-center text-sm font-medium text-primary hover:underline">
            View all destinations
            <ChevronRightIcon className="w-4 h-4 ml-1" />
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {destinations.map((destination) => (
            <Link href={`/destinations/${destination.id}`} key={destination.id}>
              <Card className="overflow-hidden transition-all hover:shadow-lg">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={destination.image || "/placeholder.svg"}
                    alt={destination.name}
                    fill
                    className="object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold">{destination.name}</h3>
                  <p className="text-sm text-muted-foreground">{destination.description}</p>
                  <div className="flex items-center mt-2 text-sm">
                    <MapPinIcon className="w-4 h-4 mr-1 text-primary" />
                    <span>{destination.properties} properties</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
