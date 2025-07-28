"use client"

import { useState } from "react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../../firebaseConfig"
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react"

export default function ModernLoginForm({ onLogin }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      const token = await user.getIdTokenResult()

      if (token.claims.role !== "teacher") {
        setError("Access denied. Only teachers can log in.")
        setIsLoading(false)
        return
      }

      onLogin(token.token)
    } catch (err) {
      setError("Login failed. Please check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-purple-400 via-purple-500 to-purple-800">
        {/* Animated clouds */}
        <div className="absolute top-10 left-10 w-32 h-16 bg-white/10 rounded-full blur-sm animate-pulse"></div>
        <div className="absolute top-20 right-20 w-24 h-12 bg-white/10 rounded-full blur-sm animate-pulse delay-1000"></div>
        <div className="absolute top-32 left-1/3 w-28 h-14 bg-white/10 rounded-full blur-sm animate-pulse delay-500"></div>

        {/* Mountain silhouettes */}
        <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-purple-900/80 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1200 300" className="w-full h-64 fill-purple-900/60">
            <path d="M0,300 L0,200 L200,100 L400,150 L600,80 L800,120 L1000,60 L1200,100 L1200,300 Z" />
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1200 250" className="w-full h-48 fill-purple-900/80">
            <path d="M0,250 L0,180 L150,120 L350,140 L550,90 L750,110 L950,70 L1200,90 L1200,250 Z" />
          </svg>
        </div>

        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white/40 rounded-full animate-bounce delay-700"></div>
        <div className="absolute top-1/2 left-1/5 w-1.5 h-1.5 bg-white/20 rounded-full animate-bounce delay-1000"></div>
      </div>

      {/* Login Form */}
      <div className="relative z-10 flex items-center justify-center min-h-full w-full p-4">
        <div className="w-full max-w-md mx-auto">
          <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
              <p className="text-white/70">Sign in to your teacher account</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
                <p className="text-red-200 text-sm text-center">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Input */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-white/90 text-sm font-medium">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-white/90 text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/70 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-white text-purple-600 rounded-xl font-semibold hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-purple-600/30 border-t-purple-600 rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
