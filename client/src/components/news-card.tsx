import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon } from "lucide-react"
import Image from "next/image"

interface NewsCardProps {
  title: string
  excerpt: string
  category: string
  date: string
  imageUrl?: string
  featured?: boolean
}

export function NewsCard({ title, excerpt, category, date, imageUrl, featured = false }: NewsCardProps) {
  return (
    <Card className={`h-full overflow-hidden bg-gray-900/80 border border-gray-800 text-gray-100 ${featured ? "border-cyan-500" : ""}`}>
      {imageUrl && (
        <div className="relative w-full overflow-hidden">
          <Image
            width={featured ? 400 : 300}
            height={featured ? 250 : 150}
            src={imageUrl || "/placeholder.webp"}
            alt={title}
            className={`w-full object-cover ${featured ? "h-68" : "h-40"}`}
          />
          <Badge className="absolute top-3 left-3 bg-gray-800 text-cyan-400 border border-cyan-400">{category}</Badge>
        </div>
      )}
      <CardHeader className={imageUrl ? "pt-4 pb-2" : "pb-2"}>
        {!imageUrl && <Badge className="w-fit mb-2 bg-gray-800 text-cyan-400 border border-cyan-400">{category}</Badge>}
        <CardTitle className={featured ? "text-2xl" : "text-lg"}>{title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <p className={`text-gray-400 ${featured ? "text-base" : "text-sm"}`}>{excerpt}</p>
      </CardContent>
      <CardFooter>
        <div className="flex items-center text-xs text-gray-500">
          <CalendarIcon className="h-3 w-3 mr-1" />
          {date}
        </div>
      </CardFooter>
    </Card>
  )
}
