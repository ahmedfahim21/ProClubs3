"use client";

import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Image from "next/image";

export default function ClubInfoPage() {
  return (
    <div className="w-full mx-auto py-10 px-4 space-y-8 bg-gray-900">
      {/* Club Overview */}
      <div className="flex flex-col md:flex-row items-center gap-8">
        <Image
          src="/ProClubs3.png"
          alt="Club Logo"
          width={120}
          height={120}
          className=""
        />
        <div>
          <h1 className="text-3xl font-bold mb-2">FC United</h1>
          <div className="text-blue-700 font-semibold text-lg mb-1">Founded: 1892</div>
          <div className="text-gray-600">City: Manchester, England</div>
          <div className="text-gray-600">Nickname: The Reds</div>
          <div className="text-gray-600">Stadium: United Stadium (60,000)</div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="flex flex-wrap gap-2 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="honors">Honors</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="finances">Finances</TabsTrigger>
          <TabsTrigger value="culture">Club Culture</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <Card className="p-6 space-y-4">
            <div className="text-lg font-semibold">Stadium</div>
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <Image src="/stadium.jpg" alt="Stadium" width={320} height={180} className="rounded-lg shadow-md" />
              <div>
                <div className="font-bold">United Stadium</div>
                <div>Capacity: 60,000</div>
                <div>Pitch: Hybrid Grass</div>
                <div>Year Opened: 1923 (Renovated 2024)</div>
                <div>Facilities: Elite Training, Medical Centre, Youth Academy</div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <Card className="p-6 space-y-2">
            <div className="text-lg font-semibold mb-2">Club History</div>
            <p>Founded in 1892, FC United has a rich tradition of attacking football and a passionate fanbase. The club has overcome financial crises, relegations, and triumphant returns to the top flight. Known for its youth development and iconic red kits, United is a symbol of resilience and ambition.</p>
            <ul className="list-disc ml-6 mt-2 text-gray-700">
              <li>First major trophy: FA Cup, 1908</li>
              <li>European debut: 1956</li>
              <li>Historic treble: 1999</li>
              <li>Modern era resurgence: 2010s-present</li>
            </ul>
          </Card>
        </TabsContent>

        {/* Honors Tab */}
        <TabsContent value="honors">
          <Card className="p-6">
            <div className="text-lg font-semibold mb-2">Major Honors</div>
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-2 text-gray-700">
              <li>Premier League: 13</li>
              <li>FA Cup: 8</li>
              <li>League Cup: 5</li>
              <li>Champions League: 3</li>
              <li>Europa League: 2</li>
              <li>FIFA Club World Cup: 1</li>
            </ul>
          </Card>
        </TabsContent>

        {/* Staff Tab */}
        <TabsContent value="staff">
          <Card className="p-6">
            <div className="text-lg font-semibold mb-2">Key Staff</div>
            <ul className="space-y-1">
              <li><span className="font-bold">Manager:</span> David Miller</li>
              <li><span className="font-bold">Assistant Manager:</span> Sarah Lee</li>
              <li><span className="font-bold">Director of Football:</span> Michael Grant</li>
              <li><span className="font-bold">Head of Youth Development:</span> Emma Brown</li>
              <li><span className="font-bold">Chief Scout:</span> Tom Evans</li>
              <li><span className="font-bold">Medical Lead:</span> Dr. Rachel Green</li>
            </ul>
          </Card>
        </TabsContent>

        {/* Finances Tab */}
        <TabsContent value="finances">
          <Card className="p-6">
            <div className="text-lg font-semibold mb-2">Financial Overview</div>
            <ul className="space-y-1 text-gray-700">
              <li><span className="font-bold">Estimated Value:</span> £1.2 Billion</li>
              <li><span className="font-bold">Annual Revenue:</span> £420 Million</li>
              <li><span className="font-bold">Wage Budget:</span> £180 Million</li>
              <li><span className="font-bold">Transfer Budget:</span> £60 Million</li>
              <li><span className="font-bold">Debt:</span> £120 Million</li>
            </ul>
          </Card>
        </TabsContent>

        {/* Club Culture Tab */}
        <TabsContent value="culture">
          <Card className="p-6">
            <div className="text-lg font-semibold mb-2">Club Culture & Philosophy</div>
            <ul className="list-disc ml-6 text-gray-700 space-y-1">
              <li>Attacking, possession-based football</li>
              <li>Promote youth academy graduates</li>
              <li>High-pressing, energetic style</li>
              <li>Strong community engagement</li>
              <li>Global fanbase with local roots</li>
            </ul>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 