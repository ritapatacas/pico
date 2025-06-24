import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { ClockIcon, StarIcon, UsersIcon, ChevronRightIcon, MapPinIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function PopularPackages() {
  const packages = [
    {
      id: 1,
      title: "Bali Adventure Package",
      location: "Bali, Indonesia",
      image: "/placeholder.svg?height=400&width=600",
      price: 1299,
      duration: 7,
      rating: 4.8,
      reviews: 124,
      featured: true,
      tags: ["Beach", "Adventure", "Cultural"],
    },
    {
      id: 2,
      title: "Greek Islands Explorer",
      location: "Santorini & Mykonos, Greece",
      image: "/placeholder.svg?height=400&width=600",
      price: 1899,
      duration: 10,
      rating: 4.9,
      reviews: 89,
      featured: false,
      tags: ["Island", "Luxury", "Romantic"],
    },
    {
      id: 3,
      title: "Japan Cultural Tour",
      location: "Tokyo, Kyoto & Osaka, Japan",
      image: "/placeholder.svg?height=400&width=600",
      price: 2499,
      duration: 12,
      rating: 4.7,
      reviews: 156,
      featured: false,
      tags: ["Cultural", "City", "Food"],
    },
    {
      id: 4,
      title: "Peruvian Highlights",
      location: "Lima, Cusco & Machu Picchu, Peru",
      image: "/placeholder.svg?height=400&width=600",
      price: 1799,
      duration: 9,
      rating: 4.6,
      reviews: 78,
      featured: true,
      tags: ["Adventure", "Historical", "Nature"],
    },
    {
      id: 5,
      title: "Safari Experience",
      location: "Kenya & Tanzania",
      image: "/placeholder.svg?height=400&width=600",
      price: 3299,
      duration: 14,
      rating: 4.9,
      reviews: 112,
      featured: false,
      tags: ["Wildlife", "Nature", "Adventure"],
    },
    {
      id: 6,
      title: "Thailand Beach Getaway",
      location: "Phuket & Krabi, Thailand",
      image: "/placeholder.svg?height=400&width=600",
      price: 1199,
      duration: 8,
      rating: 4.5,
      reviews: 94,
      featured: false,
      tags: ["Beach", "Relaxation", "Island"],
    },
  ]

  return (
    <section className="py-16">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col items-center justify-between gap-4 mb-12 md:flex-row">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Popular Packages</h2>
            <p className="text-muted-foreground">Our most booked travel experiences</p>
          </div>
          <Link href="/packages" className="flex items-center text-sm font-medium text-primary hover:underline">
            View all packages
            <ChevronRightIcon className="w-4 h-4 ml-1" />
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <Card key={pkg.id} className="overflow-hidden transition-all hover:shadow-lg">
              <div className="relative">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={pkg.image || "/placeholder.svg"}
                    alt={pkg.title}
                    fill
                    className="object-cover transition-transform hover:scale-105"
                  />
                </div>
                {pkg.featured && (
                  <Badge className="absolute top-3 left-3" variant="secondary">
                    Featured
                  </Badge>
                )}
              </div>
              <CardHeader className="p-4 pb-0">
                <div className="flex flex-wrap gap-1 mb-2">
                  {pkg.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="font-normal">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <h3 className="text-lg font-semibold">{pkg.title}</h3>
                <p className="flex items-center text-sm text-muted-foreground">
                  <MapPinIcon className="w-4 h-4 mr-1" />
                  {pkg.location}
                </p>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <StarIcon className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium">{pkg.rating}</span>
                    <span className="text-sm text-muted-foreground">({pkg.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center text-sm">
                      <ClockIcon className="w-4 h-4 mr-1 text-muted-foreground" />
                      <span>{pkg.duration} days</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <UsersIcon className="w-4 h-4 mr-1 text-muted-foreground" />
                      <span>2-4</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between p-4 pt-0 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">Starting from</p>
                  <p className="text-xl font-bold">${pkg.price}</p>
                </div>
                <Button size="sm" asChild>
                  <Link href={`/packages/${pkg.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="flex justify-center mt-12">
          <Button variant="outline" size="lg" asChild>
            <Link href="/packages">Explore All Packages</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
