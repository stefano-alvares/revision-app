"use client"

import { useState } from "react"
import Layout from "@/components/layout"
import Dashboard from "@/components/dashboard"
import SyllabusManager from "@/components/syllabus-manager"
import QuestionGenerator from "@/components/enhanced-question-generator"

export default function Home() {
  const [currentView, setCurrentView] = useState("dashboard")

  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard />
      case "syllabus":
        return <SyllabusManager />
      case "questions":
        return <QuestionGenerator />
      case "progress":
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground">Progress Tracking</h2>
              <p className="text-muted-foreground mt-2">Coming soon...</p>
            </div>
          </div>
        )
      case "settings":
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground">Settings</h2>
              <p className="text-muted-foreground mt-2">Coming soon...</p>
            </div>
          </div>
        )
      default:
        return <Dashboard />
    }
  }

  return (
    <Layout currentView={currentView} onViewChange={setCurrentView}>
      {renderContent()}
    </Layout>
  )
}
