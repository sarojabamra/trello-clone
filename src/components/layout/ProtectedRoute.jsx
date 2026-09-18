import { Navigate, Outlet } from "react-router-dom";
import Loader from "../common/Loader";

export default function ProtectedRoute({ isAuthenticated, isLoading }) {
  if (isLoading) {
    return <Loader message="Checking your session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
