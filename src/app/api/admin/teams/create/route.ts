import { NextRequest, NextResponse } from 'next/server'
import Team from '@/models/team'
import { connectToDB } from '@/lib/mongodb'

export async function POST(req: NextRequest) {
  await connectToDB()

  try {
    const { name, league, players } = await req.json()

    if (!name || !league) {
      return NextResponse.json(
        { message: 'Name and league are required' },
        { status: 400 }
      )
    }

    // Check for duplicate team in same league
    const exists = await Team.findOne({ name, league })
    if (exists) {
      return NextResponse.json(
        { message: 'Team already exists' },
        { status: 409 } // ✅ Correct status for conflict
      )
    }

    const newTeam = await Team.create({ name, league, players })
    return NextResponse.json(newTeam, { status: 201 })
  } catch (error) {
    console.error('Error creating team:', error)
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    )
  }
}

export async function GET() {
  await connectToDB()
  try {
    const teams = await Team.find().sort({ league: 1, name: 1 })
    return NextResponse.json(teams, { status: 200 })
  } catch (error) {
    console.error('Error fetching teams:', error)
    return NextResponse.json(
      { message: 'Failed to fetch teams' },
      { status: 500 }
    )
  }
}
