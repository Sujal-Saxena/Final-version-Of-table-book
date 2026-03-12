import Link from 'next/link'
import { UtensilsCrossed, MapPin, Phone, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <UtensilsCrossed className="h-6 w-6 text-primary" />
              <span className="text-xl font-semibold">TableBook</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Discover and book tables at the best restaurants in Aligarh, Uttar Pradesh.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Aligarh, Uttar Pradesh 202001
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                +91 571 XXX XXXX
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                support@tablebook.in
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Explore</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/restaurants" className="hover:text-foreground transition-colors">
                  All Restaurants
                </Link>
              </li>
              <li>
                <Link href="/restaurants?cuisine=Mughlai" className="hover:text-foreground transition-colors">
                  Mughlai
                </Link>
              </li>
              <li>
                <Link href="/restaurants?cuisine=Biryani" className="hover:text-foreground transition-colors">
                  Biryani
                </Link>
              </li>
              <li>
                <Link href="/restaurants?cuisine=North%20Indian" className="hover:text-foreground transition-colors">
                  North Indian
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Account</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/bookings" className="hover:text-foreground transition-colors">
                  My Bookings
                </Link>
              </li>
              <li>
                <Link href="/bookings" className="hover:text-foreground transition-colors">
                  Loyalty Rewards
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <span className="cursor-pointer hover:text-foreground transition-colors">
                  Help Center
                </span>
              </li>
              <li>
                <span className="cursor-pointer hover:text-foreground transition-colors">
                  Contact Us
                </span>
              </li>
              <li>
                <span className="cursor-pointer hover:text-foreground transition-colors">
                  Privacy Policy
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            2026 TableBook. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Made with care for food lovers in Aligarh.
          </p>
        </div>
      </div>
    </footer>
  )
}
