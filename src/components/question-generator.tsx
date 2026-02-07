"use client"

import { useState } from "react"
import { 
  Brain, 
  Play, 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  Clock,
  Target,
  Lightbulb,
  FileText
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Question } from "@/types"

const mockQuestions: Question[] = [
  {
    id: "1",
    type: "multiple-choice",
    question: "What is the derivative of x² + 3x - 5?",
    options: ["2x + 3", "x + 3", "2x - 5", "x² + 3"],
    correctAnswer: "2x + 3",
    explanation: "Using the power rule, the derivative of x² is 2x, the derivative of 3x is 3, and the derivative of -5 is 0.",
    difficulty: "medium",
    topicId: "1",
    marks: 2,
    tags: ["calculus", "derivatives"]
  },
  {
    id: "2",
    type: "short-answer",
    question: "Solve for x: 2x + 7 = 15",
    correctAnswer: "4",
    explanation: "Subtract 7 from both sides: 2x = 8. Then divide by 2: x = 4.",
    difficulty: "easy",
    topicId: "1",
    marks: 1,
    tags: ["algebra", "linear-equations"]
  },
  {
    id: "3",
    type: "true-false",
    question: "The square root of 16 is 4.",
    correctAnswer: "true",
    explanation: "4 × 4 = 16, so the square root of 16 is indeed 4.",
    difficulty: "easy",
    topicId: "2",
    marks: 1,
    tags: ["square-roots", "basic-math"]
  }
]

const questionTypes = [
  { value: "multiple-choice", label: "Multiple Choice" },
  { value: "short-answer", label: "Short Answer" },
  { value: "essay", label: "Essay" },
  { value: "true-false", label: "True/False" },
  { value: "fill-blank", label: "Fill in the Blank" }
]

const difficulties = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" }
]

export default function QuestionGenerator() {
  const [selectedTopic, setSelectedTopic] = useState<string>("")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("medium")
  const [selectedType, setSelectedType] = useState<string>("multiple-choice")
  const [questionCount, setQuestionCount] = useState<number>(5)
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0)
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({})
  const [showResults, setShowResults] = useState<boolean>(false)
  const [sessionStarted, setSessionStarted] = useState<boolean>(false)

  const generateQuestions = () => {
    const filtered = mockQuestions.filter(q => 
      (selectedDifficulty === "mixed" || q.difficulty === selectedDifficulty) &&
      (selectedType === "mixed" || q.type === selectedType)
    )
    
    const selected = filtered.slice(0, questionCount)
    setGeneratedQuestions(selected)
    setCurrentQuestionIndex(0)
    setUserAnswers({})
    setShowResults(false)
    setSessionStarted(true)
  }

  const handleAnswer = (answer: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [generatedQuestions[currentQuestionIndex].id]: answer
    }))
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < generatedQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      setShowResults(true)
    }
  }

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const resetSession = () => {
    setSessionStarted(false)
    setGeneratedQuestions([])
    setCurrentQuestionIndex(0)
    setUserAnswers({})
    setShowResults(false)
  }

  const calculateScore = () => {
    let correct = 0
    generatedQuestions.forEach(question => {
      const userAnswer = userAnswers[question.id]
      if (Array.isArray(question.correctAnswer)) {
        if (question.correctAnswer.includes(userAnswer)) correct++
      } else {
        if (userAnswer === question.correctAnswer) correct++
      }
    })
    return {
      correct,
      total: generatedQuestions.length,
      percentage: Math.round((correct / generatedQuestions.length) * 100)
    }
  }

  const currentQuestion = generatedQuestions[currentQuestionIndex]

  if (!sessionStarted) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Question Generator</h1>
          <p className="text-muted-foreground mt-1">
            Generate personalized practice questions based on your syllabus
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5" />
              <span>Generate Questions</span>
            </CardTitle>
            <CardDescription>
              Customize your practice session settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Topic</Label>
                <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select topic" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="algebra">Algebra</SelectItem>
                    <SelectItem value="geometry">Geometry</SelectItem>
                    <SelectItem value="calculus">Calculus</SelectItem>
                    <SelectItem value="statistics">Statistics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Difficulty</Label>
                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties.map((difficulty) => (
                      <SelectItem key={difficulty.value} value={difficulty.value}>
                        {difficulty.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Question Type</Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {questionTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Number of Questions</Label>
                <Select value={questionCount.toString()} onValueChange={(value) => setQuestionCount(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 Questions</SelectItem>
                    <SelectItem value="5">5 Questions</SelectItem>
                    <SelectItem value="10">10 Questions</SelectItem>
                    <SelectItem value="15">15 Questions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={generateQuestions} className="w-full">
              <Brain className="h-4 w-4 mr-2" />
              Generate Questions
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (showResults) {
    const score = calculateScore()
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">Session Complete!</h1>
          <p className="text-muted-foreground mt-1">
            Here's how you performed
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Your Score: {score.percentage}%</span>
            </CardTitle>
            <CardDescription className="text-center">
              You got {score.correct} out of {score.total} questions correct
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {generatedQuestions.map((question, index) => {
                const userAnswer = userAnswers[question.id]
                const isCorrect = Array.isArray(question.correctAnswer) 
                  ? question.correctAnswer.includes(userAnswer)
                  : userAnswer === question.correctAnswer

                return (
                  <div key={question.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      {isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600 mt-1" />
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">
                          Question {index + 1}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {question.question}
                        </p>
                        <div className="mt-2 space-y-1">
                          <p className="text-sm">
                            <span className="font-medium">Your answer:</span> {userAnswer || "Not answered"}
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">Correct answer:</span> {Array.isArray(question.correctAnswer) ? question.correctAnswer.join(", ") : question.correctAnswer}
                          </p>
                          <div className="flex items-start space-x-2 mt-2">
                            <Lightbulb className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <p className="text-sm text-muted-foreground">
                              {question.explanation}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="flex space-x-4 mt-6">
              <Button onClick={resetSession} variant="outline" className="flex-1">
                <RotateCcw className="h-4 w-4 mr-2" />
                New Session
              </Button>
              <Button onClick={() => setShowResults(false)} className="flex-1">
                <FileText className="h-4 w-4 mr-2" />
                Review Answers
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Practice Session</h1>
          <p className="text-muted-foreground mt-1">
            Question {currentQuestionIndex + 1} of {generatedQuestions.length}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">00:00</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span className="capitalize">{currentQuestion.type.replace('-', ' ')}</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded capitalize">
                {currentQuestion.difficulty}
              </span>
              <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded">
                {currentQuestion.marks} marks
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-foreground mb-4">
              {currentQuestion.question}
            </h3>

            {currentQuestion.type === "multiple-choice" && currentQuestion.options && (
              <RadioGroup 
                value={userAnswers[currentQuestion.id] || ""} 
                onValueChange={handleAnswer}
              >
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {currentQuestion.type === "short-answer" && (
              <Textarea
                placeholder="Type your answer here..."
                value={userAnswers[currentQuestion.id] || ""}
                onChange={(e) => handleAnswer(e.target.value)}
                className="min-h-[100px]"
              />
            )}

            {currentQuestion.type === "true-false" && (
              <RadioGroup 
                value={userAnswers[currentQuestion.id] || ""} 
                onValueChange={handleAnswer}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="true" />
                  <Label htmlFor="true" className="cursor-pointer">True</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="false" />
                  <Label htmlFor="false" className="cursor-pointer">False</Label>
                </div>
              </RadioGroup>
            )}
          </div>

          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={previousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>
            <Button onClick={nextQuestion}>
              {currentQuestionIndex === generatedQuestions.length - 1 ? "Finish" : "Next"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
