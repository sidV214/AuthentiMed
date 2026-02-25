import React, { useEffect, useMemo, useState } from 'react';
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
import { useAuth, type BackendRole } from '../../context/AuthContext';
import { api } from '../../services/api';

interface DashboardProps {
  onLogout: () => void;
}

type BatchStatus = 'pending' | 'verified' | 'failed';

interface ManufacturerBatch {
  _id: string;
  batchId: string;
  medicineName: string;
  quantity: number;
  manufacturingDate: string;
  status: BatchStatus;
  aiConfidenceScore?: number | null;
  blockchainTxHash?: string | null;
  qrCodeUrl?: string | null;
  currentOwner?: {
    _id: string;
    name: string;
    role: BackendRole;
  };
  timeline?: {
    event: string;
    timestamp: string;
  }[];
}

export function ManufacturerDashboard({ onLogout }: DashboardProps) {
  const { user } = useAuth();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  const [batches, setBatches] = useState<ManufacturerBatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formBatchId, setFormBatchId] = useState('');
  const [formMedicineName, setFormMedicineName] = useState('');
  const [formQuantity, setFormQuantity] = useState('');
  const [formManufacturingDate, setFormManufacturingDate] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.token) return;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api('batches', { method: 'GET', token: user.token });
        setBatches(data);
      } catch (err: any) {
        setError(err?.message || 'Failed to load batches');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.token]);

  const stats = useMemo(() => {
    const total = batches.length;
    const verified = batches.filter((b) => b.status === 'verified').length;
    const pending = batches.filter((b) => b.status === 'pending').length;
    const failed = batches.filter((b) => b.status === 'failed').length;
    const successRate = total ? (verified / total) * 100 : 0;
    return { total, verified, pending, failed, successRate };
  }, [batches]);

  const chartData = useMemo(() => {
    const byMonth: Record<string, { month: string; verified: number; pending: number; failed: number }> = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    batches.forEach((batch) => {
      const d = new Date(batch.manufacturingDate);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (!byMonth[key]) {
        byMonth[key] = {
          month: `${monthNames[d.getMonth()]} ${d.getFullYear()}`,
          verified: 0,
          pending: 0,
          failed: 0,
        };
      }
      if (batch.status === 'verified') byMonth[key].verified += 1;
      if (batch.status === 'pending') byMonth[key].pending += 1;
      if (batch.status === 'failed') byMonth[key].failed += 1;
    });
    return Object.values(byMonth);
  }, [batches]);

  const handleGenerateQR = (batchId: string) => {
    setSelectedBatchId(batchId);
    setShowQRDialog(true);
  };

  const handleCreateBatch = async () => {
    if (!user?.token) return;
    setCreateError(null);
    if (!formMedicineName || !formQuantity || !formManufacturingDate) {
      setCreateError('Please fill in medicine name, quantity, and manufacturing date.');
      return;
    }
    setCreating(true);
    try {
      const body: any = {
        medicineName: formMedicineName,
        quantity: Number(formQuantity),
        manufacturingDate: formManufacturingDate,
      };
      if (formBatchId.trim()) {
        body.batchId = formBatchId.trim();
      }
      const created = await api('batches', {
        method: 'POST',
        body,
        token: user.token,
      });
      setBatches((prev) => [created, ...prev]);
      setShowCreateDialog(false);
      setFormBatchId('');
      setFormMedicineName('');
      setFormQuantity('');
      setFormManufacturingDate('');
    } catch (err: any) {
      setCreateError(err?.message || 'Failed to create batch');
    } finally {
      setCreating(false);
    }
  };

  const selectedBatch = selectedBatchId
    ? batches.find((b) => b.batchId === selectedBatchId)
    : null;

  const getLocationLabel = (batch: ManufacturerBatch) => {
    if (batch.currentOwner && batch.currentOwner.name && batch.currentOwner.role) {
      const role = batch.currentOwner.role;
      const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);
      return `${roleLabel} - ${batch.currentOwner.name}`;
    }
    return 'Unknown';
  };

  const timelineItems = useMemo(() => {
    const items: { batchId: string; event: string; timestamp: string }[] = [];
    batches.forEach((batch) => {
      (batch.timeline ?? []).forEach((entry) => {
        if (!entry?.event || !entry?.timestamp) return;
        items.push({
          batchId: batch.batchId,
          event: entry.event,
          timestamp: entry.timestamp,
        });
      });
    });
    items.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
    return items;
  }, [batches]);

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
              <CardTitle className="text-3xl">{stats.total}</CardTitle>
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
              <CardTitle className="text-3xl text-green-600">{stats.verified}</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={stats.successRate} className="h-2" />
              <p className="text-sm text-gray-500 mt-2">
                {stats.successRate.toFixed(1)}% success rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Pending Review</CardDescription>
              <CardTitle className="text-3xl text-yellow-600">{stats.pending}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Awaiting AI verification</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Failed Verification</CardDescription>
              <CardTitle className="text-3xl text-red-600">{stats.failed}</CardTitle>
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
                        <Input
                          placeholder="BATCH-2026-XXX"
                          value={formBatchId}
                          onChange={(e) => setFormBatchId(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Medicine Name</Label>
                        <Input
                          placeholder="e.g., Aspirin 100mg"
                          value={formMedicineName}
                          onChange={(e) => setFormMedicineName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          placeholder="10000"
                          value={formQuantity}
                          onChange={(e) => setFormQuantity(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Manufacturing Date</Label>
                        <Input
                          type="date"
                          value={formManufacturingDate}
                          onChange={(e) => setFormManufacturingDate(e.target.value)}
                        />
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
                    {createError && (
                      <p className="text-sm text-red-600">{createError}</p>
                    )}
                    <Button
                      className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                      onClick={handleCreateBatch}
                      disabled={creating}
                    >
                      {creating ? 'Submitting…' : 'Submit for AI Verification'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {loading && <p className="text-sm text-gray-500">Loading batches…</p>}
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="space-y-3">
              {batches.map((batch) => (
                <Card key={batch._id} className="hover:shadow-md transition-shadow">
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
                            <p>{batch.batchId}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Quantity</p>
                            <p>{batch.quantity.toLocaleString()} units</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Date</p>
                            <p>{new Date(batch.manufacturingDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Location</p>
                            <p>{getLocationLabel(batch)}</p>
                          </div>
                        </div>
                        {typeof batch.aiConfidenceScore === 'number' && (
                          <div className="mt-4">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-gray-600">AI Confidence Score</span>
                              <span className="text-green-600">{batch.aiConfidenceScore}%</span>
                            </div>
                            <Progress value={batch.aiConfidenceScore} className="h-2" />
                          </div>
                        )}
                      </div>
                      {batch.status === 'verified' && (
                        <Button
                          variant="outline"
                          className="ml-4"
                          onClick={() => handleGenerateQR(batch.batchId)}
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
                  {timelineItems.length === 0 && (
                    <p className="text-sm text-gray-500">
                      No lifecycle events recorded yet.
                    </p>
                  )}
                  {timelineItems.map((item, index) => (
                    <div key={`${item.batchId}-${item.timestamp}-${index}`} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        {index < timelineItems.length - 1 && (
                          <div className="w-0.5 h-12 bg-gray-200" />
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <p className="text-sm text-gray-500">
                          {new Date(item.timestamp).toLocaleString()} • Batch {item.batchId}
                        </p>
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
              {selectedBatch
                ? `This QR code is linked to the blockchain record for batch ${selectedBatch.batchId}`
                : 'No batch selected'}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center py-6">
            <div className="w-64 h-64 bg-white border-4 border-blue-600 rounded-lg flex items-center justify-center mb-4">
              {selectedBatch?.qrCodeUrl ? (
                <img
                  src={selectedBatch.qrCodeUrl}
                  alt={`QR for batch ${selectedBatch.batchId}`}
                  className="w-56 h-56 object-contain"
                />
              ) : (
                <QrCode className="w-48 h-48 text-gray-800" />
              )}
            </div>
            <p className="text-sm text-gray-500 mb-2">
              Batch ID: {selectedBatch?.batchId ?? 'N/A'}
            </p>
            {selectedBatch?.blockchainTxHash && (
              <a
                href={`https://amoy.polygonscan.com/tx/${selectedBatch.blockchainTxHash}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-blue-600 underline mb-4 break-all"
              >
                View on PolygonScan: {selectedBatch.blockchainTxHash}
              </a>
            )}
            <Button className="w-full">Download QR Code</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
