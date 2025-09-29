"use client"

import { useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface PaymentFormProps {
  invoiceId: string
  amount: number
  clientFee: number
  onSuccess: () => void
  onError: (error: string) => void
}

function PaymentFormComponent({ invoiceId, amount, clientFee, onSuccess, onError }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/dashboard/invoices`,
        },
      })

      if (error) {
        onError(error.message || "Payment failed")
      } else {
        onSuccess()
      }
    } catch (err) {
      onError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-center text-sm">
          <span>Job Amount:</span>
          <span>${amount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span>Client Fee (2.5%):</span>
          <span>${clientFee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center font-medium border-t pt-2 mt-2">
          <span>Total:</span>
          <span>${(amount + clientFee).toFixed(2)}</span>
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={!stripe || isLoading}
      >
        {isLoading ? "Processing..." : `Pay $${(amount + clientFee).toFixed(2)}`}
      </Button>
    </form>
  )
}

export default function PaymentForm(props: PaymentFormProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useState(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await fetch("/api/payments/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            invoiceId: props.invoiceId
          }),
        })

        if (response.ok) {
          const { clientSecret } = await response.json()
          setClientSecret(clientSecret)
        } else {
          setError("Failed to initialize payment")
        }
      } catch (err) {
        setError("An unexpected error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    createPaymentIntent()
  })

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-sm text-gray-600 mt-2">Loading payment form...</p>
        </CardContent>
      </Card>
    )
  }

  if (error || !clientSecret) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-red-600">{error || "Failed to load payment form"}</p>
        </CardContent>
      </Card>
    )
  }

  const options = {
    clientSecret,
    appearance: {
      theme: "stripe" as const,
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment</CardTitle>
        <CardDescription>
          Complete your payment to finalize the job
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Elements options={options} stripe={stripePromise}>
          <PaymentFormComponent {...props} />
        </Elements>
      </CardContent>
    </Card>
  )
}
