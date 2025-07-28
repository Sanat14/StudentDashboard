"use client"

import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { fetchWithAuth } from "../../utils/fetchWithAuth"
import {
  ArrowLeft,
  Phone,
  Mail,
  Calendar,
  FileText,
  ClipboardList,
  TrendingUp,
  Award,
  CheckCircle,
  XCircle,
} from "lucide-react"

export default function ModernStudentDetailsPage({ idToken }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [student, setStudent] = useState(null)
  const [summary, setSummary] = useState(null)
  const [worksheets, setWorksheets] = useState([])
  const [tests, setTests] = useState([])
  const [progress, setProgress] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true)

        // Fetch all data in parallel
        const [studentRes, summaryRes, worksheetsRes, testsRes, progressRes] = await Promise.all([
          fetchWithAuth(`http://localhost:5265/api/students/${id}`, idToken),
          fetchWithAuth(`http://localhost:5265/api/students/${id}/summary`, idToken),
          fetchWithAuth(`http://localhost:5265/api/StudentWorksheets?studentId=${id}`, idToken),
          fetchWithAuth(`http://localhost:5265/api/StudentTests?studentId=${id}`, idToken),
          fetchWithAuth(`http://localhost:5265/api/StudentProgress?studentId=${id}`, idToken),
        ])

        if (studentRes.ok) setStudent(await studentRes.json())
        if (summaryRes.ok) setSummary(await summaryRes.json())
        if (worksheetsRes.ok) setWorksheets(await worksheetsRes.json())
        if (testsRes.ok) setTests(await testsRes.json())
        if (progressRes.ok) setProgress(await progressRes.json())
      } catch (err) {
        console.error("Failed to fetch student data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchAllData()
  }, [id, idToken])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">Loading student details...</span>
        </div>
      </div>
    )
  }

  if (!student || !summary) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Student not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate("/students")} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
              {student.fullName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{student.fullName}</h1>
              <div className="flex items-center space-x-4 text-gray-600 mt-1">
                <span className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span><b>Class :</b> {student.grade}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Phone className="w-4 h-4" />
                  <span>{student.contactNumber}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span> <b>Teacher :</b> {student.createdByEmail.split("@")[0]}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Worksheets Assigned</p>
                <p className="text-2xl font-bold text-gray-900">{summary.totalWorksheetsAssigned}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Worksheets Submitted</p>
                <p className="text-2xl font-bold text-gray-900">{summary.totalWorksheetsSubmitted}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <ClipboardList className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tests Taken</p>
                <p className="text-2xl font-bold text-gray-900">{summary.totalTestsTaken}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-orange-100 rounded-xl">
                <Award className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Average Test Score</p>
                <p className="text-2xl font-bold text-gray-900">{Math.round(summary.averageTestScore || 0)}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Worksheets */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Worksheets</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {worksheets.slice(0, 5).map((worksheet) => (
                  <div key={worksheet.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="font-medium text-gray-900">{worksheet.worksheetTitle}</p>
                        <p className="text-sm text-gray-500">
                          {worksheet.subject} • {worksheet.topic}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {worksheet.score ? `${Math.round(worksheet.score)}%` : "Not graded"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {worksheet.submittedDate
                          ? new Date(worksheet.submittedDate).toLocaleDateString()
                          : "Not submitted"}
                      </p>
                    </div>
                  </div>
                ))}
                {worksheets.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No worksheets assigned yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Recent Tests */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Tests</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {tests.slice(0, 5).map((test) => (
                  <div key={test.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <ClipboardList className="w-5 h-5 text-purple-500" />
                      <div>
                        <p className="font-medium text-gray-900">{test.testTitle}</p>
                        <p className="text-sm text-gray-500">
                          {test.subject} • {test.topic}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        {test.passed !== null &&
                          (test.passed ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-500" />
                          ))}
                        <p className="text-sm font-medium text-gray-900">
                          {test.score ? `${Math.round(test.score)}%` : "Not taken"}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500">
                        {test.dateTaken ? new Date(test.dateTaken).toLocaleDateString() : "Not taken"}
                      </p>
                    </div>
                  </div>
                ))}
                {tests.length === 0 && <p className="text-gray-500 text-center py-4">No tests assigned yet</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-6">
            {summary.mostRecentActivityDescription ? (
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{summary.mostRecentActivityDescription}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(summary.mostRecentActivityTimestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
