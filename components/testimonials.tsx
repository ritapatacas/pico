import { Card, CardContent } from "@/components/ui/card"
import { StarIcon } from "lucide-react"
import Image from "next/image"

export function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      location: "New York, USA",
      avatar: "/placeholder.svg?height=100&width=100",
      rating: 5,
      text: "Our Bali trip was absolutely perfect! The itinerary was well-balanced with adventure and relaxation. Our guide was knowledgeable and friendly. Will definitely book with TravelEase again!",
      package: "Bali Adventure Package",
    },
    {
      id: 2,
      name: "Michael Chen",
      location: "Toronto, Canada",
      avatar: "/placeholder.svg?height=100&width=100",
      rating: 5,
      text: "The Greek Islands Explorer package exceeded our expectations. The accommodations were luxurious, and the private tours gave us insights we wouldn't have discovered on our own.",
      package: "Greek Islands Explorer",
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      location: "London, UK",
      avatar: "/placeholder.svg?height=100&width=100",
      rating: 4,
      text: "Japan Cultural Tour was an amazing experience. The attention to detail in the itinerary allowed us to experience both traditional and modern Japan. Highly recommend!",
      package: "Japan Cultural Tour",
    },
  ]

  return (
    <section className="py-16 bg-muted/50">
      <div className="container px-4 mx-auto">
        <div className="max-w-2xl mx-auto mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight">What Our Travelers Say</h2>
          <p className="mt-4 text-muted-foreground">
            Real experiences from travelers who have explored the world with us
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Image
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                  <div>
                    <h4 className="font-medium">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`w-4 h-4 ${
                        i < testimonial.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300 fill-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="mb-4 text-sm italic">"{testimonial.text}"</p>
                <p className="text-xs text-muted-foreground">Package: {testimonial.package}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
