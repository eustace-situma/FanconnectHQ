'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'

const leagues = {
  'Premier League': [
    "Arsenal", "Aston Villa", "Bournemouth", "Brentford", "Brighton & Hove Albion",
    "Burnley", "Chelsea", "Crystal Palace", "Everton", "Fulham",
    "Leeds United", "Liverpool", "Manchester City", "Manchester United",
    "Newcastle United", "Nottingham Forest", "Sunderland",
    "Tottenham Hotspur", "West Ham United", "Wolverhampton Wanderers"
  ],
  'La Liga': [
    "Almería", "Alavés", "Athletic Club", "Atlético Madrid", "Barcelona",
    "Cádiz", "Celta Vigo", "Elche", "Getafe", "Girona",
    "Levante", "Mallorca", "Osasuna", "Rayo Vallecano",
    "Real Betis", "Real Madrid", "Real Oviedo", "Real Sociedad",
    "Sevilla", "Villarreal"
  ],
  'Champions League': [
    "Liverpool", "Arsenal", "Manchester City", "Newcastle United", "Chelsea", "Tottenham Hotspur",
    "Real Madrid", "Barcelona", "Atlético Madrid", "Athletic Club", "Villarreal",
    "Napoli", "Inter Milan", "Atalanta", "Juventus",
    "Bayern Munich", "Bayer Leverkusen", "Eintracht Frankfurt", "Borussia Dortmund",
    "Paris Saint-Germain", "Monaco", "Marseille",
    "PSV Eindhoven", "Ajax",
    "Sporting Lisbon", "Galatasaray", "Olympiacos",
    "Slavia Prague", "Union St Gilloise"
  ]
}

const positions = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward']

export default function CreateTeamPage() {
  const [selectedLeague, setSelectedLeague] = useState('')
  const [selectedTeam, setSelectedTeam] = useState('')
  const [players, setPlayers] = useState<{ name: string; position: string }[]>([])

  const handleLeagueChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLeague(e.target.value)
    setSelectedTeam('')
    setPlayers([])
  }

  const handleAddPlayer = () => {
    setPlayers([...players, { name: '', position: '' }])
  }

  const handleRemovePlayer = (index: number) => {
    const updated = [...players]
    updated.splice(index, 1)
    setPlayers(updated)
  }

  const handlePlayerChange = (
    index: number,
    field: 'name' | 'position',
    value: string
  ) => {
    const updated = [...players]
    updated[index][field] = value
    setPlayers(updated)
  }

  const handleTeamSubmit = async () => {
    if (!selectedLeague || !selectedTeam) {
      toast.error('Please select both a league and a team')
      return
    }

    try {
      const res = await fetch('/api/admin/teams/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          league: selectedLeague,
          name: selectedTeam,
          players
        })
      })

      if (res.status === 409) {
        toast.error('Team already exists')
        return
      }

      if (!res.ok) throw new Error('Failed to save team')

      toast.success('Team saved successfully!')
      setSelectedTeam('')
      setPlayers([])
    } catch (err) {
      toast.error('Error saving team')
      console.error(err)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create Team</h1>

      {/* League Dropdown */}
      <div className="mb-4">
        <label className="block mb-1">Select League</label>
        <select
          value={selectedLeague}
          onChange={handleLeagueChange}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">-- Choose League --</option>
          {Object.keys(leagues).map((league) => (
            <option key={league} value={league}>
              {league}
            </option>
          ))}
        </select>
      </div>

      {/* Team Dropdown */}
      {selectedLeague && (
        <div className="mb-4">
          <label className="block mb-1">Select Team</label>
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">-- Choose Team --</option>
            {leagues[selectedLeague as keyof typeof leagues].map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Player Input Section */}
      {selectedTeam && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="font-medium">Players</label>
            <button
              type="button"
              onClick={handleAddPlayer}
              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
            >
              + Add Player
            </button>
          </div>

          {players.map((p, i) => (
            <div key={i} className="flex gap-2 items-center mb-2">
              <input
                type="text"
                placeholder="Player name"
                value={p.name}
                onChange={(e) => handlePlayerChange(i, 'name', e.target.value)}
                className="flex-1 border px-3 py-2 rounded"
              />
              <select
                value={p.position}
                onChange={(e) => handlePlayerChange(i, 'position', e.target.value)}
                className="border px-3 py-2 rounded"
              >
                <option value="">Position</option>
                {positions.map((pos) => (
                  <option key={pos} value={pos}>
                    {pos}
                  </option>
                ))}
              </select>
              <button
                onClick={() => handleRemovePlayer(i)}
                className="text-red-500 text-sm"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleTeamSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Add Team
      </button>
    </div>
  )
}
