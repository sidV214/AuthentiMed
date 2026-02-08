import React, { useState } from 'react';
import {
  Building2,
  LogOut,
  Plus,
  Upload,
  QrCode,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Package,
  Calendar,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  onLogout: () => void;
}

const mockBatches = [
  {
    id: 'BATCH-2026-001',
    medicineName: 'Amoxicillin 500mg',
    quantity: 10000,
    status: 'verified',
    aiConfidence: 98.5,
    date: '2026-02-01',
    location: 'Mumbai Plant',
  },
  {
    id: 'BATCH-2026-002',
    medicineName: 'Ibuprofen 200mg',
    quantity: 15000,
    status: 'verified',
    aiConfidence: 97.2,
    date: '2026-02-02',
    location: 'Delhi Plant',
  },
  {
    id: 'BATCH-2026-003',
    medicineName: 'Paracetamol 650mg',
    quantity: 20000,
    status: 'pending',
    aiConfidence: null,
    date: '2026-02-04',
    location: 'Bangalore Plant',
  },
];

const chartData = [
  { month: 'Jan', verified: 45, pending: 3, failed: 2 },
  { month: 'Feb', verified: 38, pending: 5, failed: 1 },
];

export function ManufacturerDashboard({ onLogout }: DashboardProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);

  const handleGenerateQR = (batchId: string) => {
    setSelectedBatch(batchId);
    setShowQRDialog(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl">Manufacturer Dashboard</h1>
              <p className="text-sm text-gray-500">Pharma Corp Limited</p>
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
              <CardDescription>Total Batches</CardDescription>
              <CardTitle className="text-3xl">127</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span>+12% this month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>AI Verified</CardDescription>
              <CardTitle className="text-3xl text-green-600">119</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={93.7} className="h-2" />
              <p className="text-sm text-gray-500 mt-2">93.7% success rate</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Pending Review</CardDescription>
              <CardTitle className="text-3xl text-yellow-600">6</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Awaiting AI verification</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Failed Verification</CardDescription>
              <CardTitle className="text-3xl text-red-600">2</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Requires attention</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="batches" className="space-y-6">
          <TabsList>
            <TabsTrigger value="batches">Medicine Batches</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          {/* Batches Tab */}
          <TabsContent value="batches" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl">Recent Batches</h2>
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Batch
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Medicine Batch</DialogTitle>
                    <DialogDescription>Upload packaging images and quality certificates for AI verification</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Batch ID</Label>
                        <Input placeholder="BATCH-2026-XXX" />
                      </div>
                      <div>
                        <Label>Medicine Name</Label>
                        <Input placeholder="e.g., Aspirin 100mg" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Quantity</Label>
                        <Input type="number" placeholder="10000" />
                      </div>
                      <div>
                        <Label>Manufacturing Date</Label>
                        <Input type="date" />
                      </div>
                    </div>
                    <div>
                      <Label>Upload Packaging Images</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 cursor-pointer transition-colors">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
                      </div>
                    </div>
                    <div>
                      <Label>Quality Certificates</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 cursor-pointer transition-colors">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-500">Upload quality certificates (PDF)</p>
                      </div>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                      Submit for AI Verification
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-3">
              {mockBatches.map((batch) => (
                <Card key={batch.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Package className="w-5 h-5 text-blue-600" />
                          <h3 className="text-lg">{batch.medicineName}</h3>
                          {batch.status === 'verified' && (
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                          {batch.status === 'pending' && (
                            <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Pending
                            </Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <p className="text-xs text-gray-500">Batch ID</p>
                            <p>{batch.id}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Quantity</p>
                            <p>{batch.quantity.toLocaleString()} units</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Date</p>
                            <p>{batch.date}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Location</p>
                            <p>{batch.location}</p>
                          </div>
                        </div>
                        {batch.aiConfidence && (
                          <div className="mt-4">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-gray-600">AI Confidence Score</span>
                              <span className="text-green-600">{batch.aiConfidence}%</span>
                            </div>
                            <Progress value={batch.aiConfidence} className="h-2" />
                          </div>
                        )}
                      </div>
                      {batch.status === 'verified' && (
                        <Button
                          variant="outline"
                          className="ml-4"
                          onClick={() => handleGenerateQR(batch.id)}
                        >
                          <QrCode className="w-4 h-4 mr-2" />
                          View QR Code
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Batch Verification Analytics</CardTitle>
                <CardDescription>Monthly overview of AI verification results</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="verified" fill="#10b981" name="Verified" />
                    <Bar dataKey="pending" fill="#f59e0b" name="Pending" />
                    <Bar dataKey="failed" fill="#ef4444" name="Failed" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline">
            <Card>
              <CardHeader>
                <CardTitle>Batch Lifecycle Timeline</CardTitle>
                <CardDescription>Track batch progress from creation to distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    { date: '2026-02-04 09:00', event: 'Batch created', status: 'completed' },
                    { date: '2026-02-04 09:15', event: 'Images uploaded', status: 'completed' },
                    { date: '2026-02-04 09:30', event: 'AI verification initiated', status: 'completed' },
                    { date: '2026-02-04 09:35', event: 'AI verification passed (98.5%)', status: 'completed' },
                    { date: '2026-02-04 10:00', event: 'QR code generated', status: 'completed' },
                    { date: '2026-02-04 14:00', event: 'Blockchain record created', status: 'completed' },
                    { date: 'Pending', event: 'Shipped to distributor', status: 'pending' },
                  ].map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            item.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                        />
                        {index < 6 && <div className="w-0.5 h-12 bg-gray-200" />}
                      </div>
                      <div className="flex-1 pb-8">
                        <p className="text-sm text-gray-500">{item.date}</p>
                        <p>{item.event}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* QR Code Dialog */}
      <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Blockchain QR Code</DialogTitle>
            <DialogDescription>
              This QR code is linked to the blockchain record for batch {selectedBatch}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center py-6">
            <div className="w-64 h-64 bg-white border-4 border-blue-600 rounded-lg flex items-center justify-center mb-4">
              <QrCode className="w-48 h-48 text-gray-800" />
            </div>
            <p className="text-sm text-gray-500 mb-4">Batch ID: {selectedBatch}</p>
            <Button className="w-full">Download QR Code</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
