import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Twitter, Instagram, Facebook, MessageSquare, Heart, CheckCircle } from "lucide-react"

interface SocialCardProps {
  platform: "twitter" | "instagram" | "facebook" | "expert"
  author: string
  content: string
  date: string
  likes?: number
  comments?: number
  verified?: boolean
  source?: string
}

export function SocialCard({
  platform,
  author,
  content,
  date,
  likes,
  comments,
  verified = false,
  source,
}: SocialCardProps) {
  const getPlatformIcon = () => {
    switch (platform) {
      case "twitter":
        return <Twitter className="h-4 w-4 text-cyan-400" />
      case "instagram":
        return <Instagram className="h-4 w-4 text-cyan-400" />
      case "facebook":
        return <Facebook className="h-4 w-4 text-cyan-400" />
      case "expert":
        return (
          <Badge variant="outline" className="text-xs font-normal border-cyan-400 text-cyan-400 bg-gray-800">Expert</Badge>
        )
    }
  }

  const getAvatarFallback = () => {
    if (platform === "expert") return "EX"
    return author.substring(1, 3).toUpperCase()
  }

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toString()
  }

  return (
    <Card className="h-full bg-gray-900/80 border border-gray-800 text-gray-100">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={`/placeholder.webp?height=32&width=32&text=${getAvatarFallback()}`} />
              <AvatarFallback>{getAvatarFallback()}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center">
                <p className="text-sm font-medium">{author}</p>
                {verified && <CheckCircle className="h-3 w-3 ml-1 text-cyan-400" />}
              </div>
              {source && <p className="text-xs text-gray-400">{source}</p>}
            </div>
          </div>
          <div>{getPlatformIcon()}</div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-gray-200">{content}</p>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <div className="text-xs text-gray-400">{date}</div>
        {(likes !== undefined || comments !== undefined) && (
          <div className="flex items-center space-x-3 text-xs text-gray-400">
            {likes !== undefined && (
              <div className="flex items-center">
                <Heart className="h-3 w-3 mr-1 text-cyan-400" />
                {formatNumber(likes)}
              </div>
            )}
            {comments !== undefined && (
              <div className="flex items-center">
                <MessageSquare className="h-3 w-3 mr-1 text-cyan-400" />
                {formatNumber(comments)}
              </div>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
