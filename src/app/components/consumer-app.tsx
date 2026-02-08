import React, { useState } from 'react';
import {
  User,
  LogOut,
  ScanLine,
  CheckCircle,
  AlertTriangle,
  Shield,
  MapPin,
  Calendar,
  Building2,
  Package,
  Info,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

interface DashboardProps {
  onLogout: () => void;
}

const mockVerifiedResult = {
  status: 'verified',
  medicineName: 'Amoxicillin 500mg',
  manufacturer: 'Pharma Corp Limited',
  batchId: 'BATCH-2026-001',
  manufacturingDate: '2026-01-15',
  expiryDate: '2028-01-15',
  origin: 'Mumbai, India',
  confidence: 98.5,
  transportHistory: [
    { location: 'Mumbai Manufacturing Plant', date: '2026-01-15' },
    { location: 'Mumbai Warehouse', date: '2026-01-16' },
    { location: 'Delhi Distribution Center', date: '2026-01-22' },
    { location: 'Local Pharmacy', date: '2026-01-25' },
  ],
};

const mockWarningResult = {
  status: 'warning',
  medicineName: 'Generic Aspirin 100mg',
  manufacturer: 'Unknown',
  batchId: 'Unknown',
  message: 'Unable to verify authenticity. This medicine may be counterfeit.',
  warnings: [
    'Batch ID not found in blockchain',
    'No manufacturing records available',
    'Packaging does not match authorized design',
  ],
};

const recentScans = [
  {
    id: 1,
    medicine: 'Amoxicillin 500mg',
    status: 'verified',
    date: '2026-02-04',
    pharmacy: 'City Health Pharmacy',
  },
  {
    id: 2,
    medicine: 'Paracetamol 650mg',
    status: 'verified',
    date: '2026-01-28',
    pharmacy: 'MediCare Store',
  },
];

export function ConsumerApp({ onLogout }: DashboardProps) {
  const [showScanDialog, setShowScanDialog] = useState(false);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [resultType, setResultType] = useState<'verified' | 'warning'>('verified');

  const handleScan = (type: 'verified' | 'warning') => {
    setResultType(type);
    setShowScanDialog(false);
    setShowResultDialog(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl">SmartMedChain</h1>
              <p className="text-sm text-gray-500">Medicine Verification</p>
            </div>
          </div>
          <Button variant="outline" onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8 max-w-2xl">
        {/* Hero Section */}
        <Card className="mb-8 bg-gradient-to-br from-blue-600 to-cyan-600 text-white border-0">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl mb-3">Verify Your Medicine</h2>
            <p className="text-blue-100 mb-6 text-lg">
              Scan the QR code on your medicine packaging to instantly verify its authenticity
            </p>
            <Dialog open={showScanDialog} onOpenChange={setShowScanDialog}>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                  <ScanLine className="w-5 h-5 mr-2" />
                  Scan QR Code
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Scan Medicine QR Code</DialogTitle>
                  <DialogDescription>
                    Point your camera at the QR code on the medicine packaging
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="border-4 border-blue-600 rounded-lg p-12 text-center bg-gray-900">
                    <div className="w-48 h-48 mx-auto border-4 border-dashed border-blue-400 rounded-lg flex items-center justify-center">
                      <ScanLine className="w-24 h-24 text-blue-400 animate-pulse" />
                    </div>
                    <p className="text-white mt-4">Scanning...</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button className="w-full" onClick={() => handleScan('verified')}>
                      Simulate Verified
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => handleScan('warning')}>
                      Simulate Warning
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
            <CardDescription>Verify medicine authenticity in 3 simple steps</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600">1</span>
                </div>
                <div>
                  <h3 className="mb-1">Scan QR Code</h3>
                  <p className="text-sm text-gray-600">
                    Use your phone camera to scan the QR code on the medicine packaging
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600">2</span>
                </div>
                <div>
                  <h3 className="mb-1">AI Verification</h3>
                  <p className="text-sm text-gray-600">
                    Our AI system instantly checks the medicine authenticity and blockchain records
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600">3</span>
                </div>
                <div>
                  <h3 className="mb-1">View Results</h3>
                  <p className="text-sm text-gray-600">
                    See verification status, origin, and complete supply chain history
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Scans */}
        {recentScans.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Scans</CardTitle>
              <CardDescription>Your verification history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentScans.map((scan) => (
                  <div key={scan.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p>{scan.medicine}</p>
                      <p className="text-sm text-gray-500">{scan.pharmacy}</p>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <p>{scan.date}</p>
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Verified</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Box */}
        <Card className="mt-6 border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="mb-2">
                  <strong>Why verify your medicines?</strong>
                </p>
                <p className="text-blue-800">
                  Counterfeit medicines are a serious health risk. Always verify your medicines using SmartMedChain
                  to ensure you're getting genuine, safe medication from authorized manufacturers.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Verified Result Dialog */}
      <Dialog
        open={showResultDialog && resultType === 'verified'}
        onOpenChange={(open) => {
          if (!open && resultType === 'verified') setShowResultDialog(false);
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <div className="text-2xl text-green-600">Medicine Verified ✓</div>
                <div className="text-sm text-gray-500">This medicine is authentic and safe</div>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Trust Indicator */}
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Shield className="w-6 h-6 text-green-600" />
                    <span>Trust Score</span>
                  </div>
                  <Badge className="bg-green-600 text-white hover:bg-green-600 text-lg px-3 py-1">
                    {mockVerifiedResult.confidence}%
                  </Badge>
                </div>
                <div className="w-full bg-green-200 rounded-full h-3">
                  <div
                    className="h-3 rounded-full bg-green-600"
                    style={{ width: `${mockVerifiedResult.confidence}%` }}
                  />
                </div>
                <p className="text-sm text-green-800 mt-3">
                  This medicine has been verified through AI analysis and blockchain technology
                </p>
              </CardContent>
            </Card>

            {/* Medicine Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Medicine Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Medicine Name</p>
                    <p>{mockVerifiedResult.medicineName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Manufacturer</p>
                    <p>{mockVerifiedResult.manufacturer}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Origin</p>
                    <p>{mockVerifiedResult.origin}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Manufacturing Date</p>
                    <p>{mockVerifiedResult.manufacturingDate}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Expiry Date</p>
                    <p>{mockVerifiedResult.expiryDate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transport History */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  Blockchain-Verified Supply Chain
                </CardTitle>
                <CardDescription>Complete journey from manufacturer to you</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockVerifiedResult.transportHistory.map((step, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        {index < mockVerifiedResult.transportHistory.length - 1 && (
                          <div className="w-0.5 h-12 bg-blue-200" />
                        )}
                      </div>
                      <div className="flex-1 pb-2">
                        <p>{step.location}</p>
                        <p className="text-sm text-gray-500">{step.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Button
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              onClick={() => setShowResultDialog(false)}
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Warning Result Dialog */}
      <Dialog
        open={showResultDialog && resultType === 'warning'}
        onOpenChange={(open) => {
          if (!open && resultType === 'warning') setShowResultDialog(false);
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <div className="text-2xl text-red-600">Warning: Cannot Verify</div>
                <div className="text-sm text-gray-500">This medicine may be counterfeit</div>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Warning Message */}
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-6">
                <div className="flex gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-900 mb-3">
                      <strong>{mockWarningResult.message}</strong>
                    </p>
                    <div className="space-y-2">
                      {mockWarningResult.warnings.map((warning, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-600 mt-2" />
                          <p className="text-sm text-red-800">{warning}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* What to Do */}
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="text-lg">What Should I Do?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex gap-2">
                  <span className="text-yellow-600">1.</span>
                  <p>
                    <strong>Do not consume this medicine</strong> - It may be harmful to your health
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className="text-yellow-600">2.</span>
                  <p>
                    <strong>Return to the pharmacy</strong> - Take the medicine back to where you purchased it
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className="text-yellow-600">3.</span>
                  <p>
                    <strong>Report to authorities</strong> - Contact local drug control administration
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className="text-yellow-600">4.</span>
                  <p>
                    <strong>Buy from authorized sources</strong> - Always purchase from licensed pharmacies
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowResultDialog(false)}
              >
                Close
              </Button>
              <Button className="flex-1 bg-red-600 hover:bg-red-700">
                Report to Authorities
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
