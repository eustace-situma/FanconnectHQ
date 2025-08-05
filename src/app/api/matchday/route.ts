// /src/app/api/matchday/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongodb'
import Game from '@/models/game'

export async function GET(req: NextRequest) {
  await connectToDB()

  try {
    const games = await Game.find().sort({ gameDate: 1, gameTime: 1 })

    return NextResponse.json({
      success: true,
      games: games.map(g => ({
        _id: g._id,
        league: g.league,
        homeTeam: g.homeTeam,
        awayTeam: g.awayTeam,
        gameTime: g.gameTime,
        hot: g.hot,
        status: g.status,
      })),
    })
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch matchday games.' },
      { status: 500 }
    )
  }
}
