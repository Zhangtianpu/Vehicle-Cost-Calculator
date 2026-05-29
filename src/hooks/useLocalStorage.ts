import { useEffect } from "react";

export function useLocalStorage<T>(key: string, value: T, setValue: (v: T) => void) {
  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        setValue(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, [key, setValue]);

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore
    }
  }, [key, value]);
}
