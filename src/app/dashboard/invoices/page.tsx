"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  CreditCard, 
  Download, 
  Eye, 
  Send,
  DollarSign,
  Calendar,
  User,
  FileText
} from "lucide-react"
import Link from "next/link"

interface Invoice {
  id: string
  jobId: string
  clientId: string
  providerId: string
  amount: number
  status: "PENDING" | "PAID" | "FAILED" | "REFUNDED"
  workProofedFee: number
  providerFee: number
  clientFee: number
  createdAt: string
  paidAt?: string
  job: {
    title: string
    description: string
  }
  client: {
    name: string
    email: string
  }
  provider: {
    name: string
    email: string
  }
}

export default function InvoicesPage() {
  const { data: session } = useSession()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")

  useEffect(() => {
    fetchInvoices()
  }, [])

  const fetchInvoices = async () => {
    try {
      // Mock data - in real app, this would be an API call
      const mockInvoices: Invoice[] = [
        {
          id: "1",
          jobId: "1",
          clientId: "client1",
          providerId: "provider1",
          amount: 150.00,
          status: "PENDING",
          workProofedFee: 3.75,
          providerFee: 3.75,
          clientFee: 3.75,
          createdAt: "2024-01-15T10:00:00Z",
          job: {
            title: "Lawn Mowing Service",
            description: "Weekly lawn mowing for residential property"
          },
          client: {
            name: "John Smith",
            email: "john@example.com"
          },
          provider: {
            name: "Mike Johnson",
            email: "mike@example.com"
          }
        },
        {
          id: "2",
          jobId: "2",
          clientId: "client2",
          providerId: "provider1",
          amount: 200.00,
          status: "PAID",
          workProofedFee: 5.00,
          providerFee: 5.00,
          clientFee: 5.00,
          createdAt: "2024-01-14T14:30:00Z",
          paidAt: "2024-01-14T16:45:00Z",
          job: {
            title: "House Cleaning",
            description: "Deep cleaning of 3-bedroom house"
          },
          client: {
            name: "Sarah Johnson",
            email: "sarah@example.com"
          },
          provider: {
            name: "Mike Johnson",
            email: "mike@example.com"
          }
        }
      ]
      
      setInvoices(mockInvoices)
    } catch (error) {
      console.error("Failed to fetch invoices:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.provider.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "ALL" || invoice.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
      PAID: { color: "bg-green-100 text-green-800", label: "Paid" },
      FAILED: { color: "bg-red-100 text-red-800", label: "Failed" },
      REFUNDED: { color: "bg-gray-100 text-gray-800", label: "Refunded" }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING
    
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    )
  }

  const handleSendInvoice = async (invoiceId: string) => {
    try {
      // In real app, this would send email notification
      console.log("Sending invoice:", invoiceId)
    } catch (error) {
      console.error("Failed to send invoice:", error)
    }
  }

  const handleDownloadInvoice = async (invoiceId: string) => {
    try {
      const response = await fetch(`/api/invoices/${invoiceId}/pdf`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `invoice-${invoiceId}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error("Failed to download invoice:", error)
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
        <p className="text-gray-600">Manage your invoices and payments</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{invoices.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {invoices.filter(i => i.status === "PENDING").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {invoices.filter(i => i.status === "PAID").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${invoices.reduce((sum, invoice) => sum + invoice.amount, 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
                <SelectItem value="REFUNDED">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Invoices List */}
      <div className="grid gap-6">
        {filteredInvoices.map((invoice) => (
          <Card key={invoice.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{invoice.job.title}</CardTitle>
                  <CardDescription className="mt-1">
                    {invoice.job.description}
                  </CardDescription>
                </div>
                {getStatusBadge(invoice.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <User className="h-4 w-4 mr-2" />
                  {session?.user.role === "PROVIDER" ? invoice.client.name : invoice.provider.name}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(invoice.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="h-4 w-4 mr-2" />
                  ${invoice.amount.toFixed(2)}
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Job Amount</p>
                    <p className="font-medium">${invoice.amount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">WorkProofed Fee</p>
                    <p className="font-medium">${invoice.workProofedFee.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Provider Fee</p>
                    <p className="font-medium">${invoice.providerFee.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Client Fee</p>
                    <p className="font-medium">${invoice.clientFee.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {invoice.status === "PAID" && invoice.paidAt && (
                    <span>Paid on {new Date(invoice.paidAt).toLocaleDateString()}</span>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDownloadInvoice(invoice.id)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                  
                  {invoice.status === "PENDING" && (
                    <Button 
                      size="sm"
                      onClick={() => handleSendInvoice(invoice.id)}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                  )}
                  
                  <Link href={`/dashboard/invoices/${invoice.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredInvoices.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-500">No invoices found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
