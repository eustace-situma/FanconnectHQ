'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'

export default function MatchPageContent({ game, slug }: { game: any; slug: string }) {
  const [ratings, setRatings] = useState<{ [playerName: string]: number }>({})
  const [momVote, setMomVote] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleRatingChange = (playerName: string, value: number) => {
    setRatings(prev => ({ ...prev, [playerName]: value }))
  }

  const handleSubmit = async () => {
    if (!momVote) {
      toast.error('Please vote Man of the Match.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/matchday/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId: game._id,
          ratings,
          momVote,
        }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        toast.success('Submission successful! 🎉')
      } else {
        toast.error(data.message || 'Error submitting data.')
      }
    } catch (err) {
      console.error(err)
      toast.error('Submission failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      <header className="text-center">
        <h1 className="text-3xl font-bold mb-1">
          {game.homeTeam} vs {game.awayTeam}
        </h1>
        <p className="text-gray-500 text-sm">
          {game.league} — {game.gameDate} at {game.gameTime}
        </p>
      </header>

      {/* Ratings */}
      <section>
        <h2 className="text-xl font-semibold text-blue-600 mb-3">Rate Players</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {/* Home */}
          <div>
            <h3 className="font-bold text-lg mb-2">{game.homeTeam}</h3>
            {game.homePlayers.map((p: any) => (
              <div key={p.name} className="mb-3">
                <label className="block text-sm font-medium mb-1">
                  {p.name} ({p.position})
                </label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  defaultValue={6}
                  onChange={e => handleRatingChange(p.name, Number(e.target.value))}
                  className="w-full border rounded px-2 py-1 text-sm"
                />
              </div>
            ))}
          </div>

          {/* Away */}
          <div>
            <h3 className="font-bold text-lg mb-2">{game.awayTeam}</h3>
            {game.awayPlayers.map((p: any) => (
              <div key={p.name} className="mb-3">
                <label className="block text-sm font-medium mb-1">
                  {p.name} ({p.position})
                </label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  defaultValue={6}
                  onChange={e => handleRatingChange(p.name, Number(e.target.value))}
                  className="w-full border rounded px-2 py-1 text-sm"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MoM Voting */}
      <section>
        <h2 className="text-xl font-semibold text-purple-600 mb-3">Vote Man of the Match</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {[...game.homePlayers, ...game.awayPlayers].map((p: any) => (
            <button
              key={p.name}
              onClick={() => setMomVote(p.name)}
              className={`w-full px-4 py-2 border rounded ${
                momVote === p.name ? 'bg-purple-100 border-purple-600' : 'hover:bg-purple-50'
              }`}
            >
              {p.name} ({p.position})
            </button>
          ))}
        </div>
        {momVote && (
          <p className="text-sm mt-2 text-green-600">
            You voted <strong>{momVote}</strong> as Man of the Match.
          </p>
        )}
      </section>

      {/* Submit Button */}
      <div className="text-center mt-10">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`px-6 py-3 font-semibold rounded text-white ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {loading ? 'Submitting...' : 'Submit Ratings & Vote'}
        </button>
      </div>
    </div>
  )
}
