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

    // For now, we'll store files in the public/uploads directory
    // In production, you'd use Vercel Blob, S3, or similar
    const fileName = `${Date.now()}-${file.name}`
    const fileUrl = `/uploads/${fileName}`
    
    // Create uploads directory if it doesn't exist
    const fs = require('fs')
    const path = require('path')
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
    }
    
    // Save file to public/uploads
    const filePath = path.join(uploadsDir, fileName)
    const buffer = Buffer.from(await file.arrayBuffer())
    fs.writeFileSync(filePath, buffer)
    
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
