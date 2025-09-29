import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const jobId = formData.get("jobId") as string
    const type = formData.get("type") as "BEFORE" | "AFTER" | "PROGRESS"
    const description = formData.get("description") as string

    if (!file || !jobId || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Verify user has access to this job
    const job = await prisma.job.findFirst({
      where: {
        id: jobId,
        OR: [
          { clientId: session.user.id },
          { providerId: session.user.id }
        ]
      }
    })

    if (!job) {
      return NextResponse.json(
        { error: "Job not found or access denied" },
        { status: 404 }
      )
    }

    // In a real app, you would:
    // 1. Upload file to S3/CloudStorage
    // 2. Get the file URL
    // 3. Save photo record to database
    
    // For now, we'll simulate the upload
    const fileUrl = `/uploads/${Date.now()}-${file.name}`
    
    // Get geolocation if available (in real app, this would come from the client)
    const latitude = 40.7128 // Mock coordinates
    const longitude = -74.0060

    const photo = await prisma.photo.create({
      data: {
        jobId,
        url: fileUrl,
        type,
        description: description || null,
        latitude,
        longitude,
        timestamp: new Date()
      }
    })

    return NextResponse.json({ photo }, { status: 201 })
  } catch (error) {
    console.error("Failed to upload photo:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
