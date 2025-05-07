export const AUTH_ROUTES = {
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
};

export const PROTECTED_ROUTES = {
  DASHBOARD: "/dashboard",
  CLIENTS: "/clients",
  CLIENT_PROFILE: "/clients/:clientCode",
  CLIENTS_TABLE: "/clients/table",
};

export const isAuthRoute = (pathname: string): boolean => {
  return Object.values(AUTH_ROUTES).includes(pathname);
};
