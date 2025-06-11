import { getParentBackgroundColor } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

export function useFloatingBg() {
  const [bgColor, setBgColor] = useState<string | null>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  useEffect(() => {
    if (parentRef.current) {
      const color = getParentBackgroundColor(parentRef.current);

      setBgColor(color);
    }
  }, [parentRef, theme]);

  return { bgColor, parentRef };
}
