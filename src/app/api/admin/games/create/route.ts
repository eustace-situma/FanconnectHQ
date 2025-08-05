import { NextRequest, NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongodb'
import Game from '@/models/game'

export async function POST(req: NextRequest) {
  await connectToDB()

  try {
    const {
      league,
      homeTeam,
      awayTeam,
      homePlayers,
      awayPlayers,
      gameDate,
      gameTime,
    } = await req.json()

    if (
      !league ||
      !homeTeam ||
      !awayTeam ||
      !gameDate ||
      !gameTime ||
      homeTeam === awayTeam
    ) {
      return NextResponse.json({ success: false, error: 'Invalid game data' }, { status: 400 })
    }

    const newGame = await Game.create({
      league,
      homeTeam,
      awayTeam,
      homePlayers,
      awayPlayers,
      gameDate,
      gameTime,
    })

    return NextResponse.json({ success: true, game: newGame }, { status: 201 })
  } catch (error) {
    console.error('[CREATE_GAME_ERROR]', error)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}
