import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LoginScreen } from "./app/components/login-screen";
import { UnauthorizedPage } from "./app/components/unauthorized-page";
import { ManufacturerDashboard } from "./app/components/manufacturer-dashboard";
import { LogisticsDashboard } from "./app/components/logistics-dashboard";
import { RegulatorPortal } from "./app/components/regulator-portal";
import { PharmacistApp } from "./app/components/pharmacist-app";
import { ConsumerApp } from "./app/components/consumer-app";

function DashboardWithLogout({
  Component,
}: {
  Component: React.ComponentType<{ onLogout: () => void }>;
}) {
  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
    window.location.replace("/login");
  };
  return <Component onLogout={handleLogout} />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route
            path="/manufacturer"
            element={
              <ProtectedRoute allowedRoles={["manufacturer"]}>
                <DashboardWithLogout Component={ManufacturerDashboard} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/distributor"
            element={
              <ProtectedRoute allowedRoles={["distributor"]}>
                <DashboardWithLogout Component={LogisticsDashboard} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pharmacist"
            element={
              <ProtectedRoute allowedRoles={["pharmacist"]}>
                <DashboardWithLogout Component={PharmacistApp} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/consumer"
            element={
              <ProtectedRoute allowedRoles={["consumer"]}>
                <DashboardWithLogout Component={ConsumerApp} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/regulator"
            element={
              <ProtectedRoute allowedRoles={["regulator"]}>
                <DashboardWithLogout Component={RegulatorPortal} />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
