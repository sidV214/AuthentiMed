import { ShieldX } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

export function UnauthorizedPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-teal-50 flex items-center justify-center">
      <div className="text-center p-8">
        <ShieldX className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-6">You do not have permission to view this page.</p>
        <Button onClick={() => navigate("/login")} className="bg-blue-600 hover:bg-blue-700">
          Return to Login
        </Button>
      </div>
    </div>
  );
}
