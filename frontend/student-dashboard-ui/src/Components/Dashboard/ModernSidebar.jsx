"use client"

import { NavLink } from "react-router-dom"
import { Home, Users, FileText, BarChart3, BookOpen, ClipboardList, LogOut, GraduationCap, TrendingUp } from "lucide-react"

export default function ModernSidebar({ onLogout }) {
  const navItems = [
    { to: "/", icon: Home, label: "Dashboard", end: true },
    { to: "/students", icon: Users, label: "Students" },
    { to: "/worksheets", icon: FileText, label: "Worksheets" },
    { to: "/tests", icon: ClipboardList, label: "Tests" },
    { to: "/reports", icon: TrendingUp, label: "Reports" },
    { to: "/progress", icon: BarChart3, label: "Progress" },
  ]

  const navItemStyle = ({ isActive }) =>
    `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      isActive ? "bg-white text-purple-600 shadow-lg" : "text-white/80 hover:bg-white/10 hover:text-white"
    }`

  return (
    <aside className="w-64 bg-gradient-to-b from-purple-600 to-purple-800 text-white shadow-2xl flex flex-col h-screen fixed left-0 top-0 z-50">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-xl">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">GREAT</h1>
            <p className="text-purple-200 text-xs">Teacher Dashboard</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={navItemStyle}>
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Logout Button - Clean and minimal */}
      <div className="mt-auto p-6">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 text-sm"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
