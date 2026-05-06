import { useCallback, useEffect, useRef } from "react";

export function useDebouncedCallback<TArgs extends unknown[]>(
  callback: (...args: TArgs) => void,
  delayMs: number
) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const schedule = useCallback(
    (...args: TArgs) => {
      cancel();
      timeoutRef.current = setTimeout(() => {
        callback(...args);
        timeoutRef.current = null;
      }, delayMs);
    },
    [callback, cancel, delayMs]
  );

  useEffect(() => cancel, [cancel]);

  return { schedule, cancel };
}
