'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    })

    const data = await res.json()
    setMessage(data.message || 'Something went wrong.')
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Branding Placeholder */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 p-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold text-blue-700">FanconnectHQ</h1>
          <p className="text-gray-600 text-base max-w-sm mx-auto">
            Welcome to the ultimate football fan zone. 
            <br />Customize this space later with your brand’s logo, tagline, or animation.
          </p>
        </div>
      </div>

      {/* Right Side Form */}
      <div className="flex w-full md:w-1/2 items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-blue-700">Create Account</h2>
            <p className="text-sm text-gray-600 mt-2">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 hover:underline">
                Sign In
              </Link>
            </p>
          </div>

          {/* Social Logins */}
          <div className="flex gap-4 justify-center">
            <button className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-100 transition w-full justify-center">
              <img src="/google-icon.svg" alt="Google" className="w-5 h-5" />
              <span className="text-sm font-medium text-gray-700">Sign up with Google</span>
            </button>
            <button className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-100 transition w-full justify-center">
              <img src="/facebook-icon.svg" alt="Facebook" className="w-5 h-5" />
              <span className="text-sm font-medium text-gray-700">Facebook</span>
            </button>
          </div>

          <div className="relative my-4 text-center">
            <span className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 border-t border-gray-300"></span>
            <span className="relative px-4 text-gray-500 bg-white text-sm">or</span>
          </div>

          {/* Registration Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                id="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-green-500 text-white py-2 rounded-md text-sm font-semibold hover:from-blue-700 hover:to-green-600 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Register
            </button>
          </form>

          {/* Success/Error Message */}
          {message && (
            <p
              className={`text-center text-sm mt-2 ${
                message.toLowerCase().includes('success')
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
