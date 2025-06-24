import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Newsletter() {
  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight">Get Travel Inspiration & Special Offers</h2>
          <p className="mt-4 mb-8">
            Subscribe to our newsletter and be the first to know about exclusive deals and new destinations.
          </p>
          <form className="flex flex-col gap-4 sm:flex-row">
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-primary-foreground text-primary"
              required
            />
            <Button variant="secondary" type="submit">
              Subscribe
            </Button>
          </form>
          <p className="mt-4 text-sm opacity-80">
            By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
          </p>
        </div>
      </div>
    </section>
  )
}
