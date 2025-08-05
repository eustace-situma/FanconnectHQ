import { NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongodb'
import Game from '@/models/game'

export async function POST(req: Request) {
  try {
    await connectToDB()

    const data = await req.json()
    const game = await Game.create(data)

    return NextResponse.json({ success: true, game })
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 })
  }
}
