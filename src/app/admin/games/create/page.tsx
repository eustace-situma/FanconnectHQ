'use client'

import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

export default function CreateGamePage() {
  const [teamsByLeague, setTeamsByLeague] = useState<{ [league: string]: any[] }>({})
  const [league, setLeague] = useState('')
  const [homeTeam, setHomeTeam] = useState('')
  const [awayTeam, setAwayTeam] = useState('')
  const [gameDate, setGameDate] = useState('')
  const [gameTime, setGameTime] = useState('')
  const [homePlayers, setHomePlayers] = useState<any[]>([])
  const [awayPlayers, setAwayPlayers] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/admin/teams')
      .then(res => res.json())
      .then(data => {
        if (data.success) setTeamsByLeague(data.grouped)
        else toast.error('Failed to load teams')
      })
  }, [])

  useEffect(() => {
    const allTeams = teamsByLeague[league] || []
    const home = allTeams.find(t => t.name === homeTeam)
    const away = allTeams.find(t => t.name === awayTeam)
    setHomePlayers(home?.players || [])
    setAwayPlayers(away?.players || [])
  }, [league, homeTeam, awayTeam])

  const handleSubmit = async () => {
    if (!league || !homeTeam || !awayTeam || !gameDate || !gameTime) {
      toast.error('Please fill in all fields')
      return
    }
    if (homeTeam === awayTeam) {
      toast.error('Home and away teams must be different')
      return
    }

    const res = await fetch('/api/admin/games/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        league,
        homeTeam,
        awayTeam,
        homePlayers,
        awayPlayers,
        gameDate,
        gameTime,
      }),
    })

    const result = await res.json()
    if (result.success) {
      toast.success('Game created!')
      setLeague('')
      setHomeTeam('')
      setAwayTeam('')
      setGameDate('')
      setGameTime('')
      setHomePlayers([])
      setAwayPlayers([])
    } else {
      toast.error(result.error || 'Failed to create game')
    }
  }

  const teams = teamsByLeague[league] || []

  return (
    <div style={{ padding: '1rem', maxWidth: 800, margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '1rem' }}>Create Game</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* League */}
        <div>
          <label><strong>League</strong></label>
          <select
            value={league}
            onChange={e => {
              setLeague(e.target.value)
              setHomeTeam('')
              setAwayTeam('')
              setHomePlayers([])
              setAwayPlayers([])
            }}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="">-- Select League --</option>
            {Object.keys(teamsByLeague).sort().map(lg => (
              <option key={lg} value={lg}>{lg}</option>
            ))}
          </select>
        </div>

        {/* Home team */}
        <div>
          <label><strong>Home Team</strong></label>
          <select
            value={homeTeam}
            onChange={e => setHomeTeam(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="">-- Select Home Team --</option>
            {teams.map(team => (
              <option
                key={team._id}
                value={team.name}
                disabled={team.name === awayTeam}
              >
                {team.name}
              </option>
            ))}
          </select>
          {homePlayers.length > 0 && (
            <ul style={{ listStyle: 'disc', marginLeft: '1.5rem', marginTop: '8px' }}>
              {homePlayers.map((p, i) => (
                <li key={i}>{p.name} – {p.position}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Away team */}
        <div>
          <label><strong>Away Team</strong></label>
          <select
            value={awayTeam}
            onChange={e => setAwayTeam(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="">-- Select Away Team --</option>
            {teams.map(team => (
              <option
                key={team._id}
                value={team.name}
                disabled={team.name === homeTeam}
              >
                {team.name}
              </option>
            ))}
          </select>
          {awayPlayers.length > 0 && (
            <ul style={{ listStyle: 'disc', marginLeft: '1.5rem', marginTop: '8px' }}>
              {awayPlayers.map((p, i) => (
                <li key={i}>{p.name} – {p.position}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Game date */}
        <div>
          <label><strong>Game Date</strong></label>
          <input
            type="date"
            value={gameDate}
            onChange={e => setGameDate(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        {/* Game time */}
        <div>
          <label><strong>Game Time</strong></label>
          <input
            type="time"
            value={gameTime}
            onChange={e => setGameTime(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        <button
          onClick={handleSubmit}
          style={{
            width: '100%',
            padding: '10px 12px',
            backgroundColor: 'black',
            color: 'white',
            borderRadius: '6px',
          }}
        >
          Create Game
        </button>
      </div>
    </div>
  )
}
