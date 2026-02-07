"use client"

import { useState } from "react"
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  BookOpen, 
  Clock,
  Target,
  ChevronRight,
  ChevronDown
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Syllabus, Topic, Subtopic } from "@/types"

const mockEducationBoards = [
  "Cambridge IGCSE",
  "Edexcel",
  "AQA",
  "OCR",
  "International Baccalaureate (IB)",
  "AP (Advanced Placement)"
]

const mockSubjects = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "History",
  "Geography",
  "English Literature",
  "Computer Science"
]

const mockGrades = [
  "Grade 9-10 (IGCSE)",
  "Grade 11-12 (A-Level)",
  "Grade 9-12 (IB)",
  "Grade 11-12 (AP)"
]

export default function SyllabusManager() {
  const [syllabi, setSyllabi] = useState<Syllabus[]>([
    {
      id: "1",
      name: "IGCSE Mathematics",
      description: "Complete Cambridge IGCSE Mathematics syllabus",
      educationBoard: "Cambridge IGCSE",
      subject: "Mathematics",
      grade: "Grade 9-10 (IGCSE)",
      topics: [
        {
          id: "1",
          name: "Algebra",
          description: "Linear equations, quadratic equations, and inequalities",
          subtopics: [
            { id: "1", name: "Linear Equations", description: "Solving linear equations", keyConcepts: ["Variables", "Coefficients", "Solutions"] },
            { id: "2", name: "Quadratic Equations", description: "Factoring and formula method", keyConcepts: ["Factoring", "Quadratic Formula", "Discriminant"] }
          ],
          difficulty: "medium",
          estimatedHours: 20
        },
        {
          id: "2",
          name: "Geometry",
          description: "Shapes, angles, and spatial reasoning",
          subtopics: [
            { id: "3", name: "Triangles", description: "Properties and theorems", keyConcepts: ["Pythagorean Theorem", "Similarity", "Congruence"] }
          ],
          difficulty: "easy",
          estimatedHours: 15
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSyllabus, setSelectedSyllabus] = useState<Syllabus | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set())

  const [newSyllabus, setNewSyllabus] = useState({
    name: "",
    description: "",
    educationBoard: "",
    subject: "",
    grade: ""
  })

  const filteredSyllabi = syllabi.filter(syllabus =>
    syllabus.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    syllabus.subject.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleTopicExpansion = (topicId: string) => {
    const newExpanded = new Set(expandedTopics)
    if (newExpanded.has(topicId)) {
      newExpanded.delete(topicId)
    } else {
      newExpanded.add(topicId)
    }
    setExpandedTopics(newExpanded)
  }

  const handleCreateSyllabus = () => {
    if (newSyllabus.name && newSyllabus.educationBoard && newSyllabus.subject && newSyllabus.grade) {
      const syllabus: Syllabus = {
        id: Date.now().toString(),
        ...newSyllabus,
        topics: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
      setSyllabi([...syllabi, syllabus])
      setNewSyllabus({ name: "", description: "", educationBoard: "", subject: "", grade: "" })
      setIsCreateDialogOpen(false)
    }
  }

  const handleDeleteSyllabus = (id: string) => {
    setSyllabi(syllabi.filter(s => s.id !== id))
    if (selectedSyllabus?.id === id) {
      setSelectedSyllabus(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Syllabus Manager</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage your custom study syllabi
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Syllabus
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Syllabus</DialogTitle>
              <DialogDescription>
                Set up a new syllabus for your studies
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium">Name</label>
                <Input
                  id="name"
                  value={newSyllabus.name}
                  onChange={(e) => setNewSyllabus({ ...newSyllabus, name: e.target.value })}
                  placeholder="e.g., IGCSE Mathematics"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="description" className="text-sm font-medium">Description</label>
                <Textarea
                  id="description"
                  value={newSyllabus.description}
                  onChange={(e) => setNewSyllabus({ ...newSyllabus, description: e.target.value })}
                  placeholder="Brief description of the syllabus"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="board" className="text-sm font-medium">Education Board</label>
                <Select value={newSyllabus.educationBoard} onValueChange={(value) => setNewSyllabus({ ...newSyllabus, educationBoard: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select education board" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockEducationBoards.map((board) => (
                      <SelectItem key={board} value={board}>{board}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                  <Select value={newSyllabus.subject} onValueChange={(value) => setNewSyllabus({ ...newSyllabus, subject: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockSubjects.map((subject) => (
                        <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="grade" className="text-sm font-medium">Grade</label>
                  <Select value={newSyllabus.grade} onValueChange={(value) => setNewSyllabus({ ...newSyllabus, grade: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockGrades.map((grade) => (
                        <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateSyllabus}>Create Syllabus</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search syllabi..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Syllabus List */}
        <div className="lg:col-span-1 space-y-4">
          {filteredSyllabi.map((syllabus) => (
            <Card 
              key={syllabus.id} 
              className={`cursor-pointer transition-all ${
                selectedSyllabus?.id === syllabus.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedSyllabus(syllabus)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{syllabus.name}</CardTitle>
                <CardDescription>{syllabus.educationBoard}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{syllabus.subject}</span>
                  <span>{syllabus.topics.length} topics</span>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteSyllabus(syllabus.id)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Syllabus Details */}
        <div className="lg:col-span-2">
          {selectedSyllabus ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>{selectedSyllabus.name}</span>
                </CardTitle>
                <CardDescription>{selectedSyllabus.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="topics" className="w-full">
                  <TabsList>
                    <TabsTrigger value="topics">Topics</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                  </TabsList>
                  <TabsContent value="topics" className="space-y-4">
                    {selectedSyllabus.topics.map((topic) => (
                      <Card key={topic.id}>
                        <CardHeader 
                          className="pb-3 cursor-pointer"
                          onClick={() => toggleTopicExpansion(topic.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {expandedTopics.has(topic.id) ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                              <CardTitle className="text-lg">{topic.name}</CardTitle>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>{topic.estimatedHours}h</span>
                              <Target className="h-4 w-4 ml-2" />
                              <span className="capitalize">{topic.difficulty}</span>
                            </div>
                          </div>
                          <CardDescription>{topic.description}</CardDescription>
                        </CardHeader>
                        {expandedTopics.has(topic.id) && (
                          <CardContent className="pt-0">
                            <div className="space-y-3">
                              {topic.subtopics.map((subtopic) => (
                                <div key={subtopic.id} className="pl-6 border-l-2 border-border">
                                  <h4 className="font-medium text-foreground">{subtopic.name}</h4>
                                  <p className="text-sm text-muted-foreground">{subtopic.description}</p>
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {subtopic.keyConcepts.map((concept, index) => (
                                      <span key={index} className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded">
                                        {concept}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    ))}
                    <Button className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Topic
                    </Button>
                  </TabsContent>
                  <TabsContent value="settings">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Education Board</label>
                          <p className="text-sm text-muted-foreground">{selectedSyllabus.educationBoard}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Subject</label>
                          <p className="text-sm text-muted-foreground">{selectedSyllabus.subject}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Grade</label>
                          <p className="text-sm text-muted-foreground">{selectedSyllabus.grade}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Total Topics</label>
                          <p className="text-sm text-muted-foreground">{selectedSyllabus.topics.length}</p>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Syllabus Details
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground">No Syllabus Selected</h3>
                  <p className="text-muted-foreground">Select a syllabus from the list to view details</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
