"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  BarChart3, 
  Users, 
  DollarSign, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText
} from "lucide-react"

interface AnalyticsData {
  totalUsers: number
  totalJobs: number
  totalRevenue: number
  pendingDisputes: number
  completedJobs: number
  activeJobs: number
  monthlyRevenue: number
  topCategories: Array<{
    category: string
    count: number
    revenue: number
  }>
  recentActivity: Array<{
    id: string
    type: string
    description: string
    timestamp: string
    status: string
  }>
}

export default function AnalyticsPage() {
  const { data: session } = useSession()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("30d")

  useEffect(() => {
    if (session?.user.role === "ADMIN") {
      fetchAnalytics()
    }
  }, [session, timeRange])

  const fetchAnalytics = async () => {
    try {
      // Mock data - in real app, this would be an API call
      const mockAnalytics: AnalyticsData = {
        totalUsers: 1247,
        totalJobs: 3421,
        totalRevenue: 125430.50,
        pendingDisputes: 3,
        completedJobs: 2890,
        activeJobs: 531,
        monthlyRevenue: 45230.75,
        topCategories: [
          { category: "Landscaping", count: 892, revenue: 34200.00 },
          { category: "Cleaning", count: 756, revenue: 28900.00 },
          { category: "Maintenance", count: 634, revenue: 19800.00 },
          { category: "Repair", count: 523, revenue: 31200.00 },
          { category: "Construction", count: 345, revenue: 45600.00 }
        ],
        recentActivity: [
          {
            id: "1",
            type: "payment",
            description: "Payment completed for Lawn Mowing Service",
            timestamp: "2024-01-15T14:30:00Z",
            status: "success"
          },
          {
            id: "2",
            type: "dispute",
            description: "New dispute filed for House Cleaning job",
            timestamp: "2024-01-15T12:15:00Z",
            status: "pending"
          },
          {
            id: "3",
            type: "job",
            description: "New job posted: Gutter Cleaning",
            timestamp: "2024-01-15T10:45:00Z",
            status: "active"
          },
          {
            id: "4",
            type: "user",
            description: "New provider registered: Mike's Lawn Care",
            timestamp: "2024-01-15T09:20:00Z",
            status: "verified"
          }
        ]
      }
      
      setAnalytics(mockAnalytics)
    } catch (error) {
      console.error("Failed to fetch analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (session?.user.role !== "ADMIN") {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-600">You don't have permission to view this page.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Failed to load analytics data.</p>
      </div>
    )
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "payment":
        return <DollarSign className="h-4 w-4" />
      case "dispute":
        return <AlertTriangle className="h-4 w-4" />
      case "job":
        return <FileText className="h-4 w-4" />
      case "user":
        return <Users className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getActivityStatusBadge = (status: string) => {
    const statusConfig = {
      success: { color: "bg-green-100 text-green-800", label: "Success" },
      pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
      active: { color: "bg-blue-100 text-blue-800", label: "Active" },
      verified: { color: "bg-purple-100 text-purple-800", label: "Verified" }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Platform overview and key metrics</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalJobs.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.activeJobs} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analytics.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              ${analytics.monthlyRevenue.toLocaleString()} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Disputes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{analytics.pendingDisputes}</div>
            <p className="text-xs text-muted-foreground">
              Requires attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Top Service Categories</CardTitle>
          <CardDescription>Most popular categories by job count and revenue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.topCategories.map((category, index) => (
              <div key={category.category} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-indigo-600">{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-medium">{category.category}</h3>
                    <p className="text-sm text-gray-500">{category.count} jobs</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">${category.revenue.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Revenue</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest platform events and transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{activity.description}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div>
                  {getActivityStatusBadge(activity.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
