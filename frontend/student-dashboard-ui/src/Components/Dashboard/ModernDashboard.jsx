import { Routes, Route } from "react-router-dom"
import ModernDashboardHome from "../Dashboard/ModernDashboardHome"
import ModernStudentsPage from "../Students/ModernStudentsPage"
import ModernStudentDetailsPage from "../Students/ModernStudentDetailsPage"
import ModernWorksheetsPage from "../Worksheets/ModernWorksheetsPage"
import ModernTestsPage from "../Tests/ModernTestsPage"
import ModernReportsPage from "../Reports/ModernReportsPage"
import ModernSidebar from "./ModernSidebar"

export default function ModernDashboard({ idToken, onLogout }) {
  return (
    <div className="h-screen bg-gray-50 overflow-hidden">
      <ModernSidebar onLogout={onLogout} />
      <main className="overflow-y-auto bg-gray-50 h-screen" style={{ marginLeft: '16rem', width: 'calc(100vw - 16rem)' }}>
        <Routes>
          <Route path="/" element={<ModernDashboardHome idToken={idToken} />} />
          <Route path="/students" element={<ModernStudentsPage idToken={idToken} />} />
          <Route path="/students/:id" element={<ModernStudentDetailsPage idToken={idToken} />} />
          <Route path="/worksheets" element={<ModernWorksheetsPage idToken={idToken} />} />
          <Route path="/tests" element={<ModernTestsPage idToken={idToken} />} />
          <Route path="/reports" element={<ModernReportsPage idToken={idToken} />} />
        </Routes>
      </main>
    </div>
  )
}
