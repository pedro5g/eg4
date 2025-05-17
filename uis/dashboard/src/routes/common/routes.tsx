import { SignUp } from "@/pages/auth/sign-up";
import { AUTH_ROUTES, PROTECTED_ROUTES } from "./routes-path";
import { SignIn } from "@/pages/auth/sign-in";
import { Dashboard } from "@/pages/protected/dashboard";
import { Clients } from "@/pages/protected/clients";
import { ClientsTable } from "@/pages/protected/clients-table";
import { ClientProfile } from "@/pages/protected/client-profile";
import { InvoicePage } from "@/pages/protected/invoice";

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
  { path: PROTECTED_ROUTES.CLIENTS, element: <Clients /> },
  { path: PROTECTED_ROUTES.CLIENTS_TABLE, element: <ClientsTable /> },
  { path: PROTECTED_ROUTES.CLIENT_PROFILE, element: <ClientProfile /> },
  { path: PROTECTED_ROUTES.INVOICE, element: <InvoicePage /> },
];
