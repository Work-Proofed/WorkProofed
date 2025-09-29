import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { calculateFees } from "@/lib/utils"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    const where: any = {}
    
    if (status && status !== "ALL") {
      where.status = status
    }

    // Filter by user role
    if (session.user.role === "PROVIDER") {
      where.providerId = session.user.id
    } else if (session.user.role === "CLIENT") {
      where.clientId = session.user.id
    }

    const invoices = await prisma.invoice.findMany({
      where,
      include: {
        job: {
          select: {
            title: true,
            description: true
          }
        },
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

    return NextResponse.json({ invoices })
  } catch (error) {
    console.error("Failed to fetch invoices:", error)
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

    const { jobId, amount } = await request.json()

    if (!jobId || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Get job details
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        client: true,
        provider: true
      }
    })

    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      )
    }

    // Verify user has access to create invoice for this job
    if (job.providerId !== session.user.id && job.clientId !== session.user.id) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      )
    }

    // Calculate fees
    const fees = calculateFees(amount)

    // Create invoice
    const invoice = await prisma.invoice.create({
      data: {
        jobId,
        clientId: job.clientId,
        providerId: job.providerId!,
        amount: parseFloat(amount),
        workProofedFee: fees.workProofedFee,
        providerFee: fees.providerFee,
        clientFee: fees.clientFee,
        status: "PENDING"
      },
      include: {
        job: {
          select: {
            title: true,
            description: true
          }
        },
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
      }
    })

    return NextResponse.json({ invoice }, { status: 201 })
  } catch (error) {
    console.error("Failed to create invoice:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
