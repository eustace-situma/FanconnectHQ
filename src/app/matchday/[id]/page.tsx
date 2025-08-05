import { notFound } from 'next/navigation'
import { connectToDB } from '@/lib/mongodb'
import Game from '@/models/game'
import MatchPageContent from '@/components/MatchRatingClient'

export default async function MatchDetailsPage({ params, searchParams }: any) {
  const gameId = Array.isArray(searchParams.game) ? searchParams.game[0] : searchParams.game
  if (!gameId) return notFound()

  await connectToDB()
  const game = await Game.findById(gameId)
  if (!game) return notFound()

  return <MatchPageContent game={JSON.parse(JSON.stringify(game))} slug={params.id} />
}
