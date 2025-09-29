import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import { formatAmountFromStripe } from "@/lib/stripe"

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")!

  let event: any

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentSucceeded(event.data.object)
        break
      case "payment_intent.payment_failed":
        await handlePaymentFailed(event.data.object)
        break
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook handler error:", error)
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    )
  }
}

async function handlePaymentSucceeded(paymentIntent: any) {
  const { invoiceId, jobId, clientId, providerId, workProofedFee, providerFee, clientFee } = paymentIntent.metadata

  // Update invoice status
  await prisma.invoice.update({
    where: { id: invoiceId },
    data: {
      status: "PAID",
      paidAt: new Date()
    }
  })

  // Update job status
  await prisma.job.update({
    where: { id: jobId },
    data: {
      status: "PAID"
    }
  })

  // Create payout record for provider
  const providerPayout = formatAmountFromStripe(paymentIntent.amount) - parseFloat(workProofedFee) - parseFloat(providerFee)
  
  // In a real app, you would:
  // 1. Create a payout to the provider's Stripe account
  // 2. Record the payout in your database
  // 3. Send confirmation emails to both parties
  
  console.log(`Payment succeeded for invoice ${invoiceId}. Provider payout: $${providerPayout.toFixed(2)}`)
}

async function handlePaymentFailed(paymentIntent: any) {
  const { invoiceId } = paymentIntent.metadata

  // Update invoice status
  await prisma.invoice.update({
    where: { id: invoiceId },
    data: {
      status: "FAILED"
    }
  })

  console.log(`Payment failed for invoice ${invoiceId}`)
}
