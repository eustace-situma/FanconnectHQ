import { NextRequest, NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongodb'
import Game from '@/models/game'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDB()

  try {
    const game = await Game.findById(params.id)
    if (!game) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    return NextResponse.json({ game })
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
