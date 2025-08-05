// RootLayout.tsx
import './globals.css'
import Link from 'next/link'
import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import Script from 'next/script'
import { Menu } from 'lucide-react'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FanconnectHQ - Just Football Things',
  description: 'Shop, rate players, vote man of the match — the football fan hub.',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies()
  const token = (await cookieStore).get('token')?.value
  const isLoggedIn = !!token

  return (
    <html lang="en">
      {/* More vibrant background gradient for the entire body */}
      <body className={`${inter.className} bg-gradient-to-br from-blue-50 to-emerald-50 text-gray-900`}>
        <nav className="flex justify-between items-center px-4 py-3 bg-white shadow-lg sticky top-0 z-50 w-full transition-shadow duration-300">
          {/* Logo/Brand Name with a subtle blue-to-green text gradient */}
          <h1 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-green-500">
            <Link href="/" className="hover:opacity-80 transition-opacity">FanconnectHQ</Link>
          </h1>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8 text-base font-medium w-full justify-end">
            {/* Links with a more vibrant hover effect */}
            <Link href="/shop" className="hover:text-blue-700 transition-colors duration-200">Shop</Link>
            <Link href="/matchday" className="hover:text-emerald-600 transition-colors duration-200">Matchday</Link>
            <Link href="/live" className="hover:text-red-500 transition-colors duration-200">Live</Link>
            <Link href="/stats" className="hover:text-orange-500 transition-colors duration-200">Stats</Link>
            <Link href="/blogs" className="hover:text-purple-600 transition-colors duration-200">Blogs</Link>

            {isLoggedIn ? (
              <>
                <Link href="/profile" className="hover:text-blue-700 transition-colors duration-200">Profile</Link>
                <form action="/api/auth/logout" method="POST">
                  <button className="text-white bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 px-4 py-2 rounded-md text-sm font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg">
                    Logout
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-blue-700 transition-colors duration-200">Login</Link>
                <Link
                  href="/register"
                  // Register button with a more intense radiant gradient and shadow
                  className="text-white bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-emerald-600 px-4 py-2 rounded-md text-sm font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile navigation dropdown */}
          <div className="md:hidden relative">
            <input type="checkbox" id="mobile-menu-toggle" className="hidden peer" />
            <label htmlFor="mobile-menu-toggle" className="cursor-pointer p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
              <Menu className="w-7 h-7 text-gray-700 hover:text-blue-600 transition-colors" />
            </label>

            {/* Dropdown Menu - with a stronger shadow and improved link styling */}
            <div className="absolute right-0 mt-2 w-48 sm:w-60 bg-white border border-gray-200 rounded-lg shadow-xl p-4 space-y-3 hidden peer-checked:block z-50 animate-fade-in-down">
              <Link href="/shop" className="block text-base py-1 hover:text-blue-700 transition-colors">Shop</Link>
              <Link href="/matchday" className="block text-base py-1 hover:text-emerald-600 transition-colors">Matchday</Link>
              <Link href="/live" className="block text-base py-1 hover:text-red-500 transition-colors">Live</Link>
              <Link href="/stats" className="block text-base py-1 hover:text-orange-500 transition-colors">Stats</Link>
              <Link href="/blogs" className="block text-base py-1 hover:text-purple-600 transition-colors">Blogs</Link>

              {isLoggedIn ? (
                <>
                  <Link href="/profile" className="block text-base py-1 hover:text-blue-700 transition-colors">Profile</Link>
                  <form action="/api/auth/logout" method="POST">
                    <button className="block w-full text-left text-base text-red-600 hover:text-red-700 py-1 transition-colors">
                      Logout
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/login" className="block text-base py-1 hover:text-blue-700 transition-colors">Login</Link>
                  <Link
                    href="/register"
                    // Mobile register button with the gradient and shadow
                    className="block w-full text-center text-white bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-emerald-600 px-3 py-2 rounded-md text-base font-semibold mt-2 transition-all duration-300 ease-in-out shadow-md"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>

        <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>

        <footer className="text-center py-6 text-sm text-gray-600 bg-gray-100 mt-10 border-t border-gray-200">
          &copy; {new Date().getFullYear()} FanconnectHQ. All rights reserved.
        </footer>

        <Script
          src="https://example.com/your-script.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  )
}