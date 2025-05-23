"use client"

import { NewsCard } from "@/components/news-card"
import { SocialCard } from "@/components/social-card"
import { useEffect, useState } from "react"
import { RefreshCw } from "lucide-react"
import { suiClient } from "@/utils/sui-client"

interface Content {
  twitter: {
    author: string
    content: string
    date: string
    likes: number
    comments: number
  }
  instagram: {
    author: string
    content: string
    date: string
    likes: number
    comments: number
  }
  playerTweet: {
    author: string
    content: string
    date: string
    likes: number
    comments: number
  }
  news1: {
    title: string
    excerpt: string
    date: string
  }
  facebook: {
    author: string
    content: string
    date: string
    likes: number
    comments: number
  }
  expert: {
    author: string
    content: string
    date: string
    source: string
  }
  news2: {
    title: string
    excerpt: string
    date: string
  }
}

interface ClubData {
  name: string
  location: string
  stadium: string
  formation: string
  style: string
  matches_played: number
  matches_won: number
  matches_drawn: number
  matches_lost: number
  goals_scored: number
  goals_conceded: number
}

export function ClubDashboard() {
  const [content, setContent] = useState<Content | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [clubData, setClubData] = useState<ClubData | null>(null)

  const fetchClubData = async () => {
    try {
      const clubId = localStorage.getItem("clubId")
      if (!clubId) {
        throw new Error("No club ID found")
      }

      const response = await suiClient.getObject({
        id: clubId,
        options: { showContent: true },
      })

      if (!response.data?.content || !('fields' in response.data.content)) {
        throw new Error("Invalid club data")
      }

      const fields = response.data.content.fields as any
      return {
        name: fields.name,
        location: fields.location,
        stadium: fields.stadium,
        formation: fields.formation,
        style: fields.style,
        matches_played: parseInt(fields.matches_played),
        matches_won: parseInt(fields.matches_won),
        matches_drawn: parseInt(fields.matches_drawn),
        matches_lost: parseInt(fields.matches_lost),
        goals_scored: parseInt(fields.goals_scored),
        goals_conceded: parseInt(fields.goals_conceded)
      }
    } catch (err) {
      console.error("Error fetching club data:", err)
      throw err
    }
  }

  const fetchContent = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch club data first
      let currentClubData = clubData
      if (!currentClubData) {
        try {
          currentClubData = await fetchClubData()
          setClubData(currentClubData)
        } catch (err) {
          throw new Error("Failed to fetch club data: " + (err instanceof Error ? err.message : "Unknown error"))
        }
      }

      if (!currentClubData) {
        throw new Error("No club data available")
      }

      console.log("Using club data:", currentClubData)

      const response = await fetch('/api/fetch-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clubData: currentClubData }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch content')
      }

      const data = await response.json()
      setContent(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContent()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center py-8 text-red-500 bg-red-500/10 rounded-lg px-6">
          <p className="text-lg font-semibold mb-2">Error Loading Content</p>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center py-8 text-gray-400 bg-gray-800/50 rounded-lg px-6">
          <p className="text-lg font-semibold">No Content Available</p>
          <p className="text-sm mt-2">Try refreshing the page</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between bg-gray-800/50 p-6 rounded-lg border border-gray-700">
        <div>
          <h2 className="text-2xl font-semibold text-white mb-2">Latest Updates</h2>
          <p className="text-gray-400 text-sm">Stay updated with the latest news and social media activity</p>
        </div>
        <button
          onClick={fetchContent}
          className="flex items-center gap-2 px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors shadow-lg hover:shadow-cyan-500/20"
        >
          <RefreshCw className="w-5 h-5" />
          Refresh Content
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column - Social Media */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Twitter Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 hover:border-cyan-500/50 transition-colors">
              <SocialCard
                platform="twitter"
                author={content.twitter.author}
                content={content.twitter.content}
                date={content.twitter.date}
                likes={content.twitter.likes}
                comments={content.twitter.comments}
                verified
              />
            </div>
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 hover:border-cyan-500/50 transition-colors">
              <SocialCard
                platform="twitter"
                author={content.playerTweet.author}
                content={content.playerTweet.content}
                date={content.playerTweet.date}
                likes={content.playerTweet.likes}
                comments={content.playerTweet.comments}
                verified
              />
            </div>
          </div>

          {/* News Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 hover:border-cyan-500/50 transition-colors">
              <NewsCard
                title={content.news1.title}
                excerpt={content.news1.excerpt}
                date={content.news1.date}
              />
            </div>
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 hover:border-cyan-500/50 transition-colors">
              <NewsCard
                title={content.news2.title}
                excerpt={content.news2.excerpt}
                date={content.news2.date}
              />
            </div>
          </div>

          {/* Expert Analysis */}
          <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 hover:border-cyan-500/50 transition-colors">
            <SocialCard
              platform="expert"
              author={content.expert.author}
              content={content.expert.content}
              date={content.expert.date}
              source={content.expert.source}
              verified
            />
          </div>
        </div>

        {/* Right Column - Social Media */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Instagram Card */}
          <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 hover:border-cyan-500/50 transition-colors">
            <SocialCard
              platform="instagram"
              author={content.instagram.author}
              content={content.instagram.content}
              date={content.instagram.date}
              likes={content.instagram.likes}
              comments={content.instagram.comments}
              verified
            />
          </div>

          {/* Facebook Comment */}
          <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 hover:border-cyan-500/50 transition-colors">
            <SocialCard
              platform="facebook"
              author={content.facebook.author}
              content={content.facebook.content}
              date={content.facebook.date}
              likes={content.facebook.likes}
              comments={content.facebook.comments}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
