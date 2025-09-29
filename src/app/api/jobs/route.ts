import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const category = searchParams.get("category")

    const where: any = {}
    
    if (status && status !== "ALL") {
      where.status = status
    }
    
    if (category) {
      where.category = category
    }

    // If user is a provider, show jobs they can accept
    // If user is a client, show their own jobs
    if (session.user.role === "PROVIDER") {
      where.OR = [
        { status: "OPEN" },
        { providerId: session.user.id }
      ]
    } else if (session.user.role === "CLIENT") {
      where.clientId = session.user.id
    }

    const jobs = await prisma.job.findMany({
      where,
      include: {
        client: {
          select: {
            name: true,
            email: true
          }
        },
        provider: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return NextResponse.json({ jobs })
  } catch (error) {
    console.error("Failed to fetch jobs:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, description, category, location, budget, clientId } = await request.json()

    // Validate input
    if (!title || !description || !category || !location || !budget || !clientId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Create job
    const job = await prisma.job.create({
      data: {
        title,
        description,
        category,
        location,
        budget: parseFloat(budget),
        clientId,
        status: "OPEN"
      },
      include: {
        client: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({ job }, { status: 201 })
  } catch (error) {
    console.error("Failed to create job:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
