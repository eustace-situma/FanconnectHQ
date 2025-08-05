'use client'

import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

const leagueColors: { [key: string]: string } = {
  'Premier League': '#1e90ff',
  'La Liga': '#f39c12',
  UCL: '#8e44ad',
}

const statusOptions = ['upcoming', 'live', 'finished']

export default function AdminGamesPage() {
  const [gamesByDate, setGamesByDate] = useState<{ [date: string]: any[] }>({})
  const [editingRow, setEditingRow] = useState<string | null>(null)
  const [editedValues, setEditedValues] = useState<{ [key: string]: any }>({})
  const [allGames, setAllGames] = useState<any[]>([])

  const [selectedLeagues, setSelectedLeagues] = useState<string[]>([])
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>('')

  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    fetch('/api/admin/games')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const priority = ['Premier League', 'La Liga', 'UCL']
          const sorted = data.games.sort((a: any, b: any) => {
            const aIndex = priority.indexOf(a.league)
            const bIndex = priority.indexOf(b.league)
            if (a.gameDate !== b.gameDate) return a.gameDate.localeCompare(b.gameDate)
            if (aIndex !== bIndex) return aIndex - bIndex
            return a.gameTime.localeCompare(b.gameTime)
          })
          setAllGames(sorted)
        } else toast.error('Failed to fetch games')
      })

    const onScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const filtered = allGames.filter(game => {
      const leagueMatch =
        selectedLeagues.length === 0 || selectedLeagues.includes(game.league)
      const statusMatch = !selectedStatus || game.status === selectedStatus
      const dateMatch = !selectedDate || game.gameDate === selectedDate
      return leagueMatch && statusMatch && dateMatch
    })

    const grouped: { [date: string]: any[] } = {}
    filtered.forEach((game: any) => {
      if (!grouped[game.gameDate]) grouped[game.gameDate] = []
      grouped[game.gameDate].push(game)
    })
    setGamesByDate(grouped)
  }, [allGames, selectedLeagues, selectedStatus, selectedDate])

  const handleEdit = (game: any) => {
    setEditingRow(game._id)
    setEditedValues({
      gameDate: game.gameDate,
      gameTime: game.gameTime,
      status: game.status,
      homeScore: game.homeScore ?? '',
      awayScore: game.awayScore ?? '',
      hot: game.hot ?? false,
    })
  }

  const handleChange = (field: string, value: any) => {
    setEditedValues(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async (game: any) => {
    const res = await fetch('/api/admin/games', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: game._id,
        gameDate: editedValues.gameDate,
        gameTime: editedValues.gameTime,
        status: editedValues.status,
        homeScore: editedValues.homeScore,
        awayScore: editedValues.awayScore,
        hot: editedValues.hot,
      }),
    })

    const data = await res.json()
    if (data.success) {
      toast.success('Game updated!')
      setAllGames(prev =>
        prev.map(g => (g._id === game._id ? { ...g, ...data.game } : g))
      )
      setEditingRow(null)
      setEditedValues({})
    } else {
      toast.error(data.error || 'Failed to update game')
    }
  }

  const toggleLeague = (league: string) => {
    setSelectedLeagues(prev =>
      prev.includes(league) ? prev.filter(l => l !== league) : [...prev, league]
    )
  }

  return (
    <div style={{ padding: '1rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '1rem' }}>All Games</h1>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ position: 'relative' }}>
          <details style={{ cursor: 'pointer' }}>
            <summary
              style={{
                padding: '6px 12px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                background: '#fafafa',
              }}
            >
              League Filter
            </summary>
            <div style={{ position: 'absolute', background: '#fff', border: '1px solid #ccc', zIndex: 10, padding: '8px' }}>
              {['Premier League', 'La Liga', 'UCL'].map(league => (
                <label key={league} style={{ display: 'block', marginBottom: '4px' }}>
                  <input
                    type="checkbox"
                    checked={selectedLeagues.includes(league)}
                    onChange={() => toggleLeague(league)}
                  />
                  <span style={{ marginLeft: '6px' }}>{league}</span>
                </label>
              ))}
            </div>
          </details>
        </div>

        <select
          value={selectedStatus || ''}
          onChange={e => setSelectedStatus(e.target.value || null)}
          style={{ padding: '6px 12px' }}
        >
          <option value="">All Statuses</option>
          {statusOptions.map(status => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          style={{ padding: '6px 12px' }}
        />

        <button onClick={() => {
          setSelectedDate('')
          setSelectedStatus(null)
          setSelectedLeagues([])
        }} style={{ padding: '6px 12px' }}>
          Clear Filters
        </button>
      </div>

      {Object.keys(gamesByDate).length === 0 && (
        <p style={{ color: '#777' }}>No games found.</p>
      )}

      {Object.entries(gamesByDate).map(([date, games]) => (
        <div key={date} style={{ marginBottom: '2rem' }}>
          <div
            style={{
              position: 'sticky',
              top: 0,
              background: '#fff',
              padding: '8px 0',
              zIndex: 5,
              fontWeight: 'bold',
              fontSize: '18px',
              borderBottom: '2px solid #ddd',
            }}
          >
            {date}
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '8px' }}>
            <thead>
              <tr style={{ background: '#f0f0f0' }}>
                <th style={{ padding: '8px', border: '1px solid #ccc' }}>League</th>
                <th style={{ padding: '8px', border: '1px solid #ccc' }}>Match</th>
                <th style={{ padding: '8px', border: '1px solid #ccc' }}>Date</th>
                <th style={{ padding: '8px', border: '1px solid #ccc' }}>Time</th>
                <th style={{ padding: '8px', border: '1px solid #ccc' }}>Status</th>
                <th style={{ padding: '8px', border: '1px solid #ccc' }}>FT (H-A)</th>
                <th style={{ padding: '8px', border: '1px solid #ccc' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {games.map((game: any) => {
                const isEditing = editingRow === game._id
                const status = isEditing ? editedValues.status : game.status
                const isLocked = status === 'live' || status === 'finished'
                const leagueColor = leagueColors[game.league] || '#333'

                return (
                  <tr key={game._id}>
                    <td style={{ padding: '8px', border: '1px solid #ccc' }}>
                      <span
                        style={{
                          padding: '4px 8px',
                          background: leagueColor,
                          color: '#fff',
                          borderRadius: '6px',
                          fontSize: '12px',
                        }}
                      >
                        {game.league}
                      </span>
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #ccc' }}>
                      {!isEditing && game.hot && <span>🔥 </span>}
                      {game.homeTeam} vs {game.awayTeam}
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #ccc' }}>
                      {isEditing ? (
                        <input
                          type="date"
                          value={editedValues.gameDate}
                          disabled={isLocked}
                          onChange={e => handleChange('gameDate', e.target.value)}
                        />
                      ) : (
                        game.gameDate
                      )}
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #ccc' }}>
                      {isEditing ? (
                        <input
                          type="time"
                          value={editedValues.gameTime}
                          disabled={isLocked}
                          onChange={e => handleChange('gameTime', e.target.value)}
                        />
                      ) : (
                        game.gameTime
                      )}
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #ccc' }}>
                      {isEditing ? (
                        <select
                          value={editedValues.status}
                          onChange={e => handleChange('status', e.target.value)}
                        >
                          {statusOptions.map(status => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      ) : (
                        game.status
                      )}
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #ccc' }}>
                      {status === 'finished' ? (
                        isEditing ? (
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <input
                              type="number"
                              min="0"
                              value={editedValues.homeScore}
                              style={{ width: '45px' }}
                              onChange={e => handleChange('homeScore', e.target.value)}
                            />
                            <span>-</span>
                            <input
                              type="number"
                              min="0"
                              value={editedValues.awayScore}
                              style={{ width: '45px' }}
                              onChange={e => handleChange('awayScore', e.target.value)}
                            />
                          </div>
                        ) : (
                          `${game.homeScore ?? '-'} - ${game.awayScore ?? '-'}`
                        )
                      ) : (
                        '—'
                      )}
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #ccc' }}>
                      {isEditing ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <input
                              type="checkbox"
                              checked={editedValues.hot}
                              onChange={e => handleChange('hot', e.target.checked)}
                            />
                            Hot
                          </label>
                          <button
                            onClick={() => handleSave(game)}
                            style={{
                              padding: '6px 12px',
                              background: '#0070f3',
                              color: '#fff',
                              border: 'none',
                              cursor: 'pointer',
                            }}
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEdit(game)}
                          style={{
                            padding: '6px 12px',
                            background: '#444',
                            color: '#fff',
                            border: 'none',
                            cursor: 'pointer',
                          }}
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ))}

      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            fontSize: '20px',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
          }}
        >
          ↑
        </button>
      )}
    </div>
  )
}
