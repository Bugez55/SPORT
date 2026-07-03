import { useCallback, useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore quota / serialization errors
    }
  }, [key, value]);

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) =>
        typeof next === "function" ? (next as (p: T) => T)(prev) : next
      );
    },
    []
  );

  return [value, update] as const;
}
