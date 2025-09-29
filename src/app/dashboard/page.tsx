"use client"

import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Briefcase, 
  Camera, 
  CreditCard, 
  TrendingUp,
  Clock,
  CheckCircle,
  DollarSign
} from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { data: session } = useSession()

  const isProvider = session?.user.role === "PROVIDER"
  const isClient = session?.user.role === "CLIENT"
  const isAdmin = session?.user.role === "ADMIN"

  // Mock data - in real app, this would come from API
  const stats = {
    totalJobs: 12,
    completedJobs: 8,
    pendingJobs: 3,
    totalEarnings: 2450.00,
    pendingPayments: 450.00
  }

  const recentJobs = [
    {
      id: "1",
      title: "Lawn Mowing Service",
      status: "COMPLETED",
      amount: 150.00,
      date: "2024-01-15"
    },
    {
      id: "2", 
      title: "House Cleaning",
      status: "IN_PROGRESS",
      amount: 200.00,
      date: "2024-01-14"
    },
    {
      id: "3",
      title: "Gutter Cleaning",
      status: "PENDING",
      amount: 120.00,
      date: "2024-01-13"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {session?.user.name || "User"}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your {isProvider ? "business" : "services"} today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalJobs}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedJobs}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((stats.completedJobs / stats.totalJobs) * 100)}% completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingJobs}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting your action
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Briefcase className="h-5 w-5 mr-2" />
              {isProvider ? "Post a Job" : "Request Service"}
            </CardTitle>
            <CardDescription>
              {isProvider 
                ? "Create a new job listing for clients to book"
                : "Find and request services from providers"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href={isProvider ? "/dashboard/jobs/new" : "/dashboard/services"}>
              <Button className="w-full">
                {isProvider ? "Create Job" : "Find Services"}
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Camera className="h-5 w-5 mr-2" />
              Upload Proof
            </CardTitle>
            <CardDescription>
              Upload before/after photos to show your work
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/proof">
              <Button variant="outline" className="w-full">
                Upload Photos
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              View Invoices
            </CardTitle>
            <CardDescription>
              Manage your invoices and payments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/invoices">
              <Button variant="outline" className="w-full">
                View Invoices
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Jobs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Jobs</CardTitle>
          <CardDescription>
            Your latest job activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentJobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium">{job.title}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(job.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium">${job.amount.toFixed(2)}</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    job.status === "COMPLETED" 
                      ? "bg-green-100 text-green-800"
                      : job.status === "IN_PROGRESS"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {job.status.replace("_", " ")}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Link href="/dashboard/jobs">
              <Button variant="outline" className="w-full">
                View All Jobs
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
