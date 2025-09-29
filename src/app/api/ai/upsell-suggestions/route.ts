import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { jobTitle, category, description, location } = await request.json()

    if (!jobTitle || !category) {
      return NextResponse.json(
        { error: "Job title and category are required" },
        { status: 400 }
      )
    }

    const prompt = `Based on the following job details, suggest 3-5 relevant upsell services that a service provider could offer to the client.

Job Details:
- Title: ${jobTitle}
- Category: ${category}
- Description: ${description || "Not provided"}
- Location: ${location || "Not specified"}

Requirements:
1. Suggest services that are complementary to the main job
2. Consider the category and typical service bundles
3. Make suggestions practical and valuable to the client
4. Include estimated pricing ranges where appropriate
5. Focus on services that can be done at the same time or location
6. Consider seasonal or maintenance-related services

Format the response as a JSON array of objects with the following structure:
[
  {
    "title": "Service name",
    "description": "Brief description of the service",
    "estimatedPrice": "Price range or estimate",
    "reason": "Why this is a good upsell for this job"
  }
]

Generate only the JSON array, no additional text.`

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a business consultant specializing in service business upselling. Provide practical, valuable upsell suggestions that help service providers increase their revenue while providing real value to clients."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    })

    const response = completion.choices[0]?.message?.content?.trim()

    if (!response) {
      return NextResponse.json(
        { error: "Failed to generate upsell suggestions" },
        { status: 500 }
      )
    }

    try {
      const suggestions = JSON.parse(response)
      return NextResponse.json({ suggestions })
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError)
      return NextResponse.json(
        { error: "Failed to parse suggestions" },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Failed to generate upsell suggestions:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
