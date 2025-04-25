import { Outlet } from "react-router";

export function AuthLayout() {
  return (
    <div className="w-full h-screen ">
      <main className="max-w-7xl w-full mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
