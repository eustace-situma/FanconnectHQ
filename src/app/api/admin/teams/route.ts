import { NextRequest, NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongodb'
import Team from '@/models/team'

// GET: Return all teams grouped by league
export async function GET() {
  await connectToDB()

  try {
    const teams = await Team.find()

    // Group teams by league and sort
    const grouped: Record<string, any[]> = {}
    teams.forEach((team) => {
      const league = team.league || 'Unknown'
      if (!grouped[league]) grouped[league] = []
      grouped[league].push(team)
    })

    // Sort leagues & teams alphabetically
    Object.keys(grouped).forEach((league) => {
      grouped[league].sort((a, b) => a.name.localeCompare(b.name))
    })

    return NextResponse.json({ success: true, grouped })
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to fetch teams' }, { status: 500 })
  }
}

// PUT: Add player, Edit player, Delete player
export async function PUT(req: NextRequest) {
  await connectToDB()

  try {
    const {
      teamId,
      newPlayer,         // { name, position }
      oldPlayerName,     // For renaming
      newPlayerName,
      removePlayerName   // For deletion
    } = await req.json()

    const team = await Team.findById(teamId)
    if (!team) {
      return NextResponse.json({ success: false, error: 'Team not found' }, { status: 404 })
    }

    // ➕ Add player
    if (newPlayer && newPlayer.name && newPlayer.position) {
      const nameExists = team.players.some(
        (p: any) => p.name.toLowerCase() === newPlayer.name.toLowerCase()
      )
      if (nameExists) {
        return NextResponse.json({ success: false, error: 'Player already exists' }, { status: 400 })
      }

      team.players.push({ name: newPlayer.name, position: newPlayer.position })
      await team.save()
      return NextResponse.json({ success: true, message: 'Player added' })
    }

    // ✏️ Edit player name
    if (oldPlayerName && newPlayerName) {
      const player = team.players.find((p: any) => p.name === oldPlayerName)
      if (!player) {
        return NextResponse.json({ success: false, error: 'Player not found' }, { status: 404 })
      }

      player.name = newPlayerName
      await team.save()
      return NextResponse.json({ success: true, message: 'Player updated' })
    }

    // ❌ Remove player
    if (removePlayerName) {
      team.players = team.players.filter((p: any) => p.name !== removePlayerName)
      await team.save()
      return NextResponse.json({ success: true, message: 'Player removed' })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid request data' },
      { status: 400 }
    )
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Update failed' }, { status: 500 })
  }
}
