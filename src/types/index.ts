export interface Syllabus {
  id: string
  name: string
  description: string
  educationBoard: string
  subject: string
  grade: string
  topics: Topic[]
  createdAt: Date
  updatedAt: Date
}

export interface Topic {
  id: string
  name: string
  description: string
  subtopics: Subtopic[]
  difficulty: 'easy' | 'medium' | 'hard'
  estimatedHours: number
}

export interface Subtopic {
  id: string
  name: string
  description: string
  keyConcepts: string[]
}

export interface Question {
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

export interface StudentProfile {
  id: string
  name: string
  email: string
  grade: string
  educationBoard: string
  preferredSubjects: string[]
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading'
  difficultyPreference: 'easy' | 'medium' | 'hard' | 'mixed'
  studyGoals: StudyGoal[]
}

export interface StudyGoal {
  id: string
  title: string
  description: string
  targetDate: Date
  syllabusId: string
  progress: number
  status: 'active' | 'completed' | 'paused'
}

export interface StudySession {
  id: string
  studentId: string
  syllabusId: string
  topicIds: string[]
  questions: Question[]
  startTime: Date
  endTime?: Date
  score?: number
  answers: StudentAnswer[]
}

export interface StudentAnswer {
  questionId: string
  answer: string | string[]
  isCorrect: boolean
  timeSpent: number
}

export interface EducationBoard {
  id: string
  name: string
  country: string
  grades: string[]
  subjects: string[]
}
