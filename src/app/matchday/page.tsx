import Link from 'next/link'
import React from 'react'

type Game = {
  _id: string
  league: string
  homeTeam: string
  awayTeam: string
  gameDate: string
  gameTime: string
  status: string
  hot: boolean
}

const normalizeLeague = (raw: string) => {
  const l = raw.toLowerCase()
  if (l.includes('premier')) return 'Premier League'
  if (l.includes('la liga')) return 'La Liga'
  if (l.includes('champions')) return 'UCL'
  return raw
}

function slugify(text: string) {
  return text.toLowerCase().replace(/\s+/g, '-')
}

export default async function MatchdayPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/matchday`, {
    next: { revalidate: 60 },
  })

  const data = await res.json()
  const allGames: Game[] = (data.games || []).map((g: Game) => ({
    ...g,
    league: normalizeLeague(g.league),
  }))

  const hotMatches = allGames.filter(g => g.hot)
  const premierLeagueGames = allGames.filter(g => g.league === 'Premier League' && !g.hot)
  const laLigaGames = allGames.filter(g => g.league === 'La Liga' && !g.hot)
  const uclGames = allGames.filter(g => g.league === 'UCL' && !g.hot)

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-500 mb-6">
        Matchday Hub
      </h1>

      {/* 🔥 Hot Matches */}
      {hotMatches.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4 text-red-600">🔥 Hot Matches</h2>
          <div className="space-y-4">
            {hotMatches.map(match => (
              <MatchCard key={match._id} match={match} />
            ))}
          </div>
        </div>
      )}

      {/* Premier League */}
      {premierLeagueGames.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4 text-blue-700">🏴 Premier League</h2>
          <div className="space-y-4">
            {premierLeagueGames.map(match => (
              <MatchCard key={match._id} match={match} />
            ))}
          </div>
        </div>
      )}

      {/* La Liga */}
      {laLigaGames.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4 text-yellow-600">🇪🇸 La Liga</h2>
          <div className="space-y-4">
            {laLigaGames.map(match => (
              <MatchCard key={match._id} match={match} />
            ))}
          </div>
        </div>
      )}

      {/* UCL */}
      {uclGames.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4 text-purple-600">⭐ UEFA Champions League</h2>
          <div className="space-y-4">
            {uclGames.map(match => (
              <MatchCard key={match._id} match={match} />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

function MatchCard({ match }: { match: Game }) {
  const slug = `${slugify(match.homeTeam)}-vs-${slugify(match.awayTeam)}`
  const url = `/matchday/${slug}?game=${match._id}`

  return (
    <Link href={url}>
      <div className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center hover:shadow-lg transition-all duration-200 border border-gray-100 cursor-pointer">
        <div className="font-semibold text-gray-800 text-base sm:text-lg">
          {match.homeTeam} <span className="text-gray-500 font-normal">vs</span> {match.awayTeam}
        </div>
        <div className="text-sm sm:text-base text-gray-600 font-medium">
          🗓 {match.gameDate} &nbsp; 🕒 {match.gameTime}
        </div>
      </div>
    </Link>
  )
}