import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import QuisineLoader from "@/components/ui/QuisineLoader"; 

const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();

  // 1. If still loading, show spinner (don't redirect yet!)
  if (isLoading) {
    // Use fullScreen mode here
    return <QuisineLoader fullScreen text="Verifying Session..." />;
  }

  // 2. If no user, kick to login
  if (!user) {
      return <Navigate to="/login" replace />;
  }

  // 3. User is authorized, show the page
  return <Outlet />;
};

export default ProtectedRoute;