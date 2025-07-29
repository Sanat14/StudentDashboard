"use client"

import React, { useEffect, useState } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { fetchWithAuth } from "../../utils/fetchWithAuth"
import { ClipboardList, Search, Filter, Plus, Calendar, CheckCircle, XCircle, Clock, Edit, Trash2, X } from "lucide-react"

export default function ModernTestsPage({ idToken }) {
  const [tests, setTests] = useState([])
  const [templates, setTemplates] = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterBy, setFilterBy] = useState("All")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [selectedTest, setSelectedTest] = useState(null)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  
  // Template filter states
  const [templateSubjectFilter, setTemplateSubjectFilter] = useState("All")
  const [templateTopicFilter, setTemplateTopicFilter] = useState("")

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

      // Fetch test templates
      const templatesRes = await fetchWithAuth("http://localhost:5265/api/testtemplates", idToken)
      if (templatesRes.ok) {
        const templatesData = await templatesRes.json()
        setTemplates(templatesData)
      }

      // Fetch students
      const studentsRes = await fetchWithAuth("http://localhost:5265/api/students", idToken)
      if (studentsRes.ok) {
        const studentsData = await studentsRes.json()
        setStudents(studentsData)
      }
    } catch (err) {
      console.error("Failed to fetch tests:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTest = async (testId) => {
    if (!confirm("Are you sure you want to delete this test assignment?")) return

    try {
      const response = await fetchWithAuth(`http://localhost:5265/api/studenttests/${testId}`, idToken, {
        method: "DELETE",
      })

      if (response.ok) {
        setTests(tests.filter((t) => t.id !== testId))
      } else {
        alert("Failed to delete test assignment")
      }
    } catch (err) {
      console.error("Error deleting test:", err)
      alert("An error occurred while deleting the test")
    }
  }

  const handleDeleteTemplate = async (templateId) => {
    if (!confirm("Are you sure you want to delete this test template?")) return

    try {
      const response = await fetchWithAuth(`http://localhost:5265/api/testtemplates/${templateId}`, idToken, {
        method: "DELETE",
      })

      if (response.ok) {
        setTemplates(templates.filter((t) => t.id !== templateId))
      } else {
        alert("Failed to delete test template")
      }
    } catch (err) {
      console.error("Error deleting template:", err)
      alert("An error occurred while deleting the template")
    }
  }

  const getStatusIcon = (test) => {
    // Check if dateTaken is a valid date (not 1/1/1 or null)
    const isValidDate = test.dateTaken && new Date(test.dateTaken).getFullYear() > 1900
    if (isValidDate) {
      return test.passed ? (
        <CheckCircle className="w-5 h-5 text-green-500" />
      ) : (
        <XCircle className="w-5 h-5 text-red-500" />
      )
    } else {
      return <Clock className="w-5 h-5 text-yellow-500" />
    }
  }

  const getStatusText = (test) => {
    // Check if dateTaken is a valid date (not 1/1/1 or null)
    const isValidDate = test.dateTaken && new Date(test.dateTaken).getFullYear() > 1900
    if (isValidDate) {
      return test.passed ? "Passed" : "Failed"
    } else {
      return "Not Taken"
    }
  }

  const getStatusColor = (test) => {
    // Check if dateTaken is a valid date (not 1/1/1 or null)
    const isValidDate = test.dateTaken && new Date(test.dateTaken).getFullYear() > 1900
    if (isValidDate) {
      return test.passed ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100"
    } else {
      return "text-yellow-600 bg-yellow-100"
    }
  }

  const filteredTests = tests.filter((test) => {
    const matchesSearch =
      test.testTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.studentName?.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Check if dateTaken is a valid date (not 1/1/1 or null)
    const isValidDate = test.dateTaken && new Date(test.dateTaken).getFullYear() > 1900
    
    const matchesFilter =
      filterBy === "All" ||
      (filterBy === "Passed" && test.passed === true && isValidDate) ||
      (filterBy === "Failed" && test.passed === false && isValidDate) ||
      (filterBy === "Not Taken" && !isValidDate)
    return matchesSearch && matchesFilter
  })

  // Filter templates by subject and topic
  const filteredTemplates = templates.filter((template) => {
    const matchesSubject = templateSubjectFilter === "All" || template.subject === templateSubjectFilter
    const matchesTopic = !templateTopicFilter || template.topic?.toLowerCase().includes(templateTopicFilter.toLowerCase())
    return matchesSubject && matchesTopic
  })

  // Get unique subjects and topics for filter options
  const uniqueSubjects = [...new Set(templates.map(t => t.subject).filter(Boolean))]
  const uniqueTopics = [...new Set(templates.map(t => t.topic).filter(Boolean))]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">Loading tests...</span>
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
            <h1 className="text-3xl font-bold text-gray-900">Tests</h1>
            <p className="text-gray-600 mt-1">Manage and track test assignments</p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={() => setShowTemplateModal(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>Create Template</span>
            </button>
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>Assign Test</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <ClipboardList className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Tests</p>
                <p className="text-2xl font-bold text-gray-900">{tests.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Passed</p>
                <p className="text-2xl font-bold text-gray-900">{tests.filter((t) => t.passed === true).length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-red-100 rounded-xl">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-gray-900">{tests.filter((t) => t.passed === false).length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Not Taken</p>
                <p className="text-2xl font-bold text-gray-900">{tests.filter((t) => !t.dateTaken).length}</p>
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
              placeholder="Search tests or students..."
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
              <option value="All">All Status</option>
              <option value="Passed">Passed</option>
              <option value="Failed">Failed</option>
              <option value="Not Taken">Not Taken</option>
            </select>
          </div>
        </div>

        {/* Tests Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">All Tests</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Test</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Student</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Subject</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Date Taken</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Score</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTests.map((test) => (
                  <tr
                    key={test.id || `${test.studentName}-${test.testTitle}`}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <ClipboardList className="w-5 h-5 text-purple-500" />
                        <div>
                          <p className="font-medium text-gray-900">{test.testTitle}</p>
                          <p className="text-sm text-gray-500">{test.topic}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {test.studentName?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900">{test.studentName}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {test.subject}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {test.dateTaken ? new Date(test.dateTaken).toLocaleDateString() : "Not taken"}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(test)}
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(test)}`}
                        >
                          {getStatusText(test)}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">
                        {test.score !== null && test.score !== undefined ? `${Math.round(test.score)}%` : "Not graded"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedTest(test)
                            setShowEditModal(true)
                          }}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit Test"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTest(test.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Test"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTests.length === 0 && (
            <div className="text-center py-12">
              <ClipboardList className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No tests found</p>
            </div>
          )}
        </div>

        {/* Templates Section */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Test Templates</h2>
          </div>

          {/* Template Filters */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search templates by topic..."
                  value={templateTopicFilter}
                  onChange={(e) => setTemplateTopicFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={templateSubjectFilter}
                  onChange={(e) => setTemplateSubjectFilter(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white text-gray-900 min-w-48"
                >
                  <option value="All">All Subjects</option>
                  {uniqueSubjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Title</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Subject</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Topic</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTemplates.map((template) => (
                  <tr key={template.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <ClipboardList className="w-5 h-5 text-purple-500" />
                        <span className="font-medium text-gray-900">{template.title}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {template.subject}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">{template.topic}</span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedTemplate(template)
                            setShowTemplateModal(true)
                          }}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit Template"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTemplate(template.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Template"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <ClipboardList className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No templates found</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Test Modal */}
      <AddTestModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onTestAdded={() => {
          setShowAddModal(false)
          loadData()
        }}
        templates={templates}
        students={students}
        idToken={idToken}
      />

      {/* Edit Test Modal */}
      <EditTestModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setSelectedTest(null)
        }}
        test={selectedTest}
        onTestUpdated={() => {
          setShowEditModal(false)
          setSelectedTest(null)
          loadData()
        }}
        idToken={idToken}
      />

      {/* Template Modal */}
      <TestTemplateModal
        isOpen={showTemplateModal}
        onClose={() => {
          setShowTemplateModal(false)
          setSelectedTemplate(null)
        }}
        template={selectedTemplate}
        onTemplateSaved={() => {
          setShowTemplateModal(false)
          setSelectedTemplate(null)
          loadData()
        }}
        idToken={idToken}
      />
    </div>
  )
}

// Add Test Modal Component
function AddTestModal({ isOpen, onClose, onTestAdded, templates, students, idToken }) {
  const [formData, setFormData] = useState({
    studentId: "",
    testTemplateId: "",
    assignedDate: null,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        studentId: "",
        testTemplateId: "",
        assignedDate: null,
      })
      setError("")
      setLoading(false)
    }
  }, [isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetchWithAuth("http://localhost:5265/api/studenttests", idToken, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          studentId: parseInt(formData.studentId),
          testTemplateId: parseInt(formData.testTemplateId),
          assignedDate: formData.assignedDate ? formData.assignedDate.toISOString() : new Date().toISOString(),
        }),
      })

      if (response.ok) {
        onTestAdded()
      } else {
        setError("Failed to assign test. Please try again.")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Assign Test</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Student</label>
            <select
              required
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900"
            >
              <option value="" className="text-gray-900">Select a student</option>
              {students.map((student) => (
                <option key={student.id} value={student.id} className="text-gray-900">
                  {student.fullName} - Grade {student.grade}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Test Template</label>
            <select
              required
              value={formData.testTemplateId}
              onChange={(e) => setFormData({ ...formData, testTemplateId: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900"
            >
              <option value="" className="text-gray-900">Select a template</option>
              {templates.map((template) => (
                <option key={template.id} value={template.id} className="text-gray-900">
                  {template.title} - {template.subject}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Date</label>
            <DatePicker
              selected={formData.assignedDate}
              onChange={(date) => setFormData({ ...formData, assignedDate: date })}
              showTimeSelect
              dateFormat="Pp"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholderText="Select assigned date and time"
              isClearable
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Assigning..." : "Assign Test"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Edit Test Modal Component
function EditTestModal({ isOpen, onClose, test, onTestUpdated, idToken }) {
  const [formData, setFormData] = useState({
    dateTaken: null,
    score: "",
    passed: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (test) {
      setFormData({
        dateTaken: test.dateTaken ? new Date(test.dateTaken) : null,
        score: test.score?.toString() || "",
        passed: test.passed || false,
      })
    }
  }, [test])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetchWithAuth(`http://localhost:5265/api/studenttests/${test.id}`, idToken, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dateTaken: formData.dateTaken ? formData.dateTaken.toISOString() : null,
          score: formData.score ? parseFloat(formData.score) : null,
          passed: formData.passed,
        }),
      })

      if (response.ok) {
        onTestUpdated()
      } else {
        setError("Failed to update test. Please try again.")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !test) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Edit Test</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Test</label>
            <p className="text-gray-900 font-medium">{test.testTitle}</p>
            <p className="text-sm text-gray-500">Assigned to: {test.studentName}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Taken</label>
            <DatePicker
              selected={formData.dateTaken}
              onChange={(date) => setFormData({ ...formData, dateTaken: date })}
              showTimeSelect
              dateFormat="Pp"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholderText="Select date taken and time"
              isClearable
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Score (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={formData.score}
              onChange={(e) => setFormData({ ...formData, score: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900"
              placeholder="Enter score (0-100)"
            />
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.passed}
                onChange={(e) => setFormData({ ...formData, passed: e.target.checked })}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="text-sm font-medium text-gray-700">Passed</span>
            </label>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Updating..." : "Update Test"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Test Template Modal Component - Updated to restrict subject to Math or English
function TestTemplateModal({ isOpen, onClose, template, onTemplateSaved, idToken }) {
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    topic: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (template) {
      setFormData({
        title: template.title || "",
        subject: template.subject || "",
        topic: template.topic || "",
      })
    } else {
      setFormData({
        title: "",
        subject: "",
        topic: "",
      })
    }
  }, [template])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const url = template 
        ? `http://localhost:5265/api/testtemplates/${template.id}`
        : "http://localhost:5265/api/testtemplates"
      
      const method = template ? "PUT" : "POST"
      
      const response = await fetchWithAuth(url, idToken, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        onTemplateSaved()
        if (!template) {
          setFormData({ title: "", subject: "", topic: "" })
        }
      } else {
        setError(`Failed to ${template ? 'update' : 'create'} template. Please try again.`)
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {template ? "Edit Template" : "Create Template"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900"
              placeholder="Enter test title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <select
              required
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
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
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900"
              placeholder="Enter topic"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (template ? "Updating..." : "Creating...") : (template ? "Update Template" : "Create Template")}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
