import { Logo } from "@/components/logo";
import { Outlet } from "react-router";

export function AuthLayout() {
  return (
    <div className="w-full">
      <header className="max-w-7xl w-full mx-auto py-4 px-2 md:px-4">
        <Logo />
      </header>
      <main className="max-w-7xl w-full mt-24 mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
