'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'

type Player = { name: string; position: string }
type Team = { _id: string; name: string; players: Player[] }
type LeagueTeams = Record<string, Team[]>

export default function AdminTeamsPage() {
  const [teams, setTeams] = useState<LeagueTeams>({})
  const [search, setSearch] = useState('')
  const [expandedLeagues, setExpandedLeagues] = useState<Record<string, boolean>>({})
  const [expandedTeams, setExpandedTeams] = useState<Record<string, boolean>>({})
  const [editingPlayer, setEditingPlayer] = useState<Record<string, string>>({})
  const [playerEdits, setPlayerEdits] = useState<Record<string, string>>({})
  const [addPlayer, setAddPlayer] = useState<Record<string, { name: string; position: string }>>({})
  const [toast, setToast] = useState<string | null>(null)
  const [pendingDelete, setPendingDelete] = useState<{
    teamId: string
    playerName: string
  } | null>(null)

  useEffect(() => {
    fetchTeams()
  }, [])

  const fetchTeams = async () => {
    const res = await fetch('/api/admin/teams')
    const json = await res.json()
    if (json.success) {
      setTeams(json.grouped)
    }
  }

  const toggleLeague = (league: string) => {
    setExpandedLeagues(prev => ({ ...prev, [league]: !prev[league] }))
  }

  const toggleTeam = (teamId: string) => {
    setExpandedTeams(prev => ({ ...prev, [teamId]: !prev[teamId] }))
  }

  const startEditing = (teamId: string, playerName: string) => {
    setEditingPlayer({ [teamId + playerName]: playerName })
    setPlayerEdits({ [teamId + playerName]: playerName })
  }

  const cancelEditing = (teamId: string, playerName: string) => {
    setEditingPlayer(prev => {
      const newObj = { ...prev }
      delete newObj[teamId + playerName]
      return newObj
    })
    setPlayerEdits(prev => {
      const newObj = { ...prev }
      delete newObj[teamId + playerName]
      return newObj
    })
  }

  const saveEdit = async (teamId: string, oldName: string) => {
    const newName = playerEdits[teamId + oldName]
    if (!newName || newName === oldName) {
      cancelEditing(teamId, oldName)
      return
    }

    try {
      await axios.put('/api/admin/teams', {
        teamId,
        oldPlayerName: oldName,
        newPlayerName: newName,
      })
      showToast('Player name updated')
      fetchTeams()
      cancelEditing(teamId, oldName)
    } catch (err) {
      console.error(err)
    }
  }

  const handleAddPlayer = async (teamId: string) => {
    const player = addPlayer[teamId]
    if (!player?.name || !player?.position) return

    try {
      await axios.put('/api/admin/teams', {
        teamId,
        newPlayer: player,
      })
      showToast('Player added')
      setAddPlayer(prev => ({ ...prev, [teamId]: { name: '', position: '' } }))
      fetchTeams()
    } catch (err) {
      console.error(err)
    }
  }

  const confirmDeletePlayer = (teamId: string, playerName: string) => {
    setPendingDelete({ teamId, playerName })
  }

  const handleDeleteConfirmed = async () => {
    if (!pendingDelete) return
    const { teamId, playerName } = pendingDelete
    try {
      await axios.put('/api/admin/teams', {
        teamId,
        removePlayerName: playerName,
      })
      showToast('Player deleted')
      setPendingDelete(null)
      fetchTeams()
    } catch (err) {
      console.error(err)
    }
  }

  const showToast = (message: string) => {
    setToast(message)
    setTimeout(() => setToast(null), 3000)
  }

  const exportCSV = () => {
    let csv = 'League,Team,Player,Position\n'
    for (const league in teams) {
      teams[league].forEach(team => {
        team.players.forEach(p => {
          csv += `"${league}","${team.name}","${p.name}","${p.position}"\n`
        })
      })
    }

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'teams_players.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const filteredTeams: LeagueTeams = {}
  for (const league in teams) {
    const filtered = teams[league].filter(team =>
      team.name.toLowerCase().includes(search.toLowerCase())
    )
    if (filtered.length > 0) filteredTeams[league] = filtered
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 font-sans relative">
      {toast && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow z-50 transition">
          {toast}
        </div>
      )}

      {pendingDelete && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-white border border-red-500 p-4 rounded shadow-lg z-50 w-full max-w-sm">
          <p className="mb-2 text-red-700 font-semibold">
            Delete <span className="font-bold">{pendingDelete.playerName}</span>?
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setPendingDelete(null)}
              className="px-3 py-1 bg-gray-200 text-gray-800 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirmed}
              className="px-3 py-1 bg-red-600 text-white rounded"
            >
              Confirm
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <input
          placeholder="Search teams..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border px-4 py-2 rounded w-full max-w-md shadow"
        />
        <button
          onClick={exportCSV}
          className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
        >
          Export CSV
        </button>
      </div>

      {Object.keys(filteredTeams)
        .sort()
        .map(league => (
          <div key={league} className="border rounded-lg shadow-sm p-4 bg-white transition-all">
            <div
              className="flex justify-between items-center cursor-pointer bg-gray-100 px-4 py-2 rounded font-semibold text-lg"
              onClick={() => toggleLeague(league)}
            >
              <span>{league}</span>
              <span className="text-sm text-gray-500">
                {expandedLeagues[league] ? '▲ Collapse' : '▼ Expand'}
              </span>
            </div>

            {expandedLeagues[league] && (
              <div className="mt-4 space-y-4">
                {filteredTeams[league].map(team => (
                  <div key={team._id} className="border border-gray-200 rounded-md p-3 bg-gray-50">
                    <div
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() => toggleTeam(team._id)}
                    >
                      <h3 className="text-md font-bold">{team.name}</h3>
                      <span className="text-sm text-gray-600">
                        {expandedTeams[team._id] ? 'Hide Players ▲' : 'Show Players ▼'}
                      </span>
                    </div>

                    {expandedTeams[team._id] && (
                      <>
                        <div className="overflow-x-auto mt-3">
                          <table className="min-w-full text-sm border">
                            <thead className="bg-gray-200">
                              <tr>
                                <th className="px-3 py-2 text-left">Player Name</th>
                                <th className="px-3 py-2 text-left">Position</th>
                                <th className="px-3 py-2 text-center">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {team.players.map(player => {
                                const key = team._id + player.name
                                const isEditing = editingPlayer[key] !== undefined

                                return (
                                  <tr key={key} className="border-t">
                                    <td className="px-3 py-2">
                                      {isEditing ? (
                                        <input
                                          className="border rounded px-2 py-1 w-full"
                                          value={playerEdits[key]}
                                          onChange={e =>
                                            setPlayerEdits(prev => ({
                                              ...prev,
                                              [key]: e.target.value,
                                            }))
                                          }
                                        />
                                      ) : (
                                        player.name
                                      )}
                                    </td>
                                    <td className="px-3 py-2">{player.position}</td>
                                    <td className="px-3 py-2 text-center space-x-2">
                                      {isEditing ? (
                                        <>
                                          <button
                                            onClick={() => saveEdit(team._id, player.name)}
                                            className="bg-green-500 text-white px-2 py-1 rounded"
                                          >
                                            Save
                                          </button>
                                          <button
                                            onClick={() => cancelEditing(team._id, player.name)}
                                            className="bg-gray-300 px-2 py-1 rounded"
                                          >
                                            Cancel
                                          </button>
                                        </>
                                      ) : (
                                        <>
                                          <button
                                            onClick={() => startEditing(team._id, player.name)}
                                            className="bg-blue-500 text-white px-2 py-1 rounded"
                                          >
                                            Edit
                                          </button>
                                          <button
                                            onClick={() => confirmDeletePlayer(team._id, player.name)}
                                            className="bg-red-600 text-white px-2 py-1 rounded"
                                          >
                                            Delete
                                          </button>
                                        </>
                                      )}
                                    </td>
                                  </tr>
                                )
                              })}
                            </tbody>
                          </table>
                        </div>

                        {/* Add Player Form */}
                        <div className="mt-4 flex flex-col sm:flex-row items-center gap-2">
                          <input
                            type="text"
                            placeholder="Player name"
                            className="border px-2 py-1 rounded w-full sm:w-1/3"
                            value={addPlayer[team._id]?.name || ''}
                            onChange={e =>
                              setAddPlayer(prev => ({
                                ...prev,
                                [team._id]: {
                                  ...prev[team._id],
                                  name: e.target.value,
                                },
                              }))
                            }
                          />
                          <input
                            type="text"
                            placeholder="Position"
                            className="border px-2 py-1 rounded w-full sm:w-1/3"
                            value={addPlayer[team._id]?.position || ''}
                            onChange={e =>
                              setAddPlayer(prev => ({
                                ...prev,
                                [team._id]: {
                                  ...prev[team._id],
                                  position: e.target.value,
                                },
                              }))
                            }
                          />
                          <button
                            onClick={() => handleAddPlayer(team._id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded w-full sm:w-auto"
                          >
                            Add Player
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
    </div>
  )
}
