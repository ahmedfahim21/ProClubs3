import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon } from "lucide-react"

interface NewsCardProps {
  title: string
  excerpt: string
  date: string
  featured?: boolean
}

export function NewsCard({ title, excerpt, date, featured = false }: NewsCardProps) {
  return (
    <Card className={`h-full overflow-hidden bg-gray-900/80 border border-gray-800 text-gray-100 ${featured ? "border-cyan-500" : ""}`}>
      <CardHeader className="pb-2">
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
