export const AUTH_ROUTES = {
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
};

export const PROTECTED_ROUTES = {
  DASHBOARD: "/dashboard",
};

export const isAuthRoute = (pathname: string): boolean => {
  return Object.values(AUTH_ROUTES).includes(pathname);
};
