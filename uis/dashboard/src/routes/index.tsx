import { BrowserRouter, Route, Routes } from "react-router";
import { authenticationRoutes, protectedRoutes } from "./common/routes";
import { AuthLayout } from "@/layout/auth-layout";
import { AppLayout } from "@/layout/app-layout";
import { NotFound } from "@/pages/not-found";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<AuthRoute />}></Route> */}
        <Route element={<AuthLayout />}>
          {authenticationRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>

        <Route path="/" element={<></>}>
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
