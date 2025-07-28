"use client"

import React, { useEffect, useState } from "react"
import { fetchWithAuth } from "../../utils/fetchWithAuth"
import { BarChart3, Search, Filter, TrendingUp, TrendingDown, Users, X } from "lucide-react"

export default function ModernReportsPage({ idToken }) {
  const [tests, setTests] = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStudent, setSelectedStudent] = useState("All")
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    loadData()
  }, [idToken])

  const loadData = async () => {
    try {
      setLoading(true)

      // Fetch all tests
      const testsRes = await fetchWithAuth("http://localhost:5265/api/studenttests", idToken)
      if (testsRes.ok) {
        const testsData = await testsRes.json()
        setTests(testsData)
      }

      // Fetch students
      const studentsRes = await fetchWithAuth("http://localhost:5265/api/students", idToken)
      if (studentsRes.ok) {
        const studentsData = await studentsRes.json()
        setStudents(studentsData)
      }
    } catch (err) {
      console.error("Failed to fetch reports data:", err)
    } finally {
      setLoading(false)
    }
  }

  // Calculate statistics
  const calculateStats = () => {
    const completedTests = tests.filter(test => test.score !== null && test.score !== undefined)
    const totalTests = tests.length
    const completedCount = completedTests.length
    const averageScore = completedCount > 0 
      ? Math.round(completedTests.reduce((sum, test) => sum + test.score, 0) / completedCount)
      : 0
    const passedTests = completedTests.filter(test => test.passed === true).length
    const failedTests = completedTests.filter(test => test.passed === false).length
    const passRate = completedCount > 0 ? Math.round((passedTests / completedCount) * 100) : 0

    return {
      totalTests,
      completedCount,
      averageScore,
      passedTests,
      failedTests,
      passRate
    }
  }

  // Filter tests based on search and student selection
  const filteredTests = tests.filter((test) => {
    const matchesSearch = 
      test.testTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.subject?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStudent = selectedStudent === "All" || test.studentName === selectedStudent
    
    return matchesSearch && matchesStudent
  })

  const stats = calculateStats()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">Loading reports...</span>
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
            <h1 className="text-3xl font-bold text-gray-900">Performance Reports</h1>
            <p className="text-gray-600 mt-1">Track student performance and test results</p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Tests</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalTests}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageScore}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pass Rate</p>
                <p className="text-2xl font-bold text-gray-900">{stats.passRate}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-orange-100 rounded-xl">
                <TrendingDown className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tests, students, or subjects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900"
                />
              </div>
              <div className="relative">
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white text-gray-900 min-w-48"
                >
                  <option value="All">All Students</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.fullName}>
                      {student.fullName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Test Results Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Test Results</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Student</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Test</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Subject</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Score</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Date Taken</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTests.map((test) => (
                  <tr key={test.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {test.studentName?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900">{test.studentName}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{test.testTitle}</p>
                        <p className="text-sm text-gray-500">{test.topic}</p>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {test.subject}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${
                        test.score !== null && test.score !== undefined
                          ? test.score >= 70 ? 'text-green-600' : test.score >= 50 ? 'text-yellow-600' : 'text-red-600'
                          : 'text-gray-500'
                      }`}>
                        {test.score !== null && test.score !== undefined ? `${Math.round(test.score)}%` : "Not taken"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {test.score !== null && test.score !== undefined ? (
                          test.passed ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Passed
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Failed
                            </span>
                          )
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Not taken
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">
                        {test.dateTaken ? new Date(test.dateTaken).toLocaleDateString() : "Not taken"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTests.length === 0 && (
            <div className="text-center py-12">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No test results found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 