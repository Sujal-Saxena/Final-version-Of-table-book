import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { 
  MapPin, 
  Users, 
  GraduationCap, 
  UtensilsCrossed, 
  Target, 
  Lightbulb,
  Code,
  Heart,
  BookOpen,
  Award,
  Building2,
  Mail,
  Phone,
  Globe,
  CheckCircle2,
  Linkedin,
  ExternalLink
} from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  const teamMembers = [
    { name: 'Er. Sujal Saxena', role: 'Frontend Developer', education: 'Bachelor of Technology - Final Year', linkedin: 'https://linkedin.com/in/sujalsaxena/' },
    { name: 'Er. Anushka Mathur', role: 'Frontend Developer', education: 'Bachelor of Technology - Final Year', linkedin: 'https://linkedin.com/in/anushkamathurcs/' },
    { name: 'Er. Neha Sharma', role: 'Backend Developer & Project Manager', education: 'Bachelor of Technology - Final Year', linkedin: '' },
    { name: 'Er. Bittoo Varshney', role: 'Backend Developer', education: 'Bachelor of Technology - Final Year', linkedin: 'https://www.linkedin.com/in/bittu-varshney-91865b243/' },
  ]

  const technologies = [
    'Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Shadcn/UI'
  ]

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">Final Year Project 2025-2026</Badge>
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-primary/10 mb-6">
              <UtensilsCrossed className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
              About TableBook
            </h1>
            <p className="text-lg text-muted-foreground text-pretty mb-6">
              A comprehensive table booking platform designed to simplify restaurant reservations 
              and enhance the dining experience in Aligarh.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {technologies.map((tech) => (
                <Badge key={tech} variant="outline" className="text-xs">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Project Description */}
          <Card className="overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-primary to-primary/50" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                About The Project
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-5 rounded-xl bg-primary/5 border border-primary/10">
                <p className="text-foreground leading-relaxed text-center font-medium">
                  We 4 teammates built this project for our <span className="text-primary">Final Year Submission</span> in 
                  the <span className="text-primary">Department of Computer Science</span> under 
                  the guidance of <span className="text-primary">HOD Professor Ankita</span>.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    Project Overview
                  </h4>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    TableBook is a modern web application that bridges the gap between restaurants and customers. 
                    It provides an intuitive platform for making table reservations, managing bookings, 
                    and discovering new dining experiences in Aligarh.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    Our Mission
                  </h4>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    To revolutionize the dining experience by providing a seamless, efficient, and enjoyable 
                    way to book tables at restaurants. We aim to save time for customers while helping 
                    restaurants manage their reservations effectively.
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Core Features
                </h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    'Real-time table availability',
                    'Loyalty rewards program',
                    'Coupon discounts system',
                    'Customer reviews & ratings',
                    'Booking management',
                    'Restaurant discovery'
                  ].map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Institution Section */}
          <Card className="overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-primary to-primary/50" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                Institution & Guidance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* College Info Card */}
              <div className="p-6 rounded-xl bg-muted/50 border">
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-10 w-10 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-1">Vision College Aligarh</h3>
                    <Badge variant="secondary" className="mb-3">Department of Computer Science</Badge>
                    
                    <div className="grid sm:grid-cols-2 gap-3 mt-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 text-primary" />
                        Aligarh, Uttar Pradesh, India
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Globe className="h-4 w-4 text-primary" />
                        www.visioncollegealigarh.edu
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Supervisor Card */}
              <Link
                href="https://linkedin.com/in/ankita-varshney-040863268/"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-6 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 hover:shadow-lg hover:border-primary/40 transition-all duration-300 group cursor-pointer"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-primary uppercase tracking-wider mb-1">Project Supervisor</p>
                    <h4 className="text-xl font-bold group-hover:text-primary transition-colors">Professor Ankita</h4>
                    <p className="text-muted-foreground text-sm">
                      Head of Department, Computer Science
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <Linkedin className="h-5 w-5" />
                    <ExternalLink className="h-4 w-4" />
                  </div>
                </div>
                <Separator className="my-4" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Under the expert guidance of Professor Ankita, our team successfully developed this 
                  comprehensive table booking system. Her mentorship in software engineering principles, 
                  database design, and project management was instrumental in bringing this project to fruition.
                </p>
              </Link>

              {/* Academic Context */}
              <div className="p-5 rounded-lg border bg-card">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  Academic Context
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  This project was developed as part of the final year curriculum at Vision College Aligarh, 
                  demonstrating practical application of software development concepts including modern web technologies, 
                  responsive design, database management, and user experience design. It represents our collective 
                  learning and technical growth throughout the Computer Science program.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Team Section */}
          <Card className="overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-primary to-primary/50" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Our Team
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-8">
                <p className="text-muted-foreground">
                  A dedicated team of 4 Computer Science students working together to bring this vision to life.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {teamMembers.map((member, index) => {
                  const CardContent = (
                    <>
                      <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                        <Code className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold group-hover:text-primary transition-colors">{member.name}</h4>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                        <p className="text-xs text-muted-foreground/70 mt-1">{member.education}</p>
                      </div>
                      {member.linkedin && (
                        <div className="flex items-center gap-1 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                          <Linkedin className="h-4 w-4" />
                          <ExternalLink className="h-3 w-3" />
                        </div>
                      )}
                    </>
                  )

                  return member.linkedin ? (
                    <Link
                      key={index}
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 p-5 rounded-xl border bg-card hover:shadow-lg hover:border-primary/30 transition-all duration-300 cursor-pointer"
                    >
                      {CardContent}
                    </Link>
                  ) : (
                    <div 
                      key={index}
                      className="group flex items-center gap-4 p-5 rounded-xl border bg-card hover:shadow-lg hover:border-primary/30 transition-all duration-300"
                    >
                      {CardContent}
                    </div>
                  )
                })}
              </div>
              <div className="mt-6 p-4 rounded-lg bg-muted/50 text-center">
                <p className="text-xs text-muted-foreground">
                  Vision College Aligarh - Department of Computer Science - Batch 2025-2026
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Footer Note */}
          <div className="text-center py-8">
            <Separator className="mb-8" />
            <p className="text-muted-foreground flex items-center justify-center gap-2">
              Made with <Heart className="h-4 w-4 text-red-500 fill-red-500" /> by Vision College Students
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Final Year Project 2025-2026
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}
