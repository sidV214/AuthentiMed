import React, { useState } from "react";
import { LoginScreen } from "./app/components/login-screen";
import { ManufacturerDashboard } from "./app/components/manufacturer-dashboard";
import { LogisticsDashboard } from "./app/components/logistics-dashboard";
import { RegulatorPortal } from "./app/components/regulator-portal";
import { PharmacistApp } from "./app/components/pharmacist-app";
import { ConsumerApp } from "./app/components/consumer-app";

export type UserRole =
  | "manufacturer"
  | "logistics"
  | "regulator"
  | "pharmacist"
  | "consumer"
  | null;

export default function App() {
  const [userRole, setUserRole] = useState<UserRole>(null);

  const handleLogout = () => {
    setUserRole(null);
  };

  if (!userRole) {
    return <LoginScreen onSelectRole={setUserRole} />;
  }

  return (
    <>
      {userRole === "manufacturer" && (
        <ManufacturerDashboard onLogout={handleLogout} />
      )}
      {userRole === "logistics" && (
        <LogisticsDashboard onLogout={handleLogout} />
      )}
      {userRole === "regulator" && <RegulatorPortal onLogout={handleLogout} />}
      {userRole === "pharmacist" && <PharmacistApp onLogout={handleLogout} />}
      {userRole === "consumer" && <ConsumerApp onLogout={handleLogout} />}
    </>
  );
}
