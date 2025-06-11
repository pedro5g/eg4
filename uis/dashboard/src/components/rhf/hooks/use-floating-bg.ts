import { useTheme } from "@/context/theme-provider";
import { getParentBackgroundColor } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

export function useFloatingBg() {
  const [bgColor, setBgColor] = useState<string | null>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (parentRef.current) {
        const color = getParentBackgroundColor(parentRef.current);
        setBgColor(color);
      }
    });

    return () => cancelAnimationFrame(frame);
  }, [theme]);

  return { bgColor, parentRef };
}
