import { appVersion } from "@/lib/utils";
import { Aperture } from "lucide-react";

export const Logo = () => {
  return (
    <h1 className="text-2xl text-zinc-800 dark:text-zinc-100 font-bold tracking-tight inline-flex gap-1 items-center">
      {appVersion().isCompleted ? "EG4" : "MAICONSOFT"} <Aperture />
    </h1>
  );
};
