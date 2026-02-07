"use client"

import { useState } from "react"
import { 
  BookOpen, 
  Target, 
  TrendingUp, 
  Clock,
  Brain,
  Award,
  BarChart3,
  Play
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const mockStats = [
  { title: "Study Sessions", value: "12", change: "+2", icon: Brain },
  { title: "Questions Answered", value: "156", change: "+23", icon: Target },
  { title: "Accuracy Rate", value: "78%", change: "+5%", icon: TrendingUp },
  { title: "Study Time", value: "8.5h", change: "+1.2h", icon: Clock },
]

const mockRecentSessions = [
  { id: "1", topic: "Mathematics - Algebra", score: 85, date: "2024-01-15", questions: 10 },
  { id: "2", topic: "Science - Physics", score: 92, date: "2024-01-14", questions: 15 },
  { id: "3", topic: "History - World War II", score: 78, date: "2024-01-13", questions: 8 },
]

const mockSyllabi = [
  { id: "1", name: "GCSE Mathematics", progress: 65, topics: 12, completed: 8 },
  { id: "2", name: "A-Level Physics", progress: 45, topics: 20, completed: 9 },
  { id: "3", name: "IB Chemistry", progress: 80, topics: 15, completed: 12 },
]

export default function Dashboard() {
  const [selectedSyllabus, setSelectedSyllabus] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back, Student!</h1>
          <p className="text-muted-foreground mt-1">
            Ready to continue your learning journey? Here's your progress overview.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-green-600 mt-1">
                  {stat.change} from last week
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Sessions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Recent Study Sessions</span>
            </CardTitle>
            <CardDescription>
              Your latest practice sessions and performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRecentSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{session.topic}</h4>
                    <p className="text-sm text-muted-foreground">{session.date}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Score</p>
                      <p className="text-lg font-bold text-foreground">{session.score}%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Questions</p>
                      <p className="text-lg font-bold text-foreground">{session.questions}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Syllabus Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5" />
              <span>Syllabus Progress</span>
            </CardTitle>
            <CardDescription>
              Track your learning progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockSyllabi.map((syllabus) => (
                <div key={syllabus.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-foreground text-sm">{syllabus.name}</h4>
                    <span className="text-xs text-muted-foreground">
                      {syllabus.completed}/{syllabus.topics} topics
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${syllabus.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">{syllabus.progress}% complete</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Quick Actions</span>
          </CardTitle>
          <CardDescription>
            Jump back into your studies or explore new topics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex flex-col space-y-2" onClick={() => window.location.href = '/questions'}>
              <Brain className="h-6 w-6" />
              <span>Generate Questions</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <BookOpen className="h-6 w-6" />
              <span>Browse Syllabus</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <BarChart3 className="h-6 w-6" />
              <span>View Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
