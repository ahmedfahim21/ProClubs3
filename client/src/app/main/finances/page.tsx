"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

interface RevenueData {
  month: string;
  matchday: number;
  commercial: number;
  broadcasting: number;
}

interface ExpenditureData {
  category: string;
  value: number;
}

// Mock data - replace with real data from your backend
const revenueData: RevenueData[] = [
  { month: "Jan", matchday: 1200000, commercial: 800000, broadcasting: 1500000 },
  { month: "Feb", matchday: 1500000, commercial: 850000, broadcasting: 1500000 },
  { month: "Mar", matchday: 1800000, commercial: 900000, broadcasting: 1500000 },
  { month: "Apr", matchday: 2000000, commercial: 950000, broadcasting: 1500000 },
  { month: "May", matchday: 2500000, commercial: 1000000, broadcasting: 1500000 },
];

const expenditureData: ExpenditureData[] = [
  { category: "Wages", value: 4500000 },
  { category: "Transfers", value: 2000000 },
  { category: "Facilities", value: 800000 },
  { category: "Operations", value: 600000 },
  { category: "Other", value: 400000 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function FinancesPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Club Finances</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(8300000)}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenditure</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(8300000)}</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(0)}</div>
            <p className="text-xs text-muted-foreground">Balanced budget</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Revenue Analysis</TabsTrigger>
          <TabsTrigger value="expenditure">Expenditure Breakdown</TabsTrigger>
          <TabsTrigger value="wages">Wage Structure</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Streams</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="matchday" stroke="#8884d8" name="Matchday" />
                    <Line type="monotone" dataKey="commercial" stroke="#82ca9d" name="Commercial" />
                    <Line type="monotone" dataKey="broadcasting" stroke="#ffc658" name="Broadcasting" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenditure" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Expenditure Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenditureData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {expenditureData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Wage Structure</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Wage to Revenue Ratio</h3>
                    <div className="text-2xl font-bold">54%</div>
                    <p className="text-xs text-muted-foreground">Healthy range: 50-70%</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2">Average Weekly Wage</h3>
                    <div className="text-2xl font-bold">{formatCurrency(25000)}</div>
                    <p className="text-xs text-muted-foreground">Per player</p>
                  </div>
                </div>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="matchday" stroke="#8884d8" name="Wage Bill" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 