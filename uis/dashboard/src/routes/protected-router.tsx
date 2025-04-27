import { useAuth } from "@/hooks/useAuth";
import { Navigate, Outlet } from "react-router";
import { DashboardSkeleton } from "@/components/skeleton-loader/dashboard-skeleton";

export const ProtectedRouter = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <DashboardSkeleton />;

  if (user) return <Outlet />;

  return <Navigate to={"/sign-in"} replace />;
};
