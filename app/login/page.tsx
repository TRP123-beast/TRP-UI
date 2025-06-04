"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Eye, EyeOff, Key } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function LoginPage() {
  const router = useRouter()
  const [activeView, setActiveView] = useState<"signup" | "login" | "forgot">("signup")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  // Form states
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
  })

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  })

  const [forgotForm, setForgotForm] = useState({
    email: "",
  })

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would send the signup data to your backend
    console.log("Signup with:", signupForm)
    router.push("/")
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would authenticate with your backend
    console.log("Login with:", loginForm, "Remember me:", rememberMe)
    router.push("/")
  }

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would send a password reset email
    console.log("Reset password for:", forgotForm.email)
    alert(`Password reset link sent to ${forgotForm.email}`)
    setActiveView("login")
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="p-4 flex justify-between items-center bg-futuristic-darker border-b border-futuristic-light/20">
        <div>
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/TRP%20Logo-3ydAc5tBUCO0lbj7kiIrCEoYebKQVt.png"
            alt="The Rental Project Logo"
            width={120}
            height={40}
            className="h-10 w-auto"
          />
        </div>
        <Button
          variant="outline"
          className="rounded-full px-6 border-futuristic-light text-futuristic-light"
          onClick={() => setActiveView("signup")}
        >
          Signup
        </Button>
      </header>

      {/* Background Image */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white z-10"></div>
        <Image
          src="/placeholder.svg?height=1080&width=1920"
          alt="Background"
          fill
          className="object-cover opacity-50"
        />
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex justify-center items-center min-h-[calc(100vh-80px)]">
        {/* Signup Form */}
        {activeView === "signup" && (
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md mx-4">
            <h1 className="text-2xl font-bold text-center mb-2">Create an account</h1>
            <p className="text-gray-500 text-center mb-6">Start your 30-day free trial.</p>

            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name*
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Smith"
                  value={signupForm.name}
                  onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email*
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="johnsmith@gmail.com"
                  value={signupForm.email}
                  onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password*
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••"
                    value={signupForm.password}
                    onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-futuristic-light text-futuristic-darker hover:bg-futuristic-light/90"
              >
                Get started
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  className="text-futuristic-light hover:underline font-medium"
                  onClick={() => setActiveView("login")}
                >
                  Log in
                </button>
              </p>
            </div>
          </div>
        )}

        {/* Login Form */}
        {activeView === "login" && (
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md mx-4">
            <h1 className="text-2xl font-bold text-center mb-6">Log in to your account</h1>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email*
                </label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="johnsmith@gmail.com"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password*
                </label>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-teal-500 focus:ring-teal-400 border-gray-300 rounded"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <button
                  type="button"
                  className="text-sm text-teal-600 hover:underline"
                  onClick={() => setActiveView("forgot")}
                >
                  Forgot Password
                </button>
              </div>

              <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-600 text-white">
                Sign In
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <button className="text-teal-600 hover:underline font-medium" onClick={() => setActiveView("signup")}>
                  Sign up
                </button>
              </p>
            </div>
          </div>
        )}

        {/* Forgot Password Form */}
        {activeView === "forgot" && (
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md mx-4">
            <div className="text-center mb-6">
              <div className="mx-auto w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                <Key className="h-6 w-6 text-teal-500" />
              </div>
              <h1 className="text-2xl font-bold mt-4">Forgot password?</h1>
            </div>

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email*
                </label>
                <Input
                  id="forgot-email"
                  type="email"
                  placeholder="johnsmith@gmail.com"
                  value={forgotForm.email}
                  onChange={(e) => setForgotForm({ ...forgotForm, email: e.target.value })}
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-600 text-white">
                Reset Password
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button className="text-sm text-teal-600 hover:underline" onClick={() => setActiveView("login")}>
                Back to login
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
