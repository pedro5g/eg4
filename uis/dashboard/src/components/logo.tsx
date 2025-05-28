import { Aperture } from "lucide-react";

export const Logo = () => {
  return (
    <h1 className="text-2xl text-zinc-800 font-bold tracking-tight inline-flex gap-1 items-center">
      {import.meta.env.VITE_APP_VERSION !== "aula" ? "EG4" : "MAICONSOFT"}{" "}
      <Aperture />
    </h1>
  );
};
