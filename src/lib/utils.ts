import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function calculateFees(amount: number) {
  const workProofedFee = amount * 0.025 // 2.5%
  const providerFee = amount * 0.025 // 2.5%
  const clientFee = amount * 0.025 // 2.5%
  const totalFees = workProofedFee + providerFee + clientFee
  
  return {
    workProofedFee,
    providerFee,
    clientFee,
    totalFees,
    netAmount: amount - totalFees
  }
}
