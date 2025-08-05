import { NextRequest, NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongodb'
import Game from '@/models/game'

// GET: fetch all games
export async function GET() {
  await connectToDB()
  try {
    // custom sort: EPL → La Liga → UCL → others, then by date/time
    const leagueOrder = ['EPL', 'La Liga', 'UCL']

    const games = await Game.find().lean()
    games.sort((a: any, b: any) => {
      const aIndex = leagueOrder.indexOf(a.league)
      const bIndex = leagueOrder.indexOf(b.league)
      if (aIndex !== bIndex) return aIndex - bIndex
      if (a.gameDate !== b.gameDate) return a.gameDate.localeCompare(b.gameDate)
      return a.gameTime.localeCompare(b.gameTime)
    })

    return NextResponse.json({ success: true, games })
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to fetch games' }, { status: 500 })
  }
}

// PUT: update gameDate, gameTime, status, and optionally FT scores
export async function PUT(req: NextRequest) {
  await connectToDB()

  try {
    const { id, gameDate, gameTime, status, homeScore, awayScore, hot } = await req.json()

    const updateData: any = {
      gameDate,
      gameTime,
      status,
      hot,  // ✅ new field
    }

    if (status === 'finished') {
      updateData.homeScore = parseInt(homeScore)
      updateData.awayScore = parseInt(awayScore)
    } else {
      updateData.homeScore = undefined
      updateData.awayScore = undefined
    }

    const updatedGame = await Game.findByIdAndUpdate(id, updateData, { new: true })

    if (!updatedGame) {
      return NextResponse.json({ success: false, error: 'Game not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, game: updatedGame })
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to update game' }, { status: 500 })
  }
}
