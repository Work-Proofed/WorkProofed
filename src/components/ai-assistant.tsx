"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  Sparkles, 
  Loader2, 
  Lightbulb, 
  FileText,
  DollarSign,
  CheckCircle
} from "lucide-react"

interface UpsellSuggestion {
  title: string
  description: string
  estimatedPrice: string
  reason: string
}

interface AIAssistantProps {
  jobTitle: string
  category: string
  description: string
  location: string
  onDescriptionGenerated: (description: string) => void
}

export default function AIAssistant({ 
  jobTitle, 
  category, 
  description, 
  location, 
  onDescriptionGenerated 
}: AIAssistantProps) {
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false)
  const [isGeneratingUpsells, setIsGeneratingUpsells] = useState(false)
  const [upsellSuggestions, setUpsellSuggestions] = useState<UpsellSuggestion[]>([])
  const [showUpsells, setShowUpsells] = useState(false)

  const generateDescription = async () => {
    if (!jobTitle || !category) return

    setIsGeneratingDescription(true)
    try {
      const response = await fetch("/api/ai/generate-description", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: jobTitle,
          category,
          location,
          budget: "", // Could be added to form
          estimatedDuration: "" // Could be added to form
        }),
      })

      if (response.ok) {
        const { description: generatedDescription } = await response.json()
        onDescriptionGenerated(generatedDescription)
      }
    } catch (error) {
      console.error("Failed to generate description:", error)
    } finally {
      setIsGeneratingDescription(false)
    }
  }

  const generateUpsellSuggestions = async () => {
    if (!jobTitle || !category) return

    setIsGeneratingUpsells(true)
    try {
      const response = await fetch("/api/ai/upsell-suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobTitle,
          category,
          description,
          location
        }),
      })

      if (response.ok) {
        const { suggestions } = await response.json()
        setUpsellSuggestions(suggestions)
        setShowUpsells(true)
      }
    } catch (error) {
      console.error("Failed to generate upsell suggestions:", error)
    } finally {
      setIsGeneratingUpsells(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* AI Description Generator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-indigo-600" />
            AI Job Description Assistant
          </CardTitle>
          <CardDescription>
            Let AI help you create a professional job description
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  Generate a professional description for: <strong>{jobTitle}</strong>
                </p>
                <p className="text-xs text-gray-500">Category: {category}</p>
              </div>
              <Button 
                onClick={generateDescription}
                disabled={isGeneratingDescription || !jobTitle || !category}
                size="sm"
              >
                {isGeneratingDescription ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Generate
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Upsell Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lightbulb className="h-5 w-5 mr-2 text-yellow-600" />
            Smart Upsell Suggestions
          </CardTitle>
          <CardDescription>
            Discover additional services you can offer to increase revenue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  Get AI-powered suggestions for complementary services
                </p>
                <p className="text-xs text-gray-500">
                  Based on: {jobTitle} ({category})
                </p>
              </div>
              <Button 
                onClick={generateUpsellSuggestions}
                disabled={isGeneratingUpsells || !jobTitle || !category}
                size="sm"
                variant="outline"
              >
                {isGeneratingUpsells ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Get Suggestions
                  </>
                )}
              </Button>
            </div>

            {showUpsells && upsellSuggestions.length > 0 && (
              <div className="space-y-3 pt-4 border-t">
                <h4 className="font-medium text-sm">Suggested Upsell Services:</h4>
                {upsellSuggestions.map((suggestion, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h5 className="font-medium text-sm">{suggestion.title}</h5>
                        <p className="text-xs text-gray-600 mt-1">
                          {suggestion.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          <strong>Why:</strong> {suggestion.reason}
                        </p>
                      </div>
                      <div className="ml-4 text-right">
                        <Badge variant="outline" className="text-xs">
                          <DollarSign className="h-3 w-3 mr-1" />
                          {suggestion.estimatedPrice}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex space-x-2 pt-2">
                      <Button size="sm" variant="outline" className="text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Add to Job
                      </Button>
                      <Button size="sm" variant="ghost" className="text-xs">
                        Learn More
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
