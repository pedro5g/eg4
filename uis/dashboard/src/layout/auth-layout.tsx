import { Aperture } from "lucide-react";
import { Outlet } from "react-router";

export function AuthLayout() {
  return (
    <div className="w-full">
      <header className="max-w-7xl w-full mx-auto py-4 px-2 md:px-4">
        <h1 className="text-2xl text-zinc-800 font-bold tracking-tight inline-flex gap-1 items-center">
          Aether <Aperture />
        </h1>
      </header>
      <main className="max-w-7xl w-full mt-24 mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
