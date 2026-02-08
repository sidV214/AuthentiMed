import React, { useState } from 'react';
import {
  Stethoscope,
  LogOut,
  ScanLine,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Camera,
  MapPin,
  Calendar,
  Clock,
  Flag,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface DashboardProps {
  onLogout: () => void;
}

const mockScanResult = {
  batchId: 'BATCH-2026-001',
  medicineName: 'Amoxicillin 500mg',
  manufacturer: 'Pharma Corp Limited',
  manufacturingDate: '2026-01-15',
  expiryDate: '2028-01-15',
  aiAuthenticity: 98.5,
  status: 'verified',
  blockchainVerified: true,
  supplyChain: [
    {
      stage: 'Manufacturing',
      location: 'Mumbai Plant, India',
      timestamp: '2026-01-15 08:00',
      verified: true,
    },
    {
      stage: 'Quality Control',
      location: 'Mumbai Plant, India',
      timestamp: '2026-01-15 14:00',
      verified: true,
    },
    {
      stage: 'Warehouse Storage',
      location: 'Mumbai Central Warehouse',
      timestamp: '2026-01-16 10:00',
      verified: true,
    },
    {
      stage: 'Distribution',
      location: 'Swift Logistics',
      timestamp: '2026-01-20 06:00',
      verified: true,
    },
    {
      stage: 'Regional Distributor',
      location: 'Delhi Distribution Center',
      timestamp: '2026-01-22 15:00',
      verified: true,
    },
    {
      stage: 'Pharmacy Delivery',
      location: 'HealthCare Pharmacy, Delhi',
      timestamp: '2026-01-25 11:00',
      verified: true,
    },
  ],
};

const recentScans = [
  {
    id: 1,
    batchId: 'BATCH-2026-001',
    medicine: 'Amoxicillin 500mg',
    status: 'verified',
    aiScore: 98.5,
    timestamp: '2026-02-04 10:30',
  },
  {
    id: 2,
    batchId: 'BATCH-2026-034',
    medicine: 'Metformin 500mg',
    status: 'verified',
    aiScore: 94.8,
    timestamp: '2026-02-04 09:15',
  },
  {
    id: 3,
    batchId: 'BATCH-2026-087',
    medicine: 'Generic Aspirin 100mg',
    status: 'warning',
    aiScore: 67.2,
    timestamp: '2026-02-03 16:45',
  },
];

export function PharmacistApp({ onLogout }: DashboardProps) {
  const [showScanDialog, setShowScanDialog] = useState(false);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [showFlagDialog, setShowFlagDialog] = useState(false);

  const handleScan = () => {
    setShowScanDialog(false);
    setShowResultDialog(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-lg flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl">Pharmacist & Inspector</h1>
              <p className="text-sm text-gray-500">HealthCare Pharmacy, Delhi</p>
            </div>
          </div>
          <Button variant="outline" onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Scans Today</CardDescription>
              <CardTitle className="text-3xl">24</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-green-600">23 verified, 1 flagged</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Verified Medicines</CardDescription>
              <CardTitle className="text-3xl text-green-600">218</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">This month</p>
            </CardContent>
          </Card>

          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader className="pb-3">
              <CardDescription>Flagged Items</CardDescription>
              <CardTitle className="text-3xl text-yellow-600">3</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-yellow-700">Pending investigation</p>
            </CardContent>
          </Card>
        </div>

        {/* Scan Button */}
        <Card className="mb-8 bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <ScanLine className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl mb-2">Scan Medicine QR Code</h2>
            <p className="text-gray-600 mb-6">Verify authenticity and view complete supply chain history</p>
            <Dialog open={showScanDialog} onOpenChange={setShowScanDialog}>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700">
                  <ScanLine className="w-5 h-5 mr-2" />
                  Start Scanning
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Scan Medicine QR Code</DialogTitle>
                  <DialogDescription>Position the QR code within the frame to verify authenticity</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="border-4 border-teal-600 rounded-lg p-12 text-center bg-gray-900">
                    <div className="w-48 h-48 mx-auto border-4 border-dashed border-teal-400 rounded-lg flex items-center justify-center">
                      <ScanLine className="w-24 h-24 text-teal-400 animate-pulse" />
                    </div>
                    <p className="text-white mt-4">Scanning...</p>
                  </div>
                  <Button className="w-full" onClick={handleScan}>
                    Simulate Scan Result
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Tabs defaultValue="recent" className="space-y-6">
          <TabsList className="w-full">
            <TabsTrigger value="recent" className="flex-1">Recent Scans</TabsTrigger>
            <TabsTrigger value="flagged" className="flex-1">Flagged Items</TabsTrigger>
          </TabsList>

          {/* Recent Scans Tab */}
          <TabsContent value="recent" className="space-y-3">
            {recentScans.map((scan) => (
              <Card key={scan.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      {scan.status === 'verified' ? (
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                          <AlertTriangle className="w-6 h-6 text-yellow-600" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p>{scan.medicine}</p>
                          {scan.status === 'verified' && (
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Verified</Badge>
                          )}
                          {scan.status === 'warning' && (
                            <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Warning</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{scan.batchId}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                          <span>AI Score: {scan.aiScore}%</span>
                          <span>{scan.timestamp}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowResultDialog(true)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Flagged Items Tab */}
          <TabsContent value="flagged">
            <Card>
              <CardContent className="p-6">
                <div className="border-l-4 border-yellow-500 bg-yellow-50 p-4 rounded mb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h3>Generic Aspirin 100mg</h3>
                        <p className="text-sm text-gray-600">Batch: BATCH-2026-087</p>
                        <p className="text-sm text-gray-600 mt-2">
                          AI Confidence: 67.2% (Below standard threshold)
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Flagged on: 2026-02-03 16:45</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setShowFlagDialog(true)}>
                      <Flag className="w-4 h-4 mr-1" />
                      Report
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-gray-500 text-center">No other flagged items at this time</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Scan Result Dialog */}
      <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-green-600" />
              </div>
              <div>
                <div>Authenticity Verified</div>
                <div className="text-sm text-gray-500">AI Confidence: {mockScanResult.aiAuthenticity}%</div>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Medicine Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Medicine Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Medicine Name</p>
                  <p>{mockScanResult.medicineName}</p>
                </div>
                <div>
                  <p className="text-gray-500">Batch ID</p>
                  <p>{mockScanResult.batchId}</p>
                </div>
                <div>
                  <p className="text-gray-500">Manufacturer</p>
                  <p>{mockScanResult.manufacturer}</p>
                </div>
                <div>
                  <p className="text-gray-500">Manufacturing Date</p>
                  <p>{mockScanResult.manufacturingDate}</p>
                </div>
                <div>
                  <p className="text-gray-500">Expiry Date</p>
                  <p>{mockScanResult.expiryDate}</p>
                </div>
                <div>
                  <p className="text-gray-500">Blockchain Status</p>
                  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* AI Verification */}
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-lg">AI Verification Result</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span>Authenticity Confidence</span>
                  <span className="text-green-600">{mockScanResult.aiAuthenticity}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="h-3 rounded-full bg-green-600"
                    style={{ width: `${mockScanResult.aiAuthenticity}%` }}
                  />
                </div>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Packaging label verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Hologram authentication passed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Batch metadata validated</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Supply Chain Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Complete Blockchain Supply Chain History</CardTitle>
                <CardDescription>Verified end-to-end tracking from manufacturer to pharmacy</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockScanResult.supplyChain.map((stage, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        {index < mockScanResult.supplyChain.length - 1 && (
                          <div className="w-0.5 h-16 bg-green-300" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <h4>{stage.stage}</h4>
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {stage.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {stage.timestamp}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button className="flex-1" variant="outline" onClick={() => setShowFlagDialog(true)}>
                <Flag className="w-4 h-4 mr-2" />
                Report Issue
              </Button>
              <Button className="flex-1" onClick={() => setShowResultDialog(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Flag Dialog */}
      <Dialog open={showFlagDialog} onOpenChange={setShowFlagDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Suspicious Medicine</DialogTitle>
            <DialogDescription>
              Provide details and photos to flag this medicine for investigation
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm mb-2">Batch ID: {mockScanResult.batchId}</p>
              <p className="text-sm mb-4">Medicine: {mockScanResult.medicineName}</p>
            </div>
            <div>
              <label className="text-sm mb-2 block">Reason for flagging</label>
              <Textarea placeholder="Describe the issue (e.g., damaged packaging, suspicious labeling, etc.)" />
            </div>
            <div>
              <label className="text-sm mb-2 block">Upload Photos</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-teal-400 cursor-pointer transition-colors">
                <Camera className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-500">Click to upload photos</p>
              </div>
            </div>
            <Button className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700">
              <Flag className="w-4 h-4 mr-2" />
              Submit Report to Authorities
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
