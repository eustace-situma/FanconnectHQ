import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { redirect } from 'next/navigation'
import { connectToDB } from '@/lib/mongodb'
import User from '@/models/user'

export default async function ProfilePage() {
  const cookieStore = await cookies() // ✅ Await here
  const token = cookieStore.get('token')?.value

  if (!token) return redirect('/login')

  let decoded: any

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!)
  } catch (err) {
    return redirect('/login')
  }

  await connectToDB()
  const user = await User.findById(decoded.userId).select('-password')

  if (!user) return redirect('/login')

  return (
    <div className="max-w-xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">Your Profile</h1>
      <div className="space-y-3 text-gray-800 text-sm">
        <p><span className="font-semibold">Username:</span> {user.username}</p>
        <p><span className="font-semibold">Email:</span> {user.email}</p>
      </div>
    </div>
  )
}
