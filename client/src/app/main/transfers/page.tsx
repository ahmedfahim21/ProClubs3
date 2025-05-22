"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ArrowRightLeft, Search, Clock, Star } from "lucide-react";
import { Icon } from "lucide-react";
import { soccerBall } from "@lucide/lab";

// Mock data for transfers
const transfers = [
  {
    id: 1,
    player: {
      name: "Jude Bellingham",
      position: "MC",
      age: 21,
      photo: "/api/placeholder/60/60",
      nationality: "England",
      stars: 5,
    },
    fromClub: {
      name: "Borussia Dortmund",
      badge: "/api/placeholder/32/32",
    },
    toClub: {
      name: "Real Madrid",
      badge: "/api/placeholder/32/32",
    },
    fee: "€103M",
    status: "Completed",
    date: "2024-07-01",
    details: "Record signing for Real Madrid. Box-to-box midfielder with huge potential.",
  },
  {
    id: 2,
    player: {
      name: "Victor Osimhen",
      position: "ST",
      age: 25,
      photo: "/api/placeholder/60/60",
      nationality: "Nigeria",
      stars: 4,
    },
    fromClub: {
      name: "Napoli",
      badge: "/api/placeholder/32/32",
    },
    toClub: {
      name: "Manchester United",
      badge: "/api/placeholder/32/32",
    },
    fee: "€120M",
    status: "Pending",
    date: "2024-08-10",
    details: "Negotiations ongoing. Top scorer in Serie A last season.",
  },
  {
    id: 3,
    player: {
      name: "João Cancelo",
      position: "DR",
      age: 29,
      photo: "/api/placeholder/60/60",
      nationality: "Portugal",
      stars: 4,
    },
    fromClub: {
      name: "Manchester City",
      badge: "/api/placeholder/32/32",
    },
    toClub: {
      name: "Barcelona",
      badge: "/api/placeholder/32/32",
    },
    fee: "Loan",
    status: "Completed",
    date: "2024-06-20",
    details: "Season-long loan with option to buy.",
  },
  // Add more mock transfers as needed
];

const shortlist = [
  {
    id: 4,
    player: {
      name: "Benjamin Šeško",
      position: "ST",
      age: 20,
      photo: "/api/placeholder/60/60",
      nationality: "Slovenia",
      stars: 3,
    },
    fromClub: {
      name: "RB Leipzig",
      badge: "/api/placeholder/32/32",
    },
    toClub: null,
    fee: null,
    status: "Shortlisted",
    date: null,
    details: "Young striker with high potential. Monitored by top clubs.",
  },
];

const history = transfers.filter(t => t.status === "Completed");

const statusColor = (status: string) => {
  switch (status) {
    case "Completed": return "bg-green-600 text-white";
    case "Pending": return "bg-yellow-500 text-gray-900";
    case "Shortlisted": return "bg-blue-500 text-white";
    default: return "bg-gray-500 text-white";
  }
};

export default function TransfersPage() {
  const [tab, setTab] = useState("list");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredTransfers = transfers.filter(t => {
    const matchesSearch = t.player.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "all" || t.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col h-full w-full bg-gray-950 text-gray-100 font-sans p-6 gap-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-gray-800">
        <div className="flex items-center gap-3 text-2xl font-bold text-blue-400">
          <Icon iconNode={soccerBall} className="h-7 w-7" />
          Transfers
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-gray-800 px-3 py-1 rounded-md text-sm font-medium flex items-center">
            <ArrowRightLeft className="h-4 w-4 mr-1 text-blue-400" />
            <span className="text-gray-400">Season 2024/25</span>
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-800 mb-2">
        <button onClick={() => setTab("list")} className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors ${tab === "list" ? "bg-gray-800 text-blue-400" : "text-gray-400 hover:text-white hover:bg-gray-800/50"}`}>Transfer List</button>
        <button onClick={() => setTab("history")} className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors ${tab === "history" ? "bg-gray-800 text-green-400" : "text-gray-400 hover:text-white hover:bg-gray-800/50"}`}>History</button>
        <button onClick={() => setTab("shortlist")} className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors ${tab === "shortlist" ? "bg-gray-800 text-purple-400" : "text-gray-400 hover:text-white hover:bg-gray-800/50"}`}>Shortlist</button>
      </div>

      {/* Filters/Search */}
      {tab === "list" && (
        <div className="flex flex-wrap gap-3 items-center mb-2">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Input
                className="bg-gray-900 text-gray-100 border-gray-800 w-56 pl-8"
                placeholder="Search player..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <Select
              value={filterStatus}
              onValueChange={setFilterStatus}
            >
              <option value="all">All Status</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
            </Select>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1">
        {tab === "list" && (
          <Card className="bg-gray-900 p-0 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-800 text-gray-300">
                <tr>
                  <th className="px-4 py-3 text-left">Player</th>
                  <th className="px-4 py-3 text-left">Position</th>
                  <th className="px-4 py-3 text-left">Age</th>
                  <th className="px-4 py-3 text-left">From</th>
                  <th className="px-4 py-3 text-left">To</th>
                  <th className="px-4 py-3 text-left">Fee</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransfers.map(t => (
                  <tr key={t.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition cursor-pointer" onClick={() => { setSelected(t); setDrawerOpen(true); }}>
                    <td className="px-4 py-3 flex items-center gap-2">
                      <span className="font-medium text-white">{t.player.name}</span>
                    </td>
                    <td className="px-4 py-3">{t.player.position}</td>
                    <td className="px-4 py-3">{t.player.age}</td>
                    <td className="px-4 py-3 flex items-center gap-2">
                      
                      <span>{t.fromClub.name}</span>
                    </td>
                    <td className="px-4 py-3 flex items-center gap-2">
                      
                      <span>{t.toClub.name}</span>
                    </td>
                    <td className="px-4 py-3">{t.fee}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColor(t.status)}`}>{t.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Button size="sm" variant="secondary">View</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
        {tab === "history" && (
          <Card className="bg-gray-900 p-0 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-800 text-gray-300">
                <tr>
                  <th className="px-4 py-3 text-left">Player</th>
                  <th className="px-4 py-3 text-left">From</th>
                  <th className="px-4 py-3 text-left">To</th>
                  <th className="px-4 py-3 text-left">Fee</th>
                  <th className="px-4 py-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {history.map(t => (
                  <tr key={t.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition cursor-pointer" onClick={() => { setSelected(t); setDrawerOpen(true); }}>
                    <td className="px-4 py-3 flex items-center gap-2">
                      <span className="font-medium text-white">{t.player.name}</span>
                    </td>
                    <td className="px-4 py-3 flex items-center gap-2">
                      
                      <span>{t.fromClub.name}</span>
                    </td>
                    <td className="px-4 py-3 flex items-center gap-2">
                      
                      <span>{t.toClub.name}</span>
                    </td>
                    <td className="px-4 py-3">{t.fee}</td>
                    <td className="px-4 py-3">{t.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
        {tab === "shortlist" && (
          <Card className="bg-gray-900 p-0 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-800 text-gray-300">
                <tr>
                  <th className="px-4 py-3 text-left">Player</th>
                  <th className="px-4 py-3 text-left">Position</th>
                  <th className="px-4 py-3 text-left">Age</th>
                  <th className="px-4 py-3 text-left">From</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {shortlist.map(t => (
                  <tr key={t.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition cursor-pointer" onClick={() => { setSelected(t); setDrawerOpen(true); }}>
                    <td className="px-4 py-3 flex items-center gap-2">
                      <span className="font-medium text-white">{t.player.name}</span>
                    </td>
                    <td className="px-4 py-3">{t.player.position}</td>
                    <td className="px-4 py-3">{t.player.age}</td>
                    <td className="px-4 py-3 flex items-center gap-2">
                      
                      <span>{t.fromClub.name}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColor(t.status)}`}>{t.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Button size="sm" variant="secondary">View</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>

      {/* Details Drawer/Modal */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="right" className="max-w-md w-full bg-gray-900 text-gray-100">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <span>{selected.player.name}</span>
                  <span className="ml-2 px-2 py-1 rounded text-xs font-semibold bg-gray-800 text-blue-400">{selected.player.position}</span>
                </SheetTitle>
                <SheetDescription>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-gray-400">{selected.fromClub.name}</span>
                    <ArrowRightLeft className="h-4 w-4 text-blue-400 mx-2" />
                    {selected.toClub && <>x
                    <span className="text-gray-400">{selected.toClub.name}</span></>}
                  </div>
                  <div className="mt-2 text-sm text-gray-300">{selected.details}</div>
                </SheetDescription>
              </SheetHeader>
              <div className="mt-4 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Age:</span>
                  <span className="font-medium">{selected.player.age}</span>
                  <span className="text-xs text-gray-400 ml-4">Nationality:</span>
                  <span className="font-medium">{selected.player.nationality}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Stars:</span>
                  {[...Array(selected.player.stars)].map((_, i) => <Star key={i} className="h-4 w-4 text-yellow-400 inline" />)}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-gray-400">Fee:</span>
                  <span className="font-medium">{selected.fee || "-"}</span>
                  <span className="text-xs text-gray-400 ml-4">Status:</span>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColor(selected.status)}`}>{selected.status}</span>
                </div>
                {selected.date && (
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-xs text-gray-400">Date:</span>
                    <span className="font-medium">{selected.date}</span>
                  </div>
                )}
              </div>
              <div className="mt-6 flex gap-2">
                {selected.status === "Pending" && <Button variant="default">Make Offer</Button>}
                <Button variant="secondary" onClick={() => setDrawerOpen(false)}>Close</Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
} 