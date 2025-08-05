import { NextResponse } from 'next/server'

export async function POST() {
  // Create a redirect response
  const response = NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'))

  // Clear the 'token' cookie
  response.cookies.set('token', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    expires: new Date(0),
  })

  return response
}
