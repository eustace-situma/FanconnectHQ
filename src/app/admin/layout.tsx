// app/admin/layout.tsx
import Link from 'next/link'
import { ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col p-6 space-y-4">
        <h1 className="text-2xl font-bold">FanconnectHQ Admin</h1>

        <nav className="flex flex-col space-y-2">
          <Link href="/admin" className="hover:bg-gray-800 rounded p-2">
            Dashboard
          </Link>

          {/* Games */}
          <div>
            <Link href="/admin/games" className="hover:bg-gray-800 rounded p-2 block">
              Matchday Games
            </Link>
            <Link
              href="/admin/games/create"
              className="hover:bg-gray-800 rounded p-2 text-sm ml-4 block"
            >
              + Add Game
            </Link>
          </div>

          {/* Teams */}
          <div>
            <Link href="/admin/teams" className="hover:bg-gray-800 rounded p-2 block">
              Teams
            </Link>
            <Link
              href="/admin/teams/create"
              className="hover:bg-gray-800 rounded p-2 text-sm ml-4 block"
            >
              + Add Team
            </Link>
          </div>

          <Link href="/admin/settings" className="hover:bg-gray-800 rounded p-2">
            Settings
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-10 bg-gray-100">
        {children}
        <Toaster position="top-right" />
      </main>
    </div>
  )
}
