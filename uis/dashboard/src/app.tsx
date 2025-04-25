import { useEffect } from "react";
import { AppRoutes } from "./routes";
import { toast } from "sonner";

export function App() {
  useEffect(() => {
    if (window) {
      window.toast = toast;
    }
  }, []);

  return <AppRoutes />;
}
