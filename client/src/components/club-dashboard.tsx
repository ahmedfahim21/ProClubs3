"use client"

import { NewsCard } from "@/components/news-card"
import { SocialCard } from "@/components/social-card"

export function ClubDashboard() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Latest Updates</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-auto">
        {/* Featured News - Large */}
        <div className="md:col-span-2 md:row-span-2">
          <NewsCard
            title="Club Signs Star Striker in Record Deal"
            excerpt="FC United has completed the signing of international striker Alex Johnson in a club-record £45 million deal from Atletico Madrid. The 27-year-old forward joins on a five-year contract after scoring 24 goals in La Liga last season."
            category="Transfer News"
            date="2 hours ago"
            imageUrl="/placeholder.webp?height=400&width=600"
            featured
          />
        </div>


        {/* Twitter Card */}
        <div className="md:col-span-1 md:row-span-1">
          <SocialCard
            platform="twitter"
            author="@FCUnited"
            content="Incredible atmosphere at training today! The team is focused and ready for Saturday's big match. #FCUCR #WeAreUnited"
            date="3 hours ago"
            likes={1243}
            comments={89}
            verified
          />
        </div>

        {/* News Card */}
        <div className="md:col-span-1 md:row-span-1">
          <NewsCard
            title="Youth Academy Graduate Scores on Debut"
            excerpt="18-year-old James Wilson scored in his first-team debut yesterday."
            category="Match Report"
            date="1 day ago"
          />
        </div>

        {/* Instagram Card */}
        <div className="md:col-span-1 md:row-span-1">
          <SocialCard
            platform="instagram"
            author="@fcunited_official"
            content="New kit drop! 🔥 Our away kit for the 2023/24 season is now available in stores and online."
            date="5 hours ago"
            imageUrl="/placeholder.webp?height=300&width=300"
            likes={8752}
            comments={342}
            verified
          />
        </div>


        {/* Player Tweet */}
        <div className="md:col-span-1 md:row-span-1">
          <SocialCard
            platform="twitter"
            author="@alex_johnson9"
            content="So excited to join @FCUnited! Can't wait to meet the fans and give everything for this historic club. Let's make history together! #NewBeginnings"
            date="1 day ago"
            likes={24567}
            comments={1832}
            verified
          />
        </div>

        {/* News Card with Image */}
        <div className="md:col-span-2 md:row-span-1">
          <NewsCard
            title="Stadium Expansion Plans Approved"
            excerpt="The city council has approved plans to expand United Stadium capacity to 60,000 seats. Construction will begin next summer."
            category="Club News"
            date="2 days ago"
            imageUrl="/placeholder.webp?height=200&width=400"
          />
        </div>

        {/* Fan Comment */}
        <div className="md:col-span-1 md:row-span-1">
          <SocialCard
            platform="facebook"
            author="Sarah Johnson"
            content="Been a fan for 25 years and this is the most exciting team we've had in a decade! Can't wait for Saturday's match!"
            date="12 hours ago"
            likes={423}
            comments={51}
          />
        </div>

        {/* Pundit Comment */}
        <div className="md:col-span-2 md:row-span-1">
          <SocialCard
            platform="expert"
            author="Gary Neville"
            content="FC United's pressing game has improved dramatically under the new manager. Their ability to win the ball high up the pitch is creating so many chances. They're genuine title contenders this season."
            date="1 day ago"
            source="Monday Night Football"
            verified
          />
        </div>

        {/* News Card */}
        <div className="md:col-span-1 md:row-span-1">
          <NewsCard
            title="Manager Signs Contract Extension"
            excerpt="FC United manager David Miller has signed a three-year contract extension, keeping him at the club until 2026."
            category="Club News"
            date="3 days ago"
          />
        </div>

        {/* Twitter Rumor */}
        <div className="md:col-span-1 md:row-span-1">
          <SocialCard
            platform="twitter"
            author="@FootballInsider"
            content="Sources tell us FC United is looking at strengthening their defensive options in January. Several center-backs being monitored. #TransferNews"
            date="2 days ago"
            likes={876}
            comments={124}
          />
        </div>

        {/* News Card with Image */}
        <div className="md:col-span-2 md:row-span-1">
          <NewsCard
            title="Injury Update: Captain Returns to Training"
            excerpt="Club captain Michael Roberts has returned to full training after recovering from a hamstring injury that kept him sidelined for three weeks."
            category="Team News"
            date="4 days ago"
            imageUrl="/placeholder.webp?height=200&width=400"
          />
        </div>

        {/* Instagram Post from Player */}
        <div className="md:col-span-1 md:row-span-1">
          <SocialCard
            platform="instagram"
            author="@alex_johnson9"
            content="First day at the new training ground! Amazing facilities here at @FCUnited 🔴⚪️"
            date="1 day ago"
            imageUrl="/placeholder.webp?height=300&width=300"
            likes={15432}
            comments={876}
            verified
          />
        </div>

        {/* Fan Comment */}
        <div className="md:col-span-1 md:row-span-1">
          <SocialCard
            platform="twitter"
            author="@UnitedFanatic"
            content="That new signing looks incredible! Johnson is exactly what we needed up front. This season is going to be special! #FCUnited"
            date="1 day ago"
            likes={342}
            comments={28}
          />
        </div>
      </div>
    </div>
  )
}
