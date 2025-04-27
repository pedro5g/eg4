import { useAuth } from "@/hooks/useAuth";
import { Navigate, Outlet, useLocation } from "react-router";
import { isAuthRoute } from "./common/routes-path";
import { DashboardSkeleton } from "@/components/skeleton-loader/dashboard-skeleton";

export const AuthRouter = () => {
  const { pathname } = useLocation();
  const { user, isLoading } = useAuth();

  const _isAuthRoute = isAuthRoute(pathname);

  if (isLoading && !_isAuthRoute) return <DashboardSkeleton />;

  if (!user) return <Outlet />;

  return <Navigate to={"/dashboard"} replace />;
};
