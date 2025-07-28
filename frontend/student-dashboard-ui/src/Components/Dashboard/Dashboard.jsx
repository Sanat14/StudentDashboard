"use client"

import { LogOut, Users, GraduationCap } from "lucide-react"

export default function Dashboard({ students, onLogout }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-purple-600 rounded-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Teacher Dashboard</h1>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, Teacher!</h2>
          <p className="text-gray-600">Here's an overview of your students.</p>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Total Students</h3>
              <p className="text-3xl font-bold text-purple-600">{students.length}</p>
            </div>
          </div>
        </div>

        {/* Students List */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Student List</h3>
          </div>
          <div className="p-6">
            {students.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No students found</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {students.map((student, index) => (
                  <div
                    key={student.id}
                    className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full">
                      <span className="text-purple-600 font-semibold">{student.fullName.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{student.fullName}</p>
                      <p className="text-sm text-gray-500">Student #{index + 1}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
