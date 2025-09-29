import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { stripe, formatAmountForStripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { invoiceId } = await request.json()

    if (!invoiceId) {
      return NextResponse.json(
        { error: "Missing invoice ID" },
        { status: 400 }
      )
    }

    // Get invoice details
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        job: true,
        client: true,
        provider: true
      }
    })

    if (!invoice) {
      return NextResponse.json(
        { error: "Invoice not found" },
        { status: 404 }
      )
    }

    // Verify user has access to this invoice
    if (invoice.clientId !== session.user.id && invoice.providerId !== session.user.id) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      )
    }

    // Calculate total amount (job amount + client fee)
    const totalAmount = invoice.amount + invoice.clientFee

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: formatAmountForStripe(totalAmount),
      currency: "usd",
      metadata: {
        invoiceId: invoice.id,
        jobId: invoice.jobId,
        clientId: invoice.clientId,
        providerId: invoice.providerId,
        workProofedFee: invoice.workProofedFee.toString(),
        providerFee: invoice.providerFee.toString(),
        clientFee: invoice.clientFee.toString()
      },
      description: `Payment for ${invoice.job.title}`,
      automatic_payment_methods: {
        enabled: true,
      },
    })

    // Update invoice with payment intent ID
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        stripePaymentIntentId: paymentIntent.id
      }
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    })
  } catch (error) {
    console.error("Failed to create payment intent:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
