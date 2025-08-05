'use client'

import Link from 'next/link'

export default function HomePage() {
  return (
    <section className="min-h-screen max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-br from-blue-100 via-blue-50 to-emerald-50 rounded-lg shadow-xl my-8">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-purple-600 to-green-500 leading-tight drop-shadow-lg">
          Welcome to FanconnectHQ
        </h1>

        <p className="text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-2 leading-relaxed">
          Just Football Things — <span className="font-semibold text-green-700">Shop jerseys</span>, rate players, vote Man of the Match,
          and catch all matchday action <span className="font-semibold text-red-600">live!</span>
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mt-8 px-2 sm:px-4">
          <Link
            href="/shop"
            className="bg-gradient-to-r from-blue-600 to-green-500 text-white px-6 py-3 rounded-full text-sm sm:text-base font-bold hover:from-blue-700 hover:to-emerald-600 transition-all duration-300 ease-in-out w-full sm:w-auto transform hover:-translate-y-1 hover:scale-105 shadow-md hover:shadow-lg hover:shadow-blue-300/50"
          >
            Shop Now
          </Link>

          <Link
            href="/matchday"
            className="border-2 border-orange-500 text-orange-600 px-6 py-3 rounded-full text-sm sm:text-base font-bold hover:bg-orange-50 hover:border-orange-600 transition-all duration-300 ease-in-out w-full sm:w-auto transform hover:-translate-y-1 hover:scale-105 shadow-md hover:shadow-lg hover:shadow-orange-300/50"
          >
            Matchday Hub
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="mt-16 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-2 sm:px-0">
        <FeatureCard
          title="Rate Players"
          description="Vote for your favorite players after every match."
          link="/matchday"
          accentFrom="from-green-500"
          accentTo="to-emerald-600"
          hoverShadowColor="hover:shadow-green-300/50"
        />
        <FeatureCard
          title="Live Scores & Stats"
          description="Stay updated with real-time match data and analytics."
          link="/live"
          accentFrom="from-red-500"
          accentTo="to-rose-600"
          hoverShadowColor="hover:shadow-red-300/50"
        />
        <FeatureCard
          title="Football Blogs"
          description="Read and write blogs about your club, players, and moments."
          link="/blogs"
          accentFrom="from-purple-500"
          accentTo="to-fuchsia-600"
          hoverShadowColor="hover:shadow-purple-300/50"
        />
      </div>
    </section>
  )
}

function FeatureCard({
  title,
  description,
  link,
  accentFrom,
  accentTo,
  hoverShadowColor
}: {
  title: string
  description: string
  link: string
  accentFrom: string
  accentTo: string
  hoverShadowColor: string
}) {
  return (
    <Link
      href={link}
      className={`block p-5 sm:p-6 rounded-xl shadow-md border border-gray-100 bg-gradient-to-br from-white to-gray-50
                  hover:shadow-xl hover:border-transparent transition-all duration-300 ease-in-out
                  text-center sm:text-left transform hover:-translate-y-1.5 hover:scale-105
                  ${hoverShadowColor}`}
    >
      <h3 className={`text-base sm:text-lg font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r ${accentFrom} ${accentTo}`}>
        {title}
      </h3>
      <p className="text-sm text-gray-700 leading-relaxed">{description}</p>
    </Link>
  )
}
