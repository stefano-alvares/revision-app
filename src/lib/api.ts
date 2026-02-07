interface QuizDetails {
  board: string
  level: string
  subject: string
  topic: string
  subtopic?: string
  questions: string
}

interface GeneratedQuestion {
  id: string
  type: 'multiple-choice' | 'short-answer' | 'essay' | 'true-false' | 'fill-blank'
  question: string
  options?: string[]
  correctAnswer: string | string[]
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
  topicId: string
  marks: number
  tags: string[]
}

interface QuizResponseJson {
  questions: Array<{
    id?: string
    type: GeneratedQuestion['type']
    question: string
    options?: string[]
    correctAnswer: string | string[]
    explanation: string
    difficulty: GeneratedQuestion['difficulty']
    marks?: number
    tags?: string[]
  }>
}

export async function generateQuestions(details: QuizDetails): Promise<GeneratedQuestion[]> {
  const focusLine = details.subtopic
    ? `with a specific focus on ${details.subtopic}`
    : `with a specific focus on the most important concepts within ${details.topic}`

  const prompt = `You MUST output ONLY valid JSON.

Return a single JSON object with this exact shape:
{
  "questions": [
    {
      "type": "multiple-choice" | "short-answer" | "essay" | "true-false" | "fill-blank",
      "question": string,
      "options"?: string[],
      "correctAnswer": string | string[],
      "explanation": string,
      "difficulty": "easy" | "medium" | "hard",
      "marks"?: number,
      "tags"?: string[]
    }
  ]
}

Rules:
- JSON only. No markdown. No code fences. No extra keys.
- If type is "multiple-choice", include "options" with 3-5 options.
- If type is not "multiple-choice", omit "options".
- Explanations must be concise (1-3 sentences).

Objective: Develop an engaging and educational quiz for students. The quiz should align with the ${details.board} curriculum and be tailored for ${details.level} students studying ${details.subject} — ${details.topic}, ${focusLine}.
  
1. **Difficulty Levels:** Cover a range of difficulty levels (easy, medium, hard) to appropriately challenge students.
2. **Application-Based Questions:** Include questions that go beyond factual recall, requiring students to apply their knowledge to solve problems.
3. **Real-World Scenarios:** Incorporate real-world examples or scenarios that demonstrate the practical relevance of the topic.
4. **Varied Question Formats:** Use a mix of question formats (e.g., multiple-choice, short answer, true/false, essay, fill-in-the-blank) to maintain student engagement and interest.
5. **Explanatory Feedback:** Provide concise yet informative explanations for each answer, emphasizing key concepts and helping students learn from their mistakes.
6. **Cross-Topic Integration:** Include at least one question that connects this topic to another related area within ${details.subject}, helping students see the bigger picture.
7. **Question Count:** Generate ${details.questions} questions.

Target Audience: Ensure the language, context, and complexity are appropriate for ${details.level} students.`

  try {
    const response = await fetch('/api/generate-questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    })

    if (!response.ok) {
      throw new Error('Failed to generate questions')
    }

    const data = await response.json()

    const content = data.content as string
    const fromJson = tryParseQuestionsJson(content, details.topic)
    if (fromJson.length > 0) return fromJson

    return parseGeneratedQuestions(content)
  } catch (error) {
    console.error('Error generating questions:', error)
    throw error
  }
}

function tryParseQuestionsJson(content: string, topic: string): GeneratedQuestion[] {
  try {
    const parsed = JSON.parse(content) as QuizResponseJson
    if (!parsed || !Array.isArray(parsed.questions)) return []

    return parsed.questions
      .filter((q) => q && typeof q.question === 'string' && typeof q.type === 'string')
      .map((q, idx) => {
        const marks =
          typeof q.marks === 'number'
            ? q.marks
            : q.type === 'essay'
              ? 5
              : q.type === 'short-answer'
                ? 2
                : 1

        return {
          id: q.id || (idx + 1).toString(),
          type: q.type,
          question: q.question,
          options: q.type === 'multiple-choice' ? q.options : undefined,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          difficulty: q.difficulty,
          topicId: 'generated',
          marks,
          tags: q.tags || [topic],
        }
      })
  } catch {
    return []
  }
}

function parseGeneratedQuestions(content: string): GeneratedQuestion[] {
  const questions: GeneratedQuestion[] = []
  const lines = content.split('\n')
  
  let currentQuestion: Partial<GeneratedQuestion> = {}
  let questionNumber = 0
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    
    if (line.startsWith('Q-')) {
      if (currentQuestion.question) {
        questions.push(createQuestionFromParsed(currentQuestion, questionNumber))
      }
      
      questionNumber++
      const questionText = line.replace(/^Q-\[\d+\]:\s*/, '')
      currentQuestion = {
        id: questionNumber.toString(),
        question: questionText,
        topicId: 'generated',
        tags: []
      }
    } else if (line.startsWith('A-') && currentQuestion.question) {
      const answerText = line.replace(/^A-\[\d+\]:\s*/, '')
      
      if (answerText.toLowerCase().includes('true') || answerText.toLowerCase().includes('false')) {
        currentQuestion.type = 'true-false'
        currentQuestion.correctAnswer = answerText.toLowerCase().includes('true') ? 'true' : 'false'
      } else if (answerText.includes(':') && answerText.split(':').length > 1) {
        currentQuestion.type = 'multiple-choice'
        const parts = answerText.split(':')
        currentQuestion.correctAnswer = parts[0].trim()
        currentQuestion.options = parts.map(part => part.trim())
      } else if (answerText.length > 100) {
        currentQuestion.type = 'essay'
        currentQuestion.correctAnswer = answerText
      } else {
        currentQuestion.type = 'short-answer'
        currentQuestion.correctAnswer = answerText
      }
      
      currentQuestion.explanation = extractExplanation(lines, i + 1)
      currentQuestion.difficulty = determineDifficulty(currentQuestion.question || '')
      currentQuestion.marks = currentQuestion.type === 'essay' ? 5 : currentQuestion.type === 'short-answer' ? 2 : 1
    }
  }
  
  if (currentQuestion.question) {
    questions.push(createQuestionFromParsed(currentQuestion, questionNumber))
  }
  
  return questions
}

function createQuestionFromParsed(parsed: Partial<GeneratedQuestion>, id: number): GeneratedQuestion {
  return {
    id: parsed.id || id.toString(),
    type: parsed.type || 'short-answer',
    question: parsed.question || '',
    options: parsed.options,
    correctAnswer: parsed.correctAnswer || '',
    explanation: parsed.explanation || '',
    difficulty: parsed.difficulty || 'medium',
    topicId: parsed.topicId || 'generated',
    marks: parsed.marks || 1,
    tags: parsed.tags || []
  }
}

function extractExplanation(lines: string[], startIndex: number): string {
  const explanationLines: string[] = []
  
  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim()
    if (line.startsWith('Q-') || line.startsWith('A-')) {
      break
    }
    if (line) {
      explanationLines.push(line)
    }
  }
  
  return explanationLines.join(' ').substring(0, 200)
}

export async function checkAnswer(
  question: string,
  userAnswer: string,
  correctAnswer: string,
  questionType: string
): Promise<{ isCorrect: boolean; feedback: string; score: number }> {
  try {
    const response = await fetch('/api/check-answer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question,
        userAnswer,
        correctAnswer,
        questionType,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to check answer')
    }

    return await response.json()
  } catch (error) {
    console.error('Error checking answer:', error)
    // Fallback for simple comparison
    const isCorrect = userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim()
    return {
      isCorrect,
      feedback: isCorrect ? 'Correct!' : `Incorrect. The correct answer is: ${correctAnswer}`,
      score: isCorrect ? 1 : 0
    }
  }
}

function determineDifficulty(question: string): 'easy' | 'medium' | 'hard' {
  const lowerQuestion = question.toLowerCase()
  
  if (lowerQuestion.includes('basic') || lowerQuestion.includes('simple') || lowerQuestion.includes('what is')) {
    return 'easy'
  } else if (lowerQuestion.includes('complex') || lowerQuestion.includes('analyze') || lowerQuestion.includes('evaluate')) {
    return 'hard'
  }
  
  return 'medium'
}
