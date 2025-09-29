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

    const { title, category, location, budget, estimatedDuration } = await request.json()

    if (!title || !category) {
      return NextResponse.json(
        { error: "Title and category are required" },
        { status: 400 }
      )
    }

    const prompt = `Generate a professional job description for a service business job posting. 

Job Details:
- Title: ${title}
- Category: ${category}
- Location: ${location || "Not specified"}
- Budget: ${budget ? `$${budget}` : "Not specified"}
- Duration: ${estimatedDuration || "Not specified"}

Requirements:
1. Write a clear, professional description that explains what needs to be done
2. Include specific details about the work required
3. Mention any special requirements or considerations
4. Keep it concise but informative (2-3 paragraphs)
5. Use professional language suitable for service businesses
6. Include relevant keywords for the category

Generate only the job description text, no additional formatting or explanations.`

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional job description writer specializing in service business postings. Create clear, detailed, and professional descriptions that help both clients and service providers understand the work required."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 300,
      temperature: 0.7,
    })

    const description = completion.choices[0]?.message?.content?.trim()

    if (!description) {
      return NextResponse.json(
        { error: "Failed to generate description" },
        { status: 500 }
      )
    }

    return NextResponse.json({ description })
  } catch (error) {
    console.error("Failed to generate AI description:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
