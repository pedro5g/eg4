import { useCallback, useEffect, useRef } from "react";

export function useDebounceCallback(
  callback: Function,
  delay: number = 500,
  dependencies: any[] = []
) {
  let timeoutRef = useRef<null | NodeJS.Timeout>(null);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback, ...dependencies]);

  return useCallback(
    (...args: any[]) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay, ...dependencies]
  );
}
