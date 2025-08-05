// /src/app/api/matchday/ratings/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongodb'
import Matchday from '@/models/matchday'

export async function POST(req: NextRequest) {
  await connectToDB()
  try {
    const { gameId, ratings, momVote } = await req.json()

    if (!gameId || !momVote || !ratings || typeof ratings !== 'object') {
      return NextResponse.json({ success: false, error: 'Invalid data' }, { status: 400 })
    }

    await Matchday.create({ gameId, ratings, momVote })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[RATINGS ERROR]', err)
    return NextResponse.json({ success: false, error: 'Failed to save ratings' }, { status: 500 })
  }
}
