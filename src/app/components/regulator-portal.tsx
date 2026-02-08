import React, { useState } from 'react';
import {
  Shield,
  LogOut,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Download,
  Search,
  TrendingUp,
  FileText,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  onLogout: () => void;
}

const trendData = [
  { month: 'Sep', verified: 156, flagged: 8, counterfeit: 3 },
  { month: 'Oct', verified: 178, flagged: 12, counterfeit: 5 },
  { month: 'Nov', verified: 192, flagged: 9, counterfeit: 2 },
  { month: 'Dec', verified: 203, flagged: 15, counterfeit: 7 },
  { month: 'Jan', verified: 215, flagged: 11, counterfeit: 4 },
  { month: 'Feb', verified: 124, flagged: 6, counterfeit: 2 },
];

const distributionData = [
  { name: 'Verified', value: 889, color: '#10b981' },
  { name: 'Pending Review', value: 61, color: '#f59e0b' },
  { name: 'Counterfeit Detected', value: 23, color: '#ef4444' },
];

const recentBatches = [
  {
    id: 'BATCH-2026-001',
    manufacturer: 'Pharma Corp Limited',
    medicine: 'Amoxicillin 500mg',
    aiScore: 98.5,
    status: 'verified',
    riskLevel: 'low',
    date: '2026-02-04',
  },
  {
    id: 'BATCH-2026-087',
    manufacturer: 'MediCare Pharma',
    medicine: 'Generic Aspirin 100mg',
    aiScore: 67.2,
    status: 'flagged',
    riskLevel: 'high',
    date: '2026-02-04',
  },
  {
    id: 'BATCH-2026-034',
    manufacturer: 'HealthFirst Inc',
    medicine: 'Metformin 500mg',
    aiScore: 94.8,
    status: 'verified',
    riskLevel: 'low',
    date: '2026-02-03',
  },
  {
    id: 'BATCH-2026-056',
    manufacturer: 'Unknown Supplier',
    medicine: 'Counterfeit Viagra',
    aiScore: 12.3,
    status: 'blocked',
    riskLevel: 'critical',
    date: '2026-02-02',
  },
];

const auditLogs = [
  {
    timestamp: '2026-02-04 15:45:23',
    batchId: 'BATCH-2026-087',
    action: 'Flagged for manual review',
    reason: 'AI confidence below threshold (67.2%)',
    user: 'System',
  },
  {
    timestamp: '2026-02-04 14:30:15',
    batchId: 'BATCH-2026-001',
    action: 'Verified and approved',
    reason: 'AI verification passed (98.5%)',
    user: 'System',
  },
  {
    timestamp: '2026-02-04 10:22:08',
    batchId: 'BATCH-2026-056',
    action: 'Blocked distribution',
    reason: 'Counterfeit detected - Label mismatch',
    user: 'Regulator A. Sharma',
  },
];

export function RegulatorPortal({ onLogout }: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl">Regulator Portal</h1>
              <p className="text-sm text-gray-500">Drug Control Administration</p>
            </div>
          </div>
          <Button variant="outline" onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Batches Monitored</CardDescription>
              <CardTitle className="text-3xl">973</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span>+8.2% this month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>AI Verified</CardDescription>
              <CardTitle className="text-3xl text-green-600">889</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">91.4% verification rate</p>
            </CardContent>
          </Card>

          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader className="pb-3">
              <CardDescription>Pending Review</CardDescription>
              <CardTitle className="text-3xl text-yellow-600">61</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-yellow-700">Requires manual inspection</p>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50">
            <CardHeader className="pb-3">
              <CardDescription>Counterfeit Detected</CardDescription>
              <CardTitle className="text-3xl text-red-600">23</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-red-700">Blocked from distribution</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by Batch ID, Manufacturer, or Medicine Name..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="batches">All Batches</TabsTrigger>
            <TabsTrigger value="audit">Audit Logs</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Verification Trends</CardTitle>
                  <CardDescription>Monthly AI verification results</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="verified" stroke="#10b981" name="Verified" strokeWidth={2} />
                      <Line type="monotone" dataKey="flagged" stroke="#f59e0b" name="Flagged" strokeWidth={2} />
                      <Line type="monotone" dataKey="counterfeit" stroke="#ef4444" name="Counterfeit" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Batch Distribution</CardTitle>
                  <CardDescription>Current status breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={distributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {distributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {distributionData.map((item) => (
                      <div key={item.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span>{item.name}</span>
                        </div>
                        <span>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>High-Risk Batches Requiring Attention</CardTitle>
                <CardDescription>Flagged by AI for manual review</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentBatches
                    .filter((b) => b.status === 'flagged' || b.status === 'blocked')
                    .map((batch) => (
                      <div
                        key={batch.id}
                        className="border-l-4 border-red-500 bg-red-50 p-4 rounded"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <AlertTriangle className="w-5 h-5 text-red-600" />
                              <h3>{batch.medicine}</h3>
                              <Badge
                                className={
                                  batch.riskLevel === 'critical'
                                    ? 'bg-red-600 text-white hover:bg-red-600'
                                    : 'bg-yellow-600 text-white hover:bg-yellow-600'
                                }
                              >
                                {batch.riskLevel} risk
                              </Badge>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="text-xs text-gray-500">Batch ID</p>
                                <p>{batch.id}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Manufacturer</p>
                                <p>{batch.manufacturer}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">AI Score</p>
                                <p className="text-red-600">{batch.aiScore}%</p>
                              </div>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            Review Details
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* All Batches Tab */}
          <TabsContent value="batches" className="space-y-3">
            {recentBatches.map((batch) => (
              <Card key={batch.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg">{batch.medicine}</h3>
                        {batch.status === 'verified' && (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                        {batch.status === 'flagged' && (
                          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Flagged
                          </Badge>
                        )}
                        {batch.status === 'blocked' && (
                          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                            <XCircle className="w-3 h-3 mr-1" />
                            Blocked
                          </Badge>
                        )}
                        <Badge
                          variant="outline"
                          className={
                            batch.riskLevel === 'critical'
                              ? 'border-red-600 text-red-600'
                              : batch.riskLevel === 'high'
                              ? 'border-orange-600 text-orange-600'
                              : 'border-green-600 text-green-600'
                          }
                        >
                          {batch.riskLevel} risk
                        </Badge>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-xs text-gray-500">Batch ID</p>
                          <p>{batch.id}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Manufacturer</p>
                          <p>{batch.manufacturer}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">AI Confidence</p>
                          <p
                            className={
                              batch.aiScore > 90
                                ? 'text-green-600'
                                : batch.aiScore > 70
                                ? 'text-yellow-600'
                                : 'text-red-600'
                            }
                          >
                            {batch.aiScore}%
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Date</p>
                          <p>{batch.date}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        Blockchain Log
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Audit Logs Tab */}
          <TabsContent value="audit">
            <Card>
              <CardHeader>
                <CardTitle>Tamper-Proof Blockchain Audit Logs</CardTitle>
                <CardDescription>Complete history of all regulatory actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {auditLogs.map((log, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4 py-3 bg-blue-50 rounded">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-sm text-gray-500">{log.timestamp}</p>
                          <p className="mb-1">{log.action}</p>
                          <p className="text-sm text-gray-600">Batch: {log.batchId}</p>
                        </div>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="text-sm">
                        <p className="text-gray-700">Reason: {log.reason}</p>
                        <p className="text-gray-500">Performed by: {log.user}</p>
                      </div>
                      <div className="mt-2 bg-white p-2 rounded font-mono text-xs text-gray-500">
                        Hash: 0x{Math.random().toString(36).substring(2, 15)}...
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Reports</CardTitle>
                <CardDescription>Generate detailed reports for regulatory compliance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: 'Monthly Verification Summary',
                      description: 'Complete overview of all batch verifications',
                      period: 'February 2026',
                    },
                    {
                      title: 'Counterfeit Detection Report',
                      description: 'Detailed analysis of detected counterfeit medicines',
                      period: 'Q1 2026',
                    },
                    {
                      title: 'Manufacturer Compliance Report',
                      description: 'Compliance scores and verification rates by manufacturer',
                      period: 'Last 6 months',
                    },
                    {
                      title: 'AI Performance Metrics',
                      description: 'AI model accuracy and detection statistics',
                      period: 'January 2026',
                    },
                  ].map((report, index) => (
                    <div key={index} className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-start gap-3">
                        <FileText className="w-5 h-5 text-blue-600 mt-1" />
                        <div>
                          <h3>{report.title}</h3>
                          <p className="text-sm text-gray-600">{report.description}</p>
                          <p className="text-xs text-gray-500 mt-1">Period: {report.period}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
