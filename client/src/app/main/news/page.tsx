import { ClubDashboard } from "@/components/club-dashboard"

export default function News() {
  return (
    <div className="flex flex-col h-screen w-full bg-gray-900 text-gray-100 font-sans">
      <main className="flex-1 overflow-scroll p-4 md:p-8">
        <ClubDashboard />
      </main>
    </div>
  )
}
