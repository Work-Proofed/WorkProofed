"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, 
  Search, 
  Filter,
  MapPin,
  Calendar,
  DollarSign,
  Eye,
  Edit,
  Trash2
} from "lucide-react"
import Link from "next/link"

interface Job {
  id: string
  title: string
  description: string
  status: string
  category: string
  location: string
  budget: number
  clientId: string
  providerId?: string
  createdAt: string
  updatedAt: string
  client: {
    name: string
    email: string
  }
}

export default function JobsPage() {
  const { data: session } = useSession()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      // Mock data - in real app, this would be an API call
      const mockJobs: Job[] = [
        {
          id: "1",
          title: "Lawn Mowing Service",
          description: "Weekly lawn mowing for residential property",
          status: "OPEN",
          category: "Landscaping",
          location: "123 Main St, Anytown, ST 12345",
          budget: 150.00,
          clientId: "client1",
          createdAt: "2024-01-15T10:00:00Z",
          updatedAt: "2024-01-15T10:00:00Z",
          client: {
            name: "John Smith",
            email: "john@example.com"
          }
        },
        {
          id: "2",
          title: "House Cleaning",
          description: "Deep cleaning of 3-bedroom house",
          status: "IN_PROGRESS",
          category: "Cleaning",
          location: "456 Oak Ave, Anytown, ST 12345",
          budget: 200.00,
          clientId: "client2",
          providerId: session?.user.id,
          createdAt: "2024-01-14T14:30:00Z",
          updatedAt: "2024-01-14T14:30:00Z",
          client: {
            name: "Sarah Johnson",
            email: "sarah@example.com"
          }
        },
        {
          id: "3",
          title: "Gutter Cleaning",
          description: "Clean gutters and downspouts",
          status: "COMPLETED",
          category: "Maintenance",
          location: "789 Pine St, Anytown, ST 12345",
          budget: 120.00,
          clientId: "client3",
          providerId: session?.user.id,
          createdAt: "2024-01-13T09:15:00Z",
          updatedAt: "2024-01-13T09:15:00Z",
          client: {
            name: "Mike Davis",
            email: "mike@example.com"
          }
        }
      ]
      
      setJobs(mockJobs)
    } catch (error) {
      console.error("Failed to fetch jobs:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "ALL" || job.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      OPEN: { color: "bg-blue-100 text-blue-800", label: "Open" },
      ACCEPTED: { color: "bg-yellow-100 text-yellow-800", label: "Accepted" },
      IN_PROGRESS: { color: "bg-orange-100 text-orange-800", label: "In Progress" },
      COMPLETED: { color: "bg-green-100 text-green-800", label: "Completed" },
      PAID: { color: "bg-purple-100 text-purple-800", label: "Paid" },
      CANCELLED: { color: "bg-red-100 text-red-800", label: "Cancelled" }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.OPEN
    
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    )
  }

  const handleAcceptJob = async (jobId: string) => {
    try {
      // In real app, this would be an API call
      setJobs(jobs.map(job => 
        job.id === jobId 
          ? { ...job, status: "ACCEPTED", providerId: session?.user.id }
          : job
      ))
    } catch (error) {
      console.error("Failed to accept job:", error)
    }
  }

  const handleCompleteJob = async (jobId: string) => {
    try {
      // In real app, this would be an API call
      setJobs(jobs.map(job => 
        job.id === jobId 
          ? { ...job, status: "COMPLETED" }
          : job
      ))
    } catch (error) {
      console.error("Failed to complete job:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
          <p className="text-gray-600">Manage your job listings and requests</p>
        </div>
        <Link href="/dashboard/jobs/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Job
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="OPEN">Open</SelectItem>
                <SelectItem value="ACCEPTED">Accepted</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Jobs List */}
      <div className="grid gap-6">
        {filteredJobs.map((job) => (
          <Card key={job.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{job.title}</CardTitle>
                  <CardDescription className="mt-1">
                    {job.description}
                  </CardDescription>
                </div>
                {getStatusBadge(job.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {job.location}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(job.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="h-4 w-4 mr-2" />
                  ${job.budget.toFixed(2)}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Client: {job.client.name} ({job.client.email})
                </div>
                
                <div className="flex space-x-2">
                  <Link href={`/dashboard/jobs/${job.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </Link>
                  
                  {job.status === "OPEN" && (
                    <Button 
                      size="sm" 
                      onClick={() => handleAcceptJob(job.id)}
                    >
                      Accept
                    </Button>
                  )}
                  
                  {job.status === "ACCEPTED" && (
                    <Button 
                      size="sm" 
                      onClick={() => handleCompleteJob(job.id)}
                    >
                      Complete
                    </Button>
                  )}
                  
                  {job.status === "COMPLETED" && (
                    <Button 
                      size="sm" 
                      onClick={() => {/* Handle payment */}}
                    >
                      Request Payment
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-500">No jobs found matching your criteria.</p>
            <Link href="/dashboard/jobs/new" className="mt-4 inline-block">
              <Button>Create your first job</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
