import React from "react";
import { Building2, Truck, Shield, Stethoscope, User } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import type { UserRole } from "../../App";

interface LoginScreenProps {
  onSelectRole: (role: UserRole) => void;
}

const roles = [
  {
    role: "manufacturer" as const,
    title: "Manufacturer",
    description: "Create batches, upload certificates, generate QR codes",
    icon: Building2,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    role: "logistics" as const,
    title: "Logistics & Distributor",
    description: "Track shipments, scan batches, monitor transfers",
    icon: Truck,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    role: "regulator" as const,
    title: "Regulator / Authority",
    description: "Monitor all batches, view audit logs, compliance reports",
    icon: Shield,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    role: "pharmacist" as const,
    title: "Pharmacist & Inspector",
    description: "Scan medicines, verify authenticity, flag suspicious items",
    icon: Stethoscope,
    color: "text-teal-600",
    bgColor: "bg-teal-50",
  },
  {
    role: "consumer" as const,
    title: "Consumer",
    description: "Simple QR scan, verify medicine authenticity",
    icon: User,
    color: "text-cyan-600",
    bgColor: "bg-cyan-50",
  },
];

export function LoginScreen({ onSelectRole }: LoginScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-teal-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-green-600 rounded-2xl flex items-center justify-center">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl">SmartMedChain</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            AI-Powered Medicine Authenticity Verification & Blockchain-Based
            Drug Supply Chain Transparency Platform
          </p>
        </div>

        {/* Role Selection */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl mb-8 text-center text-gray-700">
            Select Your Role
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((roleItem) => (
              <Card
                key={roleItem.role}
                className="hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-blue-300"
                onClick={() => onSelectRole(roleItem.role)}
              >
                <CardHeader>
                  <div
                    className={`w-16 h-16 ${roleItem.bgColor} rounded-xl flex items-center justify-center mb-4`}
                  >
                    <roleItem.icon className={`w-8 h-8 ${roleItem.color}`} />
                  </div>
                  <CardTitle className="text-xl">{roleItem.title}</CardTitle>
                  <CardDescription className="text-base">
                    {roleItem.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                    Access Dashboard
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="max-w-4xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="mb-2">AI Detection</h3>
            <p className="text-sm text-gray-600">
              Advanced AI analyzes images and metadata to detect counterfeit
              medicines
            </p>
          </div>
          <div className="p-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="mb-2">Blockchain Tracking</h3>
            <p className="text-sm text-gray-600">
              Tamper-proof supply chain tracking from manufacturer to consumer
            </p>
          </div>
          <div className="p-6">
            <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Shield className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="mb-2">Full Transparency</h3>
            <p className="text-sm text-gray-600">
              Real-time visibility for all stakeholders in the supply chain
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
