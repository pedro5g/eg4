import { BrowserRouter, Route, Routes } from "react-router";
import { authenticationRoutes, protectedRoutes } from "./common/routes";
import { AuthLayout } from "@/layout/auth-layout";
import { AppLayout } from "@/layout/app-layout";
import { NotFound } from "@/pages/not-found";
import { AuthRouter } from "./auth-router";
import { ProtectedRouter } from "./protected-router";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthRouter />}>
          <Route element={<AuthLayout />}>
            {authenticationRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
          </Route>
        </Route>

        <Route path="/" element={<ProtectedRouter />}>
          <Route element={<AppLayout />}>
            {protectedRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
