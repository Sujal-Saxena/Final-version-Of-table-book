'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Menu, Search, CalendarDays, UtensilsCrossed, MapPin } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/restaurants?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <UtensilsCrossed className="h-6 w-6 text-primary" />
            <div className="flex flex-col">
              <span className="text-xl font-semibold tracking-tight leading-tight">TableBook</span>
              <span className="text-[10px] text-muted-foreground flex items-center gap-0.5 leading-none">
                <MapPin className="h-2.5 w-2.5" />
                Aligarh, UP
              </span>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/restaurants" 
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Restaurants
            </Link>
            <Link 
              href="/bookings" 
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              My Bookings
            </Link>
            <Link 
              href="/complaint" 
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Complaint
            </Link>
            <Link 
              href="/feedback" 
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Feedback
            </Link>
            <Link 
              href="/about" 
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              About
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <Input
                type="search"
                placeholder="Search restaurants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-[200px] md:w-[300px]"
                autoFocus
              />
              <Button type="submit" size="sm">Search</Button>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setSearchOpen(false)
                  setSearchQuery('')
                }}
              >
                Cancel
              </Button>
            </form>
          ) : (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="hidden md:flex"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
              
              <Link href="/bookings">
                <Button variant="ghost" size="icon" className="hidden md:flex">
                  <CalendarDays className="h-5 w-5" />
                  <span className="sr-only">My Bookings</span>
                </Button>
              </Link>
              
              <Link href="/restaurants">
                <Button className="hidden md:inline-flex">
                  Book a Table
                </Button>
              </Link>
            </>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px]">
              <nav className="flex flex-col gap-4 mt-8">
                <form onSubmit={handleSearch} className="flex flex-col gap-2">
                  <Input
                    type="search"
                    placeholder="Search restaurants..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button type="submit" className="w-full">Search</Button>
                </form>
                <hr className="my-2" />
                <Link 
                  href="/restaurants" 
                  className="text-lg font-medium py-2 hover:text-primary transition-colors"
                >
                  Browse Restaurants
                </Link>
                <Link 
                  href="/bookings" 
                  className="text-lg font-medium py-2 hover:text-primary transition-colors"
                >
                  My Bookings
                </Link>
                <Link 
                  href="/complaint" 
                  className="text-lg font-medium py-2 hover:text-primary transition-colors"
                >
                  File Complaint
                </Link>
                <Link 
                  href="/feedback" 
                  className="text-lg font-medium py-2 hover:text-primary transition-colors"
                >
                  Share Feedback
                </Link>
                <Link 
                  href="/about" 
                  className="text-lg font-medium py-2 hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
