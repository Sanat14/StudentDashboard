"use client"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useState, useEffect } from "react"
import ModernLoginForm from "./Components/Auth/LoginForm"
import ModernDashboard from "./Components/Dashboard/ModernDashboard"

function App() {
  const [idToken, setIdToken] = useState(() => localStorage.getItem("idToken"))

  useEffect(() => {
    if (idToken) {
      localStorage.setItem("idToken", idToken)
    } else {
      localStorage.removeItem("idToken")
    }
  }, [idToken])

  return (
    <Router>
      {!idToken ? (
        <ModernLoginForm onLogin={(token) => setIdToken(token)} />
      ) : (
        <Routes>
          <Route path="/*" element={<ModernDashboard idToken={idToken} onLogout={() => setIdToken(null)} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </Router>
  )
}

export default App
