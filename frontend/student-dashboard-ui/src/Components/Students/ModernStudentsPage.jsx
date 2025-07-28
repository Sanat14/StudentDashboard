"use client"

import { useEffect, useState } from "react"
import { fetchWithAuth } from "../../utils/fetchWithAuth"
import { useNavigate } from "react-router-dom"
import { Users, Search, Filter, Plus, TrendingUp, Award, Clock, Edit, Trash2 } from "lucide-react"
import AddStudentModal from "./AddStudentModal"
import EditStudentModal from "./EditStudentModal"

export default function ModernStudentsPage({ idToken }) {
  const [students, setStudents] = useState([])
  const [summaries, setSummaries] = useState({})
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterBy, setFilterBy] = useState("All")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    loadData()
  }, [idToken])

  const loadData = async () => {
    try {
      setLoading(true)
      const res = await fetchWithAuth("http://localhost:5265/api/students", idToken)

      if (!res.ok) {
        console.error("API error:", res.status)
        return
      }

      const studentsData = await res.json()
      setStudents(studentsData)

      // Fetch summaries for each student
      const summaryPromises = studentsData.map(async (student) => {
        try {
          const summaryRes = await fetchWithAuth(`http://localhost:5265/api/students/${student.id}/summary`, idToken)
          if (summaryRes.ok) {
            const summary = await summaryRes.json()
            return { id: student.id, summary }
          }
        } catch (err) {
          console.error(`Failed to fetch summary for student ${student.id}:`, err)
        }
        return { id: student.id, summary: null }
      })

      const summaryResults = await Promise.all(summaryPromises)
      const summariesMap = {}
      summaryResults.forEach(({ id, summary }) => {
        summariesMap[id] = summary
      })
      setSummaries(summariesMap)
    } catch (err) {
      console.error("Failed to fetch students:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteStudent = async (studentId) => {
    if (!confirm("Are you sure you want to delete this student?")) return

    try {
      const response = await fetchWithAuth(`http://localhost:5265/api/students/${studentId}`, idToken, {
        method: "DELETE",
      })

      if (response.ok) {
        setStudents(students.filter((s) => s.id !== studentId))
        const newSummaries = { ...summaries }
        delete newSummaries[studentId]
        setSummaries(newSummaries)
      } else {
        alert("Failed to delete student")
      }
    } catch (err) {
      console.error("Error deleting student:", err)
      alert("An error occurred while deleting the student")
    }
  }

  const handleStudentAdded = (newStudent) => {
    setStudents([...students, newStudent])
    loadData() // Refresh to get updated summaries
  }

  const handleStudentUpdated = (updatedStudent) => {
    setStudents(students.map((s) => (s.id === updatedStudent.id ? updatedStudent : s)))
  }

  const getProgressColor = (submitted, assigned) => {
    if (assigned === 0) return "bg-gray-200"
    const percentage = (submitted / assigned) * 100
    if (percentage >= 80) return "bg-green-500"
    if (percentage >= 60) return "bg-yellow-500"
    if (percentage >= 40) return "bg-orange-500"
    return "bg-red-500"
  }

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600 bg-green-100"
    if (score >= 60) return "text-yellow-600 bg-yellow-100"
    if (score >= 40) return "text-orange-600 bg-orange-100"
    return "text-red-600 bg-red-100"
  }

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterBy === "All" || student.createdByEmail === filterBy
    return matchesSearch && matchesFilter
  })

  const uniqueTeachers = [...new Set(students.map((s) => s.createdByEmail))]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">Loading students...</span>
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
            <h1 className="text-3xl font-bold text-gray-900">Students</h1>
            <p className="text-gray-600 mt-1">Manage and track student progress</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Add Student</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{students.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active This Week</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Object.values(summaries).filter((s) => s?.mostRecentActivityTimestamp).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Test Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(
                    Object.values(summaries)
                      .filter((s) => s?.averageTestScore)
                      .reduce((acc, s) => acc + s.averageTestScore, 0) /
                      Object.values(summaries).filter((s) => s?.averageTestScore).length || 0,
                  )}
                  %
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-orange-100 rounded-xl">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending Work</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Object.values(summaries).reduce(
                    (acc, s) => acc + (s ? s.totalWorksheetsAssigned - s.totalWorksheetsSubmitted : 0),
                    0,
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white text-gray-900 min-w-48"
            >
              <option value="All">All Teachers</option>
              {uniqueTeachers.map((email) => (
                <option key={email} value={email}>
                  {email}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Student Proficiency</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Student</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Work Completed</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Average Score</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Tests Taken</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Recent Activity</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStudents.map((student) => {
                  const summary = summaries[student.id]
                  const completionRate = summary
                    ? Math.round(
                        (summary.totalWorksheetsSubmitted / Math.max(summary.totalWorksheetsAssigned, 1)) * 100,
                      )
                    : 0

                  return (
                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                            {student.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{student.fullName}</p>
                            <p className="text-sm text-gray-500"><b>Class :</b> {student.grade}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-gray-700">
                                {summary?.totalWorksheetsSubmitted || 0} / {summary?.totalWorksheetsAssigned || 0}
                              </span>
                              <span className="text-sm text-gray-500">{completionRate}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(
                                  summary?.totalWorksheetsSubmitted || 0,
                                  summary?.totalWorksheetsAssigned || 0,
                                )}`}
                                style={{ width: `${completionRate}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(
                            summary?.averageTestScore || 0,
                          )}`}
                        >
                          {Math.round(summary?.averageTestScore || 0)}%
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-blue-600">{summary?.totalTestsTaken || 0}</span>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="text-gray-900 font-medium">
                            {summary?.mostRecentActivityDescription || "No activity"}
                          </p>
                          <p className="text-gray-500">
                            {summary?.mostRecentActivityTimestamp
                              ? new Date(summary.mostRecentActivityTimestamp).toLocaleDateString()
                              : "Never"}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => navigate(`/students/${student.id}`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Users className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedStudent(student)
                              setShowEditModal(true)
                            }}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Edit Student"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteStudent(student.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Student"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No students found</p>
            </div>
          )}
        </div>

        {/* Modals */}
        <AddStudentModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onStudentAdded={handleStudentAdded}
          idToken={idToken}
        />

        <EditStudentModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false)
            setSelectedStudent(null)
          }}
          student={selectedStudent}
          onStudentUpdated={handleStudentUpdated}
          idToken={idToken}
        />
      </div>
    </div>
  )
}
