"use client"

import { useState } from "react"
import { 
  Brain, 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  Clock,
  Target,
  Lightbulb,
  FileText,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { generateQuestions, checkAnswer } from "@/lib/api"
import { Question } from "@/types"

const educationBoards = [
  "Cambridge IGCSE",
  "Edexcel",
  "AQA",
  "OCR",
  "International Baccalaureate (IB)",
  "AP (Advanced Placement)",
  "General Curriculum"
]

const subjects = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "History",
  "Geography",
  "English Literature",
  "Computer Science",
  "Economics",
  "Psychology"
]

const topics: Record<string, string[]> = {
  "Mathematics": ["Algebra", "Geometry", "Calculus", "Statistics", "Trigonometry"],
  "Physics": ["Mechanics", "Electricity", "Waves", "Thermodynamics", "Quantum Physics"],
  "Chemistry": ["Organic Chemistry", "Inorganic Chemistry", "Physical Chemistry", "Analytical Chemistry"],
  "Biology": ["Cell Biology", "Genetics", "Ecology", "Human Biology", "Evolution"],
  "History": ["World History", "Ancient History", "Modern History", "European History"],
  "Geography": ["Physical Geography", "Human Geography", "Environmental Geography"],
  "English Literature": ["Poetry", "Prose", "Drama", "Literary Analysis"],
  "Computer Science": ["Programming", "Algorithms", "Data Structures", "Web Development"],
  "Economics": ["Microeconomics", "Macroeconomics", "International Economics"],
  "Psychology": ["Cognitive Psychology", "Social Psychology", "Developmental Psychology"]
}

const questionTypes = [
  { value: "mixed", label: "Mixed Types" },
  { value: "multiple-choice", label: "Multiple Choice" },
  { value: "short-answer", label: "Short Answer" },
  { value: "essay", label: "Essay" },
  { value: "true-false", label: "True/False" },
  { value: "fill-blank", label: "Fill in the Blank" }
]

const difficulties = [
  { value: "mixed", label: "Mixed Difficulty" },
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" }
]

const gradeLevels = [
  "Elementary School (Grades 3-5)",
  "Middle School (Grades 6-8)",
  "High School (Grades 9-10)",
  "Advanced High School (Grades 11-12)",
  "University Level"
]

export default function EnhancedQuestionGenerator() {
  const [selectedBoard, setSelectedBoard] = useState<string>("")
  const [selectedSubject, setSelectedSubject] = useState<string>("")
  const [selectedTopic, setSelectedTopic] = useState<string>("")
  const [selectedGrade, setSelectedGrade] = useState<string>("")
  const [questionCount, setQuestionCount] = useState<number>(5)
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("mixed")
  const [selectedType, setSelectedType] = useState<string>("mixed")
  
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0)
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({})
  const [answerFeedback, setAnswerFeedback] = useState<Record<string, { isCorrect: boolean; feedback: string; score: number }>>({})
  const [showResults, setShowResults] = useState<boolean>(false)
  const [sessionStarted, setSessionStarted] = useState<boolean>(false)
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [isCheckingAnswer, setIsCheckingAnswer] = useState<boolean>(false)
  const [error, setError] = useState<string>("")

  const handleGenerateQuestions = async () => {
    if (!selectedBoard || !selectedSubject || !selectedTopic || !selectedGrade) {
      setError("Please fill in all required fields")
      return
    }

    setIsGenerating(true)
    setError("")

    try {
      const questions = await generateQuestions({
        board: selectedBoard,
        level: selectedGrade,
        subject: selectedSubject,
        topic: selectedTopic,
        questions: questionCount.toString()
      })

      if (!questions || questions.length === 0) {
        setError(
          "No questions were generated. Please try again (or adjust the topic/board)."
        )
        setSessionStarted(false)
        setGeneratedQuestions([])
        return
      }

      setGeneratedQuestions(questions)
      setCurrentQuestionIndex(0)
      setUserAnswers({})
      setShowResults(false)
      setSessionStarted(true)
    } catch (err) {
      setError("Failed to generate questions. Please try again.")
      console.error(err)
    } finally {
      setIsGenerating(false)
    }
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
    setAnswerFeedback({})
    setShowResults(false)
  }

  const handleCheckAnswer = async () => {
    if (!currentQuestion || !userAnswers[currentQuestion.id]) return

    setIsCheckingAnswer(true)
    try {
      const feedback = await checkAnswer(
        currentQuestion.question,
        userAnswers[currentQuestion.id],
        Array.isArray(currentQuestion.correctAnswer) 
          ? currentQuestion.correctAnswer[0] 
          : currentQuestion.correctAnswer,
        currentQuestion.type
      )
      setAnswerFeedback(prev => ({
        ...prev,
        [currentQuestion.id]: feedback
      }))
    } catch (error) {
      console.error('Error checking answer:', error)
    } finally {
      setIsCheckingAnswer(false)
    }
  }

  const calculateScore = () => {
    let totalScore = 0
    let maxScore = 0
    
    generatedQuestions.forEach(question => {
      const feedback = answerFeedback[question.id]
      if (feedback) {
        totalScore += feedback.score
      }
      maxScore += question.marks
    })
    
    return {
      score: totalScore,
      maxScore,
      percentage: maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0
    }
  }

  const currentQuestion = generatedQuestions[currentQuestionIndex]

  if (sessionStarted && (!currentQuestion || generatedQuestions.length === 0)) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI Practice Session</h1>
          <p className="text-muted-foreground mt-1">
            We couldn't load your questions. Please start a new session.
          </p>
        </div>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <p className="text-sm text-muted-foreground">
              This usually happens if the AI response format is unexpected.
            </p>
            <Button onClick={resetSession} className="w-full">
              <RotateCcw className="h-4 w-4 mr-2" />
              Back to Generator
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!sessionStarted) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI Question Generator</h1>
          <p className="text-muted-foreground mt-1">
            Generate personalized practice questions using AI based on your curriculum
          </p>
        </div>

        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5" />
              <span>Generate Questions</span>
            </CardTitle>
            <CardDescription>
              Customize your practice session with AI-powered questions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Education Board *</Label>
                <Select value={selectedBoard} onValueChange={setSelectedBoard}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select education board" />
                  </SelectTrigger>
                  <SelectContent>
                    {educationBoards.map((board) => (
                      <SelectItem key={board} value={board}>{board}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Subject *</Label>
                <Select value={selectedSubject} onValueChange={(value) => {
                  setSelectedSubject(value)
                  setSelectedTopic("")
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Topic *</Label>
                <Select value={selectedTopic} onValueChange={(value) => {
                  setSelectedTopic(value)
                }} disabled={!selectedSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select topic" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedSubject && topics[selectedSubject]?.map((topic) => (
                      <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Grade Level *</Label>
                <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade level" />
                  </SelectTrigger>
                  <SelectContent>
                    {gradeLevels.map((grade) => (
                      <SelectItem key={grade} value={grade}>{grade}</SelectItem>
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
            </div>
            <Button 
              onClick={handleGenerateQuestions} 
              className="w-full"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating Questions...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Generate Questions
                </>
              )}
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
              <span>Your Score: {score.score}/{score.maxScore} ({score.percentage}%)</span>
            </CardTitle>
            <CardDescription className="text-center">
              You scored {score.score} out of {score.maxScore} possible points
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {generatedQuestions.map((question, index) => {
                const userAnswer = userAnswers[question.id]
                const feedback = answerFeedback[question.id]
                const isCorrect = feedback?.isCorrect ?? false

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
                            <span className="font-medium">Score:</span> {feedback?.score || 0}/{question.marks} points
                          </p>
                          {feedback?.feedback && (
                            <div className="flex items-start space-x-2 mt-2">
                              <Lightbulb className="h-4 w-4 text-muted-foreground mt-0.5" />
                              <p className="text-sm text-muted-foreground">
                                {feedback.feedback}
                              </p>
                            </div>
                          )}
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
          <h1 className="text-3xl font-bold text-foreground">AI Practice Session</h1>
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

            {currentQuestion.type === "fill-blank" && (
              <Input
                placeholder="Fill in the blank..."
                value={userAnswers[currentQuestion.id] || ""}
                onChange={(e) => handleAnswer(e.target.value)}
              />
            )}

            {currentQuestion.type === "essay" && (
              <Textarea
                placeholder="Write your detailed answer here..."
                value={userAnswers[currentQuestion.id] || ""}
                onChange={(e) => handleAnswer(e.target.value)}
                className="min-h-[200px]"
              />
            )}
          </div>

          {/* Show AI feedback for open-ended questions */}
          {(currentQuestion.type === 'short-answer' || currentQuestion.type === 'essay' || currentQuestion.type === 'fill-blank') && answerFeedback[currentQuestion.id] && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-2">
                  <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      Score: {answerFeedback[currentQuestion.id].score}/{currentQuestion.marks} points
                    </p>
                    <p className="text-sm text-blue-700 mt-1">
                      {answerFeedback[currentQuestion.id].feedback}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={previousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>
            <div className="flex space-x-2">
              {(currentQuestion.type === 'short-answer' || currentQuestion.type === 'essay' || currentQuestion.type === 'fill-blank') && !answerFeedback[currentQuestion.id] && (
                <Button 
                  onClick={handleCheckAnswer}
                  disabled={!userAnswers[currentQuestion.id] || isCheckingAnswer}
                  variant="outline"
                >
                  {isCheckingAnswer ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    <>
                      <Target className="h-4 w-4 mr-2" />
                      Check Answer
                    </>
                  )}
                </Button>
              )}
              <Button 
                onClick={nextQuestion}
                disabled={(currentQuestion.type === 'short-answer' || currentQuestion.type === 'essay' || currentQuestion.type === 'fill-blank') && !answerFeedback[currentQuestion.id]}
              >
                {currentQuestionIndex === generatedQuestions.length - 1 ? "Finish" : "Next"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
