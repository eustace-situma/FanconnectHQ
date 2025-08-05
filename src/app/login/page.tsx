'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()

    if (res.ok) {
      setMessageType('success')
      setMessage('Login successful! Redirecting...')
      // Optionally redirect
      setTimeout(() => window.location.href = '/', 1500)
    } else {
      setMessageType('error')
      setMessage(data.error || 'Something went wrong.')
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Branding */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 p-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold text-blue-700">FanconnectHQ</h1>
          <p className="text-gray-600 text-base max-w-sm mx-auto">
            Back again? Let’s connect you to matchday magic.
            <br />Customize this space with animation or logo later.
          </p>
        </div>
      </div>

      {/* Right Form */}
      <div className="flex w-full md:w-1/2 items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-blue-700">Sign In</h2>
            <p className="text-sm text-gray-600 mt-2">
              New here?{' '}
              <Link href="/register" className="text-blue-600 hover:underline">
                Create an account
              </Link>
            </p>
          </div>

          {/* Alert */}
          {message && (
            <div
              className={`text-sm rounded-md px-4 py-2 ${
                messageType === 'success'
                  ? 'bg-green-100 text-green-700 border border-green-300'
                  : 'bg-red-100 text-red-700 border border-red-300'
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
