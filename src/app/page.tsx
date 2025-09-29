import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Camera, CreditCard, Users, Star, ArrowRight, Shield, Zap } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">WorkProofed</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/signin">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Proof Your Work.{" "}
            <span className="text-indigo-600">Get Paid.</span>{" "}
            Stress-Free.
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            The first platform where service businesses can show proof, invoice instantly, 
            and guarantee payment — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="text-lg px-8 py-3">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Three simple steps to get paid for your work
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Accept or Create Jobs</h3>
              <p className="text-gray-600">
                Post your services or accept client requests. Set your rates and schedule.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Upload Proof of Work</h3>
              <p className="text-gray-600">
                Take before/after photos with timestamps and geotags for authenticity.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Send Invoice & Get Paid</h3>
              <p className="text-gray-600">
                Automatic invoicing with guaranteed payment collection through Stripe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600">
              Built specifically for service businesses
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 text-indigo-600 mr-2" />
                  Job Listings & Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Post your services or accept client requests. Manage your schedule and availability.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Camera className="h-5 w-5 text-indigo-600 mr-2" />
                  Proof of Work
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Upload before/after photos with timestamps and geotags. Generate professional reports.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 text-indigo-600 mr-2" />
                  Smart Invoicing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Auto-generated invoices with job details. Professional PDF reports for clients.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 text-indigo-600 mr-2" />
                  Guaranteed Payments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Stripe integration ensures you get paid. No more chasing down payments.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 text-indigo-600 mr-2" />
                  AI Job Assistant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  AI-powered job descriptions and smart upsell suggestions to grow your business.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 text-indigo-600 mr-2" />
                  Client Reviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Build your reputation with verified reviews and ratings from satisfied clients.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Built for Service Businesses, Trusted Across Industries
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">1000+</div>
              <div className="text-gray-600">Service Providers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">$2M+</div>
              <div className="text-gray-600">Payments Processed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">99.9%</div>
              <div className="text-gray-600">Uptime</div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-8 max-w-4xl mx-auto">
            <blockquote className="text-xl text-gray-700 mb-4">
              "WorkProofed has completely transformed how we handle jobs and payments. 
              The proof of work feature gives our clients confidence, and we get paid faster than ever."
            </blockquote>
            <div className="flex items-center justify-center">
              <div className="text-sm text-gray-600">
                <div className="font-semibold">Sarah Johnson</div>
                <div>Owner, GreenThumb Lawn Care</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-indigo-600">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-indigo-100 mb-12">
            No upfront costs. No hidden fees. Just pay when you get paid.
          </p>
          
          <div className="bg-white rounded-lg p-8 max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="text-4xl font-bold text-gray-900 mb-2">2.5%</div>
              <div className="text-gray-600">per side per transaction</div>
            </div>
            
            <div className="space-y-4 text-left">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span className="text-gray-700">Service provider pays 2.5%</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span className="text-gray-700">Client pays 2.5%</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span className="text-gray-700">WorkProofed handles all payment processing</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span className="text-gray-700">Guaranteed payment collection</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Start Proofing & Getting Paid Today
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of service businesses already using WorkProofed
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Link href="/auth/signup" className="flex-1">
              <Button size="lg" className="w-full text-lg">
                Get Started Free
              </Button>
            </Link>
          </div>
          
          <p className="text-sm text-gray-400 mt-4">
            No credit card required • Free to start • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-white mb-4 md:mb-0">
              <h3 className="text-xl font-bold">WorkProofed</h3>
              <p className="text-gray-400">Proof Your Work. Get Paid. Stress-Free.</p>
            </div>
            <div className="text-gray-400 text-sm">
              © 2024 WorkProofed. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
