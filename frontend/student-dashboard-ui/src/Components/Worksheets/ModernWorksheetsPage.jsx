"use client"

import React, { useEffect, useState } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { fetchWithAuth } from "../../utils/fetchWithAuth"
import { FileText, Search, Filter, Plus, Calendar, CheckCircle, Clock, AlertCircle, Edit, Trash2, X } from "lucide-react"

export default function ModernWorksheetsPage({ idToken }) {
  const [worksheets, setWorksheets] = useState([])
  const [templates, setTemplates] = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterBy, setFilterBy] = useState("All")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [selectedWorksheet, setSelectedWorksheet] = useState(null)
  const [selectedTemplate, setSelectedTemplate] = useState(null)

  useEffect(() => {
    loadData()
  }, [idToken])

  const loadData = async () => {
    try {
      setLoading(true)

      // Fetch all worksheets
      const worksheetsRes = await fetchWithAuth("http://localhost:5265/api/studentworksheets", idToken)
      if (worksheetsRes.ok) {
        const worksheetsData = await worksheetsRes.json()
        setWorksheets(worksheetsData)
      }

      // Fetch worksheet templates
      const templatesRes = await fetchWithAuth("http://localhost:5265/api/worksheettemplates", idToken)
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
      console.error("Failed to fetch worksheets:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteWorksheet = async (worksheetId) => {
    if (!confirm("Are you sure you want to delete this worksheet assignment?")) return

    try {
      const response = await fetchWithAuth(`http://localhost:5265/api/studentworksheets/${worksheetId}`, idToken, {
        method: "DELETE",
      })

      if (response.ok) {
        setWorksheets(worksheets.filter((w) => w.id !== worksheetId))
      } else {
        alert("Failed to delete worksheet assignment")
      }
    } catch (err) {
      console.error("Error deleting worksheet:", err)
      alert("An error occurred while deleting the worksheet")
    }
  }

  const handleDeleteTemplate = async (templateId) => {
    if (!confirm("Are you sure you want to delete this worksheet template?")) return

    try {
      const response = await fetchWithAuth(`http://localhost:5265/api/worksheettemplates/${templateId}`, idToken, {
        method: "DELETE",
      })

      if (response.ok) {
        setTemplates(templates.filter((t) => t.id !== templateId))
      } else {
        alert("Failed to delete worksheet template")
      }
    } catch (err) {
      console.error("Error deleting template:", err)
      alert("An error occurred while deleting the template")
    }
  }

  const getStatusIcon = (worksheet) => {
    if (worksheet.submittedDate) {
      return <CheckCircle className="w-5 h-5 text-green-500" />
    } else if (worksheet.dueDate && new Date(worksheet.dueDate) < new Date()) {
      return <AlertCircle className="w-5 h-5 text-red-500" />
    } else {
      return <Clock className="w-5 h-5 text-yellow-500" />
    }
  }

  const getStatusText = (worksheet) => {
    if (worksheet.submittedDate) {
      return "Completed"
    } else if (worksheet.dueDate && new Date(worksheet.dueDate) < new Date()) {
      return "Overdue"
    } else {
      return "Pending"
    }
  }

  const getStatusColor = (worksheet) => {
    if (worksheet.submittedDate) {
      return "text-green-600 bg-green-100"
    } else if (worksheet.dueDate && new Date(worksheet.dueDate) < new Date()) {
      return "text-red-600 bg-red-100"
    } else {
      return "text-yellow-600 bg-yellow-100"
    }
  }

  const filteredWorksheets = worksheets.filter((worksheet) => {
    const matchesSearch =
      worksheet.worksheetTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worksheet.studentName?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter =
      filterBy === "All" ||
      (filterBy === "Completed" && worksheet.submittedDate) ||
      (filterBy === "Pending" &&
        !worksheet.submittedDate &&
        (!worksheet.dueDate || new Date(worksheet.dueDate) >= new Date())) ||
      (filterBy === "Overdue" &&
        !worksheet.submittedDate &&
        worksheet.dueDate &&
        new Date(worksheet.dueDate) < new Date())
    return matchesSearch && matchesFilter
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">Loading worksheets...</span>
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
            <h1 className="text-3xl font-bold text-gray-900">Worksheets</h1>
            <p className="text-gray-600 mt-1">Manage and track worksheet assignments</p>
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
              <span>Assign Worksheet</span>
            </button>
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
                <p className="text-sm text-gray-600">Total Worksheets</p>
                <p className="text-2xl font-bold text-gray-900">{worksheets.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{worksheets.filter((w) => w.submittedDate).length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    worksheets.filter((w) => !w.submittedDate && (!w.dueDate || new Date(w.dueDate) >= new Date()))
                      .length
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-red-100 rounded-xl">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {worksheets.filter((w) => !w.submittedDate && w.dueDate && new Date(w.dueDate) < new Date()).length}
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
              placeholder="Search worksheets or students..."
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
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </div>

        {/* Worksheets Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">All Worksheets</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Worksheet</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Student</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Subject</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Assigned Date</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Score</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredWorksheets.map((worksheet) => (
                  <tr key={worksheet.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="font-medium text-gray-900">{worksheet.worksheetTitle}</p>
                          <p className="text-sm text-gray-500">{worksheet.topic}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {worksheet.studentName?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900">{worksheet.studentName}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {worksheet.subject}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {new Date(worksheet.assignedDate).toLocaleDateString()}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(worksheet)}
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(worksheet)}`}
                        >
                          {getStatusText(worksheet)}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">
                        {worksheet.score ? `${Math.round(worksheet.score)}%` : "Not graded"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedWorksheet(worksheet)
                            setShowEditModal(true)
                          }}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit Worksheet"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteWorksheet(worksheet.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Worksheet"
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

          {filteredWorksheets.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No worksheets found</p>
            </div>
          )}
        </div>

        {/* Templates Section */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Worksheet Templates</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Title</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Subject</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Topic</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Difficulty</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {templates.map((template) => (
                  <tr key={template.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-blue-500" />
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
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        template.difficulty === 'Easy' 
                          ? 'bg-green-100 text-green-800' 
                          : template.difficulty === 'Medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : template.difficulty === 'Hard'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {template.difficulty}
                      </span>
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

          {templates.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No templates found</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Worksheet Modal */}
      <AddWorksheetModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onWorksheetAdded={() => {
          setShowAddModal(false)
          loadData()
        }}
        templates={templates}
        students={students}
        idToken={idToken}
      />

      {/* Edit Worksheet Modal */}
      <EditWorksheetModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setSelectedWorksheet(null)
        }}
        worksheet={selectedWorksheet}
        onWorksheetUpdated={() => {
          setShowEditModal(false)
          setSelectedWorksheet(null)
          loadData()
        }}
        idToken={idToken}
      />

      {/* Template Modal */}
      <WorksheetTemplateModal
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

// Add Worksheet Modal Component
function AddWorksheetModal({ isOpen, onClose, onWorksheetAdded, templates, students, idToken }) {
  const [formData, setFormData] = useState({
    studentId: "",
    worksheetTemplateId: "",
    dueDate: null,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        studentId: "",
        worksheetTemplateId: "",
        dueDate: null,
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
      const response = await fetchWithAuth("http://localhost:5265/api/studentworksheets", idToken, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          studentId: parseInt(formData.studentId),
          worksheetTemplateId: parseInt(formData.worksheetTemplateId),
          dueDate: formData.dueDate ? formData.dueDate.toISOString() : null,
        }),
      })

      if (response.ok) {
        onWorksheetAdded()
      } else {
        setError("Failed to assign worksheet. Please try again.")
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
          <h2 className="text-2xl font-bold text-gray-900">Assign Worksheet</h2>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Worksheet Template</label>
            <select
              required
              value={formData.worksheetTemplateId}
              onChange={(e) => setFormData({ ...formData, worksheetTemplateId: e.target.value })}
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Due Date (Optional)</label>
            <DatePicker
              selected={formData.dueDate}
              onChange={(date) => setFormData({ ...formData, dueDate: date })}
              showTimeSelect
              dateFormat="Pp"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholderText="Select due date and time"
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
              {loading ? "Assigning..." : "Assign Worksheet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Edit Worksheet Modal Component
function EditWorksheetModal({ isOpen, onClose, worksheet, onWorksheetUpdated, idToken }) {
  const [formData, setFormData] = useState({
    submittedDate: null,
    score: "",
    dueDate: null,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (worksheet) {
      setFormData({
        submittedDate: worksheet.submittedDate ? new Date(worksheet.submittedDate) : null,
        score: worksheet.score?.toString() || "",
        dueDate: worksheet.dueDate ? new Date(worksheet.dueDate) : null,
      })
    }
  }, [worksheet])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetchWithAuth(`http://localhost:5265/api/studentworksheets/${worksheet.id}`, idToken, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          submittedDate: formData.submittedDate ? formData.submittedDate.toISOString() : null,
          score: formData.score ? parseFloat(formData.score) : null,
          dueDate: formData.dueDate ? formData.dueDate.toISOString() : null,
        }),
      })

      if (response.ok) {
        onWorksheetUpdated()
      } else {
        setError("Failed to update worksheet. Please try again.")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !worksheet) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Edit Worksheet</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Worksheet</label>
            <p className="text-gray-900 font-medium">{worksheet.worksheetTitle}</p>
            <p className="text-sm text-gray-500">Assigned to: {worksheet.studentName}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Submitted Date</label>
            <DatePicker
              selected={formData.submittedDate}
              onChange={(date) => setFormData({ ...formData, submittedDate: date })}
              showTimeSelect
              dateFormat="Pp"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholderText="Select submission date and time"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
            <DatePicker
              selected={formData.dueDate}
              onChange={(date) => setFormData({ ...formData, dueDate: date })}
              showTimeSelect
              dateFormat="Pp"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholderText="Select due date and time"
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
              {loading ? "Updating..." : "Update Worksheet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Worksheet Template Modal Component
function WorksheetTemplateModal({ isOpen, onClose, template, onTemplateSaved, idToken }) {
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    topic: "",
    difficulty: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (template) {
      setFormData({
        title: template.title || "",
        subject: template.subject || "",
        topic: template.topic || "",
        difficulty: template.difficulty || "",
      })
    } else {
      setFormData({
        title: "",
        subject: "",
        topic: "",
        difficulty: "",
      })
    }
  }, [template])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const url = template 
        ? `http://localhost:5265/api/worksheettemplates/${template.id}`
        : "http://localhost:5265/api/worksheettemplates"
      
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
          setFormData({ title: "", subject: "", topic: "", difficulty: "" })
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
              placeholder="Enter worksheet title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <input
              type="text"
              required
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900"
              placeholder="Enter subject (e.g., Math, Science)"
            />
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
            <select
              required
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900"
            >
              <option value="" className="text-gray-900">Select difficulty</option>
              <option value="Easy" className="text-gray-900">Easy</option>
              <option value="Medium" className="text-gray-900">Medium</option>
              <option value="Hard" className="text-gray-900">Hard</option>
            </select>
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
