import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { question, userAnswer, correctAnswer, questionType } = await request.json()
    
    if (!question || !userAnswer || !correctAnswer || !questionType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const apiKey = process.env.OPENROUTER_API_KEY
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenRouter API key not configured' },
        { status: 500 }
      )
    }

    // For structured questions, use simple comparison
    if (questionType === 'multiple-choice' || questionType === 'true-false') {
      const isCorrect = userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim()
      return NextResponse.json({
        isCorrect,
        feedback: isCorrect ? 'Correct!' : `Incorrect. The correct answer is: ${correctAnswer}`,
        score: isCorrect ? 1 : 0
      })
    }

    // For open-ended questions, use AI to evaluate
    const prompt = `You are an expert educator evaluating a student's answer.

**Question:** ${question}

**Student's Answer:** ${userAnswer}

**Expected Answer/Key Points:** ${correctAnswer}

Please evaluate the student's answer and provide:
1. A score from 0-5 (where 5 is perfect)
2. Brief feedback explaining what they did well and what could be improved
3. Whether the answer is essentially correct (true/false)

Respond in JSON format:
{
  "score": number,
  "feedback": string,
  "isCorrect": boolean
}

Be encouraging but accurate in your assessment.`

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://revision-app.local',
        'X-Title': 'Revision App',
      },
      body: JSON.stringify({
        model: 'tngtech/deepseek-r1t-chimera:free',
        messages: [
          {
            role: 'system',
            content: 'You are an expert educator. Respond only with valid JSON.',
          },
          { role: 'user', content: prompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
        max_tokens: 500,
      }),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: 'OpenRouter API request failed', details: errorData },
        { status: response.status }
      )
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      return NextResponse.json(
        { error: 'No content received from OpenRouter' },
        { status: 500 }
      )
    }

    try {
      const evaluation = JSON.parse(content)
      return NextResponse.json(evaluation)
    } catch (parseError) {
      // Fallback if JSON parsing fails
      return NextResponse.json({
        score: 2,
        feedback: 'Unable to evaluate answer automatically. Please review manually.',
        isCorrect: false
      })
    }

  } catch (error) {
    console.error('Error in check-answer API:', error)
    
    // Handle timeout specifically
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Request timeout - please try again' },
        { status: 408 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
