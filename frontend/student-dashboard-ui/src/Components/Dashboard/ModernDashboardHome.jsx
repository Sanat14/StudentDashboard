"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { fetchWithAuth } from "../../utils/fetchWithAuth"
import { Users, FileText, ClipboardList, TrendingUp, BookOpen, X } from "lucide-react"
import AddStudentModal from "../Students/AddStudentModal"

export default function ModernDashboardHome({ idToken }) {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalWorksheets: 0,
    totalTests: 0,
    averagePerformance: 0,
    recentActivity: [],
  })
  const [loading, setLoading] = useState(true)
  // Modal state
  const [showAddStudent, setShowAddStudent] = useState(false)
  // Form state
  const [showWorksheetForm, setShowWorksheetForm] = useState(false)
  const [showTestForm, setShowTestForm] = useState(false)
  const [worksheetFormData, setWorksheetFormData] = useState({
    title: "",
    subject: "",
    topic: "",
    difficulty: "",
  })
  const [testFormData, setTestFormData] = useState({
    title: "",
    subject: "",
    topic: "",
  })
  const [formLoading, setFormLoading] = useState(false)

  // Fetch dashboard stats and modal data
  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      // Fetch students
      const studentsRes = await fetchWithAuth("http://localhost:5265/api/students", idToken)
      const studentsData = studentsRes.ok ? await studentsRes.json() : []
      // Fetch worksheets
      const worksheetsRes = await fetchWithAuth("http://localhost:5265/api/studentworksheets", idToken)
      const worksheets = worksheetsRes.ok ? await worksheetsRes.json() : []
      // Fetch tests
      const testsRes = await fetchWithAuth("http://localhost:5265/api/studenttests", idToken)
      const tests = testsRes.ok ? await testsRes.json() : []

      // Calculate average performance from test scores
      const completedTests = tests.filter((test) => test.score !== null && test.score !== undefined)
      const averagePerformance =
        completedTests.length > 0
          ? Math.round(completedTests.reduce((sum, test) => sum + test.score, 0) / completedTests.length)
          : 0

      setStats({
        totalStudents: studentsData.length,
        totalWorksheets: worksheets.length,
        totalTests: tests.length,
        averagePerformance,
        recentActivity: studentsData.slice(0, 5),
      })
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
    // eslint-disable-next-line
  }, [idToken])

  // Create worksheet template with form
  const handleWorksheetSubmit = async (e) => {
    e.preventDefault()
    setFormLoading(true)

    try {
      const response = await fetchWithAuth("http://localhost:5265/api/worksheettemplates", idToken, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(worksheetFormData),
      })

      if (response.ok) {
        alert("Worksheet template created successfully!")
        setShowWorksheetForm(false)
        setWorksheetFormData({ title: "", subject: "", topic: "", difficulty: "" })
        fetchDashboardData()
      } else {
        alert("Failed to create worksheet template. Please try again.")
      }
    } catch (err) {
      alert("An error occurred while creating the worksheet template.")
    } finally {
      setFormLoading(false)
    }
  }

  // Create test template with form
  const handleTestSubmit = async (e) => {
    e.preventDefault()
    setFormLoading(true)

    try {
      const response = await fetchWithAuth("http://localhost:5265/api/testtemplates", idToken, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testFormData),
      })

      if (response.ok) {
        alert("Test template created successfully!")
        setShowTestForm(false)
        setTestFormData({ title: "", subject: "", topic: "" })
        fetchDashboardData()
      } else {
        alert("Failed to create test template. Please try again.")
      }
    } catch (err) {
      alert("An error occurred while creating the test template.")
    } finally {
      setFormLoading(false)
    }
  }

  // Quick action handlers
  const handleQuickAction = (action) => {
    switch (action) {
      case "addStudent":
        setShowAddStudent(true)
        break
      case "createWorksheet":
        setShowWorksheetForm(true)
        break
      case "createTest":
        setShowTestForm(true)
        break
      case "viewReports":
        navigate("/reports")
        break
      default:
        break
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-8 text-white flex flex-col items-center text-center">
        <h1 className="text-3xl font-bold mb-2">Welcome back, Teacher!</h1>
        <p className="text-purple-200">Here's what's happening with your students today.</p>
      </div>

      <div className="p-8 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Worksheets</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalWorksheets}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <ClipboardList className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Tests</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalTests}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-orange-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Performance</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averagePerformance}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleQuickAction("addStudent")}
                  className="flex flex-col items-center p-6 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-lg transition-all duration-200 cursor-pointer"
                  style={{ backgroundColor: 'white' }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-3 hover:scale-110 transition-transform duration-200">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">
                    Add Student
                  </span>
                </button>

                <button
                  onClick={() => handleQuickAction("createWorksheet")}
                  className="flex flex-col items-center p-6 bg-white border border-gray-200 rounded-xl hover:border-green-300 hover:shadow-lg transition-all duration-200 cursor-pointer"
                  style={{ backgroundColor: 'white' }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-3 hover:scale-110 transition-transform duration-200">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 hover:text-green-600 transition-colors">
                    Create Worksheet
                  </span>
                </button>

                <button
                  onClick={() => handleQuickAction("createTest")}
                  className="flex flex-col items-center p-6 bg-white border border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-lg transition-all duration-200 cursor-pointer"
                  style={{ backgroundColor: 'white' }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-3 hover:scale-110 transition-transform duration-200">
                    <ClipboardList className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 hover:text-purple-600 transition-colors">
                    New Test
                  </span>
                </button>

                <button
                  onClick={() => handleQuickAction("viewReports")}
                  className="flex flex-col items-center p-6 bg-white border border-gray-200 rounded-xl hover:border-orange-300 hover:shadow-lg transition-all duration-200 cursor-pointer"
                  style={{ backgroundColor: 'white' }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-3 hover:scale-110 transition-transform duration-200">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 hover:text-orange-600 transition-colors">
                    View Reports
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Students</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {stats.recentActivity.map((student) => (
                  <div key={student.id} className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {student.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{student.fullName}</p>
                      <p className="text-sm text-gray-500">Class : {student.grade}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">{new Date(student.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Worksheet Template Form */}
        {showWorksheetForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Create Worksheet Template</h3>
                <button
                  onClick={() => setShowWorksheetForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <form onSubmit={handleWorksheetSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    required
                    value={worksheetFormData.title}
                    onChange={(e) => setWorksheetFormData({ ...worksheetFormData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900"
                    placeholder="Enter worksheet title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <select
                    required
                    value={worksheetFormData.subject}
                    onChange={(e) => setWorksheetFormData({ ...worksheetFormData, subject: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900"
                  >
                    <option value="" className="text-gray-900">Select subject</option>
                    <option value="Math" className="text-gray-900">Math</option>
                    <option value="English" className="text-gray-900">English</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
                  <input
                    type="text"
                    required
                    value={worksheetFormData.topic}
                    onChange={(e) => setWorksheetFormData({ ...worksheetFormData, topic: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900"
                    placeholder="Enter topic"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                  <select
                    required
                    value={worksheetFormData.difficulty}
                    onChange={(e) => setWorksheetFormData({ ...worksheetFormData, difficulty: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900"
                  >
                    <option value="" className="text-gray-900">
                      Select difficulty
                    </option>
                    <option value="Easy" className="text-gray-900">
                      Easy
                    </option>
                    <option value="Medium" className="text-gray-900">
                      Medium
                    </option>
                    <option value="Hard" className="text-gray-900">
                      Hard
                    </option>
                  </select>
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowWorksheetForm(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {formLoading ? "Creating..." : "Create Template"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Test Template Form */}
        {showTestForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Create Test Template</h3>
                <button
                  onClick={() => setShowTestForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <form onSubmit={handleTestSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    required
                    value={testFormData.title}
                    onChange={(e) => setTestFormData({ ...testFormData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900"
                    placeholder="Enter test title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <select
                    required
                    value={testFormData.subject}
                    onChange={(e) => setTestFormData({ ...testFormData, subject: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900"
                  >
                    <option value="" className="text-gray-900">Select subject</option>
                    <option value="Math" className="text-gray-900">Math</option>
                    <option value="English" className="text-gray-900">English</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
                  <input
                    type="text"
                    required
                    value={testFormData.topic}
                    onChange={(e) => setTestFormData({ ...testFormData, topic: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900"
                    placeholder="Enter topic"
                  />
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowTestForm(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {formLoading ? "Creating..." : "Create Template"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Add Student Modal */}
      <AddStudentModal
        isOpen={showAddStudent}
        onClose={() => setShowAddStudent(false)}
        onStudentAdded={() => {
          setShowAddStudent(false)
          fetchDashboardData()
        }}
        idToken={idToken}
      />
    </div>
  )
}
