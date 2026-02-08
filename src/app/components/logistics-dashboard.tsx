import React, { useState } from 'react';
import {
  Truck,
  LogOut,
  ScanLine,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  Package,
  Navigation,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';

interface DashboardProps {
  onLogout: () => void;
}

const mockShipments = [
  {
    id: 'SHIP-2026-101',
    batchId: 'BATCH-2026-001',
    medicine: 'Amoxicillin 500mg',
    from: 'Mumbai Plant',
    to: 'Delhi Warehouse',
    status: 'in-transit',
    progress: 65,
    eta: '2026-02-05 14:00',
    currentLocation: 'Ahmedabad',
    temperature: '22°C',
    alerts: 0,
  },
  {
    id: 'SHIP-2026-102',
    batchId: 'BATCH-2026-002',
    medicine: 'Ibuprofen 200mg',
    from: 'Delhi Plant',
    to: 'Bangalore Pharmacy',
    status: 'delivered',
    progress: 100,
    eta: '2026-02-03 10:00',
    currentLocation: 'Bangalore Pharmacy',
    temperature: '21°C',
    alerts: 0,
  },
  {
    id: 'SHIP-2026-103',
    batchId: 'BATCH-2026-005',
    medicine: 'Aspirin 75mg',
    from: 'Chennai Plant',
    to: 'Kolkata Distributor',
    status: 'alert',
    progress: 45,
    eta: '2026-02-06 16:00',
    currentLocation: 'Bhubaneswar',
    temperature: '28°C',
    alerts: 2,
  },
];

const blockchainTransfers = [
  {
    timestamp: '2026-02-04 08:00',
    from: 'Pharma Corp Limited',
    to: 'Swift Logistics',
    action: 'Transfer initiated',
    hash: '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385',
  },
  {
    timestamp: '2026-02-04 08:15',
    from: 'Swift Logistics',
    to: 'Transport Vehicle TX-1234',
    action: 'Loaded for dispatch',
    hash: '0x3c2c2eb7b11a91385f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4e',
  },
  {
    timestamp: '2026-02-04 14:30',
    from: 'Checkpoint - Ahmedabad',
    to: 'Transport Vehicle TX-1234',
    action: 'Location verified',
    hash: '0x91385f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4e3c2c2eb7b11a',
  },
];

export function LogisticsDashboard({ onLogout }: DashboardProps) {
  const [showScanDialog, setShowScanDialog] = useState(false);
  const [showBlockchainDialog, setShowBlockchainDialog] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<string | null>(null);

  const handleViewBlockchain = (shipmentId: string) => {
    setSelectedShipment(shipmentId);
    setShowBlockchainDialog(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-teal-600 rounded-lg flex items-center justify-center">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl">Logistics Dashboard</h1>
              <p className="text-sm text-gray-500">Swift Logistics & Distribution</p>
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
              <CardDescription>Active Shipments</CardDescription>
              <CardTitle className="text-3xl">18</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Currently in transit</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Delivered Today</CardDescription>
              <CardTitle className="text-3xl text-green-600">24</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">On-time delivery: 96%</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Blockchain Verified</CardDescription>
              <CardTitle className="text-3xl text-blue-600">156</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">All transfers logged</p>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50">
            <CardHeader className="pb-3">
              <CardDescription>Active Alerts</CardDescription>
              <CardTitle className="text-3xl text-red-600">3</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-red-600">Requires attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <Dialog open={showScanDialog} onOpenChange={setShowScanDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700">
                <ScanLine className="w-4 h-4 mr-2" />
                Scan Batch QR Code
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Scan Batch QR Code</DialogTitle>
                <DialogDescription>Scan to update shipment status and record blockchain transfer</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <ScanLine className="w-16 h-16 mx-auto mb-3 text-gray-400" />
                  <p className="text-sm text-gray-500">Position QR code within frame</p>
                  <p className="text-xs text-gray-400 mt-1">Camera will activate automatically</p>
                </div>
                <div className="text-center text-sm text-gray-500">OR</div>
                <div>
                  <Input placeholder="Enter Batch ID manually" />
                </div>
                <Button className="w-full">Confirm Scan & Update Blockchain</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline">
            <MapPin className="w-4 h-4 mr-2" />
            View Live Map
          </Button>
        </div>

        <Tabs defaultValue="shipments" className="space-y-6">
          <TabsList>
            <TabsTrigger value="shipments">Active Shipments</TabsTrigger>
            <TabsTrigger value="alerts">Alerts & Anomalies</TabsTrigger>
            <TabsTrigger value="history">Delivery History</TabsTrigger>
          </TabsList>

          {/* Shipments Tab */}
          <TabsContent value="shipments" className="space-y-4">
            {mockShipments.map((shipment) => (
              <Card key={shipment.id} className={shipment.status === 'alert' ? 'border-red-300' : ''}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          shipment.status === 'delivered'
                            ? 'bg-green-100'
                            : shipment.status === 'alert'
                            ? 'bg-red-100'
                            : 'bg-blue-100'
                        }`}
                      >
                        <Package
                          className={`w-6 h-6 ${
                            shipment.status === 'delivered'
                              ? 'text-green-600'
                              : shipment.status === 'alert'
                              ? 'text-red-600'
                              : 'text-blue-600'
                          }`}
                        />
                      </div>
                      <div>
                        <h3 className="text-lg">{shipment.medicine}</h3>
                        <p className="text-sm text-gray-500">Shipment ID: {shipment.id}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {shipment.status === 'delivered' && (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Delivered
                        </Badge>
                      )}
                      {shipment.status === 'in-transit' && (
                        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                          <Navigation className="w-3 h-3 mr-1" />
                          In Transit
                        </Badge>
                      )}
                      {shipment.status === 'alert' && (
                        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          {shipment.alerts} Alerts
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <p className="text-xs text-gray-500">From</p>
                      <p>{shipment.from}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">To</p>
                      <p>{shipment.to}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Current Location</p>
                      <p className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {shipment.currentLocation}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Temperature</p>
                      <p>{shipment.temperature}</p>
                    </div>
                  </div>

                  {shipment.status !== 'delivered' && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600 flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Progress
                        </span>
                        <span>ETA: {shipment.eta}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            shipment.status === 'alert' ? 'bg-red-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${shipment.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {shipment.status === 'alert' && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
                        <div className="text-sm">
                          <p className="text-red-900">Temperature threshold exceeded</p>
                          <p className="text-red-700">Route deviation detected - 15km off planned route</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewBlockchain(shipment.id)}
                    >
                      View Blockchain History
                    </Button>
                    <Button variant="outline" size="sm">
                      <MapPin className="w-4 h-4 mr-1" />
                      Track on Map
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts">
            <Card>
              <CardHeader>
                <CardTitle>AI Anomaly Detection Alerts</CardTitle>
                <CardDescription>Real-time alerts for suspicious activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      time: '2026-02-04 15:30',
                      type: 'Route Deviation',
                      shipment: 'SHIP-2026-103',
                      severity: 'high',
                      message: 'Vehicle deviated 15km from planned route',
                    },
                    {
                      time: '2026-02-04 14:15',
                      type: 'Temperature Alert',
                      shipment: 'SHIP-2026-103',
                      severity: 'medium',
                      message: 'Temperature exceeded 25°C threshold',
                    },
                    {
                      time: '2026-02-04 10:00',
                      type: 'Unusual Stop',
                      shipment: 'SHIP-2026-105',
                      severity: 'low',
                      message: 'Unscheduled stop for 45 minutes',
                    },
                  ].map((alert, index) => (
                    <div
                      key={index}
                      className={`border-l-4 p-4 rounded ${
                        alert.severity === 'high'
                          ? 'border-red-500 bg-red-50'
                          : alert.severity === 'medium'
                          ? 'border-yellow-500 bg-yellow-50'
                          : 'border-blue-500 bg-blue-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <AlertTriangle
                              className={`w-4 h-4 ${
                                alert.severity === 'high'
                                  ? 'text-red-600'
                                  : alert.severity === 'medium'
                                  ? 'text-yellow-600'
                                  : 'text-blue-600'
                              }`}
                            />
                            <span>{alert.type}</span>
                            <Badge
                              variant="outline"
                              className={
                                alert.severity === 'high'
                                  ? 'border-red-600 text-red-600'
                                  : alert.severity === 'medium'
                                  ? 'border-yellow-600 text-yellow-600'
                                  : 'border-blue-600 text-blue-600'
                              }
                            >
                              {alert.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-700">{alert.message}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {alert.shipment} • {alert.time}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Investigate
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Recent Deliveries</CardTitle>
                <CardDescription>Successfully completed shipments with blockchain verification</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { id: 'SHIP-2026-102', medicine: 'Ibuprofen 200mg', delivered: '2026-02-03 10:00', verified: true },
                    { id: 'SHIP-2026-099', medicine: 'Paracetamol 650mg', delivered: '2026-02-02 16:30', verified: true },
                    { id: 'SHIP-2026-095', medicine: 'Aspirin 75mg', delivered: '2026-02-01 14:15', verified: true },
                  ].map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <div>
                          <p>{item.medicine}</p>
                          <p className="text-sm text-gray-500">{item.id}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">{item.delivered}</p>
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs">
                          Blockchain Verified
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Blockchain Dialog */}
      <Dialog open={showBlockchainDialog} onOpenChange={setShowBlockchainDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Blockchain Transfer History</DialogTitle>
            <DialogDescription>
              Tamper-proof ownership transfer log for {selectedShipment}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {blockchainTransfers.map((transfer, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm text-gray-500">{transfer.timestamp}</p>
                    <p>{transfer.action}</p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-sm text-gray-600">
                  <p>From: {transfer.from}</p>
                  <p>To: {transfer.to}</p>
                </div>
                <div className="mt-2 bg-gray-50 p-2 rounded font-mono text-xs break-all text-gray-500">
                  Hash: {transfer.hash}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
