"use client"

import React, { useEffect, useState } from "react"
import { fetchWithAuth } from "../../utils/fetchWithAuth"
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts"
import { 
  TrendingUp, Users, Search, Filter, BookOpen, Target, 
  Award, Calendar, BarChart3, Activity, Target as TargetIcon, ChevronDown 
} from "lucide-react"

export default function ModernProgressPage({ idToken }) {
  const [students, setStudents] = useState([])
  const [worksheets, setWorksheets] = useState([])
  const [tests, setTests] = useState([])
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedSubject, setSelectedSubject] = useState("All")
  const [studentSearchTerm, setStudentSearchTerm] = useState("")
  const [showStudentDropdown, setShowStudentDropdown] = useState(false)

  useEffect(() => {
    loadData()
  }, [idToken])

  const loadData = async () => {
    try {
      setLoading(true)

      // Fetch students
      const studentsRes = await fetchWithAuth("http://localhost:5265/api/students", idToken)
      if (studentsRes.ok) {
        const studentsData = await studentsRes.json()
        setStudents(studentsData)
        if (studentsData.length > 0) {
          setSelectedStudent(studentsData[0])
        }
      }

      // Fetch worksheets
      const worksheetsRes = await fetchWithAuth("http://localhost:5265/api/studentworksheets", idToken)
      if (worksheetsRes.ok) {
        const worksheetsData = await worksheetsRes.json()
        setWorksheets(worksheetsData)
      }

      // Fetch tests
      const testsRes = await fetchWithAuth("http://localhost:5265/api/studenttests", idToken)
      if (testsRes.ok) {
        const testsData = await testsRes.json()
        setTests(testsData)
      }
    } catch (err) {
      console.error("Failed to fetch progress data:", err)
    } finally {
      setLoading(false)
    }
  }

  // Filter students based on search term
  const filteredStudents = students.filter(student =>
    student.fullName.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
    student.grade.toLowerCase().includes(studentSearchTerm.toLowerCase())
  )

  // Calculate student progress data
  const getStudentProgress = (student) => {
    if (!student) return null

    const studentWorksheets = worksheets.filter(w => w.studentName === student.fullName)
    const studentTests = tests.filter(t => t.studentName === student.fullName)

    // Filter by subject if selected
    const filteredWorksheets = selectedSubject === "All" 
      ? studentWorksheets 
      : studentWorksheets.filter(w => w.subject === selectedSubject)
    const filteredTests = selectedSubject === "All" 
      ? studentTests 
      : studentTests.filter(t => t.subject === selectedSubject)

    const completedWorksheets = filteredWorksheets.filter(w => w.score !== null && w.score !== undefined)
    const completedTests = filteredTests.filter(t => t.score !== null && t.score !== undefined)

    const worksheetCompletionRate = filteredWorksheets.length > 0 
      ? Math.round((completedWorksheets.length / filteredWorksheets.length) * 100) 
      : 0

    const averageWorksheetScore = completedWorksheets.length > 0
      ? Math.round(completedWorksheets.reduce((sum, w) => sum + w.score, 0) / completedWorksheets.length)
      : 0

    const averageTestScore = completedTests.length > 0
      ? Math.round(completedTests.reduce((sum, t) => sum + t.score, 0) / completedTests.length)
      : 0

    const testPassRate = completedTests.length > 0
      ? Math.round((completedTests.filter(t => t.passed).length / completedTests.length) * 100)
      : 0

    return {
      student,
      worksheets: filteredWorksheets,
      tests: filteredTests,
      completedWorksheets,
      completedTests,
      worksheetCompletionRate,
      averageWorksheetScore,
      averageTestScore,
      testPassRate,
      totalAssignments: filteredWorksheets.length + filteredTests.length,
      completedAssignments: completedWorksheets.length + completedTests.length
    }
  }

  // Prepare chart data
  const getChartData = (progress) => {
    if (!progress) return []

    const { worksheets, tests } = progress

    // Combine worksheets and tests for timeline
    const allAssignments = [
      ...worksheets.map(w => ({
        ...w,
        type: 'Worksheet',
        date: w.submittedDate || w.assignedDate,
        score: w.score || 0
      })),
      ...tests.map(t => ({
        ...t,
        type: 'Test',
        date: t.dateTaken || t.assignedDate,
        score: t.score || 0
      }))
    ].filter(a => a.date).sort((a, b) => new Date(a.date) - new Date(b.date))

    return allAssignments.map((assignment, index) => ({
      name: `${assignment.type} ${index + 1}`,
      score: assignment.score,
      date: new Date(assignment.date).toLocaleDateString(),
      type: assignment.type
    }))
  }

  // Prepare subject performance data
  const getSubjectPerformance = (progress) => {
    if (!progress) return []

    const { worksheets, tests } = progress

    const mathWorksheets = worksheets.filter(w => w.subject === 'Math' && w.score !== null)
    const englishWorksheets = worksheets.filter(w => w.subject === 'English' && w.score !== null)
    const mathTests = tests.filter(t => t.subject === 'Math' && t.score !== null)
    const englishTests = tests.filter(t => t.subject === 'English' && t.score !== null)

    const mathWorksheetAvg = mathWorksheets.length > 0 
      ? Math.round(mathWorksheets.reduce((sum, w) => sum + w.score, 0) / mathWorksheets.length)
      : 0
    const englishWorksheetAvg = englishWorksheets.length > 0
      ? Math.round(englishWorksheets.reduce((sum, w) => sum + w.score, 0) / englishWorksheets.length)
      : 0
    const mathTestAvg = mathTests.length > 0
      ? Math.round(mathTests.reduce((sum, t) => sum + t.score, 0) / mathTests.length)
      : 0
    const englishTestAvg = englishTests.length > 0
      ? Math.round(englishTests.reduce((sum, t) => sum + t.score, 0) / englishTests.length)
      : 0

    return [
      { subject: 'Math', worksheets: mathWorksheetAvg, tests: mathTestAvg },
      { subject: 'English', worksheets: englishWorksheetAvg, tests: englishTestAvg }
    ]
  }

  // Prepare completion data for pie chart
  const getCompletionData = (progress) => {
    if (!progress) return []

    const { completedWorksheets, completedTests, worksheets, tests } = progress
    const pendingWorksheets = worksheets.length - completedWorksheets.length
    const pendingTests = tests.length - completedTests.length

    return [
      { name: 'Completed Worksheets', value: completedWorksheets.length, fill: '#10B981' },
      { name: 'Pending Worksheets', value: pendingWorksheets, fill: '#F59E0B' },
      { name: 'Completed Tests', value: completedTests.length, fill: '#3B82F6' },
      { name: 'Pending Tests', value: pendingTests, fill: '#EF4444' }
    ].filter(item => item.value > 0)
  }

  const progress = getStudentProgress(selectedStudent)
  const chartData = getChartData(progress)
  const subjectData = getSubjectPerformance(progress)
  const completionData = getCompletionData(progress)

  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6']

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">Loading progress data...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Student Progress</h1>
            <p className="text-gray-600 mt-1">Track individual student performance and growth</p>
          </div>
        </div>

        {/* Student Selection and Subject Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <div className="relative">
              <input
                type="text"
                placeholder="Search for a student..."
                value={selectedStudent ? `${selectedStudent.fullName}` : ""}
                onClick={() => setShowStudentDropdown(true)}
                readOnly
                className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 cursor-pointer"
              />
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            
            {/* Student Dropdown */}
            {showStudentDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto" style={{ backgroundColor: 'white' }}>
                {/* Search Input */}
                <div className="p-3 border-b border-gray-200 bg-white">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Type to search students..."
                      value={studentSearchTerm}
                      onChange={(e) => setStudentSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm bg-white text-gray-900 placeholder-gray-500"
                      style={{ backgroundColor: 'white', color: '#111827' }}
                      autoFocus
                    />
                  </div>
                </div>
                
                {/* Student List */}
                <div className="py-1 bg-white">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <button
                        key={student.id}
                        onClick={() => {
                          setSelectedStudent(student)
                          setShowStudentDropdown(false)
                          setStudentSearchTerm("")
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3 bg-white"
                        style={{ backgroundColor: 'white' }}
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {student.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900" style={{ color: '#111827' }}>{student.fullName}</p>
                          <p className="text-sm text-gray-500" style={{ color: '#6B7280' }}>Class {student.grade}</p>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-gray-500 text-sm bg-white" style={{ backgroundColor: 'white', color: '#6B7280' }}>
                      No students found matching "{studentSearchTerm}"
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white text-gray-900 min-w-48"
            >
              <option value="All">All Subjects</option>
              <option value="Math">Math</option>
              <option value="English">English</option>
            </select>
          </div>
        </div>

        {/* Close dropdown when clicking outside */}
        {showStudentDropdown && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => {
              setShowStudentDropdown(false)
              setStudentSearchTerm("")
            }}
          />
        )}

        {selectedStudent && progress && (
          <>
            {/* Student Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Completion Rate</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {progress.totalAssignments > 0 
                        ? Math.round((progress.completedAssignments / progress.totalAssignments) * 100)
                        : 0}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <BookOpen className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Worksheet Score</p>
                    <p className="text-2xl font-bold text-gray-900">{progress.averageWorksheetScore}%</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <BarChart3 className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Test Score</p>
                    <p className="text-2xl font-bold text-gray-900">{progress.averageTestScore}%</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-orange-100 rounded-xl">
                    <Award className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Test Pass Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{progress.testPassRate}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Timeline */}
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Timeline</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#8B5CF6" 
                      strokeWidth={3}
                      dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Subject Performance Comparison */}
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Subject Performance</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={subjectData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="worksheets" fill="#10B981" name="Worksheets" />
                    <Bar dataKey="tests" fill="#3B82F6" name="Tests" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Assignment Completion */}
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Assignment Completion</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={completionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {completionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Performance Radar Chart */}
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={[
                    {
                      subject: 'Worksheets',
                      completed: progress.worksheetCompletionRate,
                      score: progress.averageWorksheetScore,
                      fullMark: 100,
                    },
                    {
                      subject: 'Tests',
                      completed: progress.testPassRate,
                      score: progress.averageTestScore,
                      fullMark: 100,
                    },
                    {
                      subject: 'Overall',
                      completed: progress.totalAssignments > 0 
                        ? Math.round((progress.completedAssignments / progress.totalAssignments) * 100)
                        : 0,
                      score: Math.round((progress.averageWorksheetScore + progress.averageTestScore) / 2),
                      fullMark: 100,
                    }
                  ]}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar name="Completion Rate" dataKey="completed" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                    <Radar name="Average Score" dataKey="score" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {chartData.slice(-5).reverse().map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className={`w-3 h-3 rounded-full ${
                        activity.type === 'Worksheet' ? 'bg-green-500' : 'bg-blue-500'
                      }`} />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {activity.type} completed
                        </p>
                        <p className="text-sm text-gray-500">
                          Score: {activity.score}% • {activity.date}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          activity.score >= 80 ? 'bg-green-100 text-green-800' :
                          activity.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {activity.score}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {!selectedStudent && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Select a student to view their progress</p>
          </div>
        )}
      </div>
    </div>
  )
} 