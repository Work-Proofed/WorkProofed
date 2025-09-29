"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  Upload, 
  Camera, 
  MapPin, 
  Clock,
  Eye,
  Download,
  Trash2,
  Plus
} from "lucide-react"
import { useDropzone } from "react-dropzone"

interface Photo {
  id: string
  jobId: string
  url: string
  type: "BEFORE" | "AFTER" | "PROGRESS"
  description?: string
  latitude?: number
  longitude?: number
  timestamp: string
  createdAt: string
}

interface Job {
  id: string
  title: string
  status: string
  client: {
    name: string
  }
}

export default function ProofOfWorkPage() {
  const { data: session } = useSession()
  const [jobs, setJobs] = useState<Job[]>([])
  const [selectedJob, setSelectedJob] = useState<string>("")
  const [photos, setPhotos] = useState<Photo[]>([])
  const [uploading, setUploading] = useState(false)
  const [newPhoto, setNewPhoto] = useState({
    type: "BEFORE" as "BEFORE" | "AFTER" | "PROGRESS",
    description: ""
  })

  useEffect(() => {
    fetchJobs()
  }, [])

  useEffect(() => {
    if (selectedJob) {
      fetchPhotos(selectedJob)
    }
  }, [selectedJob])

  const fetchJobs = async () => {
    try {
      // Mock data - in real app, this would be an API call
      const mockJobs: Job[] = [
        {
          id: "1",
          title: "Lawn Mowing Service",
          status: "IN_PROGRESS",
          client: { name: "John Smith" }
        },
        {
          id: "2",
          title: "House Cleaning",
          status: "COMPLETED",
          client: { name: "Sarah Johnson" }
        }
      ]
      setJobs(mockJobs)
    } catch (error) {
      console.error("Failed to fetch jobs:", error)
    }
  }

  const fetchPhotos = async (jobId: string) => {
    try {
      // Mock data - in real app, this would be an API call
      const mockPhotos: Photo[] = [
        {
          id: "1",
          jobId,
          url: "/api/placeholder/400/300",
          type: "BEFORE",
          description: "Before mowing",
          latitude: 40.7128,
          longitude: -74.0060,
          timestamp: "2024-01-15T10:00:00Z",
          createdAt: "2024-01-15T10:00:00Z"
        },
        {
          id: "2",
          jobId,
          url: "/api/placeholder/400/300",
          type: "AFTER",
          description: "After mowing",
          latitude: 40.7128,
          longitude: -74.0060,
          timestamp: "2024-01-15T12:00:00Z",
          createdAt: "2024-01-15T12:00:00Z"
        }
      ]
      setPhotos(mockPhotos)
    } catch (error) {
      console.error("Failed to fetch photos:", error)
    }
  }

  const onDrop = async (acceptedFiles: File[]) => {
    if (!selectedJob) return

    setUploading(true)
    try {
      for (const file of acceptedFiles) {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("jobId", selectedJob)
        formData.append("type", newPhoto.type)
        formData.append("description", newPhoto.description)

        // In real app, this would upload to S3 and save to database
        const response = await fetch("/api/photos/upload", {
          method: "POST",
          body: formData
        })

        if (response.ok) {
          const photo = await response.json()
          setPhotos([...photos, photo])
        }
      }
    } catch (error) {
      console.error("Failed to upload photos:", error)
    } finally {
      setUploading(false)
      setNewPhoto({ type: "BEFORE", description: "" })
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"]
    },
    multiple: true
  })

  const getPhotoTypeBadge = (type: string) => {
    const typeConfig = {
      BEFORE: { color: "bg-red-100 text-red-800", label: "Before" },
      AFTER: { color: "bg-green-100 text-green-800", label: "After" },
      PROGRESS: { color: "bg-blue-100 text-blue-800", label: "Progress" }
    }
    
    const config = typeConfig[type as keyof typeof typeConfig]
    
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    )
  }

  const generateProofReport = async () => {
    try {
      const response = await fetch(`/api/jobs/${selectedJob}/proof-report`, {
        method: "GET"
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `proof-report-${selectedJob}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error("Failed to generate proof report:", error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Proof of Work</h1>
        <p className="text-gray-600">Upload before/after photos to document your work</p>
      </div>

      {/* Job Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Job</CardTitle>
          <CardDescription>Choose a job to upload proof photos for</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedJob} onValueChange={setSelectedJob}>
            <SelectTrigger>
              <SelectValue placeholder="Select a job" />
            </SelectTrigger>
            <SelectContent>
              {jobs.map((job) => (
                <SelectItem key={job.id} value={job.id}>
                  {job.title} - {job.client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedJob && (
        <>
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Photos</CardTitle>
              <CardDescription>Add before, after, or progress photos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Photo Type</Label>
                  <Select 
                    value={newPhoto.type} 
                    onValueChange={(value: "BEFORE" | "AFTER" | "PROGRESS") => 
                      setNewPhoto({ ...newPhoto, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BEFORE">Before</SelectItem>
                      <SelectItem value="AFTER">After</SelectItem>
                      <SelectItem value="PROGRESS">Progress</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Description (Optional)</Label>
                  <Input
                    value={newPhoto.description}
                    onChange={(e) => setNewPhoto({ ...newPhoto, description: e.target.value })}
                    placeholder="Describe what's in the photo"
                  />
                </div>
              </div>

              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive 
                    ? "border-indigo-500 bg-indigo-50" 
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                {isDragActive ? (
                  <p className="text-indigo-600">Drop the photos here...</p>
                ) : (
                  <div>
                    <p className="text-gray-600 mb-2">
                      Drag & drop photos here, or click to select
                    </p>
                    <p className="text-sm text-gray-500">
                      Supports JPEG, PNG, WebP
                    </p>
                  </div>
                )}
              </div>

              {uploading && (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="text-sm text-gray-600 mt-2">Uploading photos...</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Photos Gallery */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Photo Gallery</CardTitle>
                  <CardDescription>All photos for this job</CardDescription>
                </div>
                <Button onClick={generateProofReport} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {photos.length === 0 ? (
                <div className="text-center py-8">
                  <Camera className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600">No photos uploaded yet</p>
                  <p className="text-sm text-gray-500">Upload your first photo above</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {photos.map((photo) => (
                    <div key={photo.id} className="space-y-3">
                      <div className="relative">
                        <img
                          src={photo.url}
                          alt={photo.description || "Work photo"}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <div className="absolute top-2 left-2">
                          {getPhotoTypeBadge(photo.type)}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {photo.description && (
                          <p className="text-sm text-gray-600">{photo.description}</p>
                        )}
                        
                        <div className="flex items-center text-xs text-gray-500 space-x-4">
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date(photo.timestamp).toLocaleString()}
                          </div>
                          {photo.latitude && photo.longitude && (
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              Location tagged
                            </div>
                          )}
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
