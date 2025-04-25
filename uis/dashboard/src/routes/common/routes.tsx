import { SignUp } from "@/pages/auth/sign-up";
import { AUTH_ROUTES, PROTECTED_ROUTES } from "./routes-path";
import { SignIn } from "@/pages/auth/sign-in";
import { Dashboard } from "@/pages/protected/dashboard";

export type RoutesStruct = {
  path: string;
  element: React.ReactElement;
};

export const authenticationRoutes: RoutesStruct[] = [
  { path: AUTH_ROUTES.SIGN_UP, element: <SignUp /> },
  { path: AUTH_ROUTES.SIGN_IN, element: <SignIn /> },
];

export const protectedRoutes: RoutesStruct[] = [
  { path: PROTECTED_ROUTES.DASHBOARD, element: <Dashboard /> },
];
