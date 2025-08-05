import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import User from '@/models/user'
import { connectToDB } from '@/lib/mongodb'

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json()

    if (!username || !email || !password) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }

    await connectToDB()

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: 'Email is already registered.' }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      isVerified: false, // You can update this if you implement email verification
    })

    await newUser.save()

    return NextResponse.json({ message: 'User registered successfully.' }, { status: 201 })
  } catch (error) {
    console.error('[REGISTER_ERROR]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
