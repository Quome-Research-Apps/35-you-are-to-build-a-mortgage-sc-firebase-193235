"use client";

import { useState, useEffect, useCallback } from "react";

function getStorageValue<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") {
    return defaultValue;
  }
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (error) {
    console.error("Error parsing JSON from localStorage", error);
    return defaultValue;
  }
}

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    return getStorageValue(key, initialValue);
  });

  const setStoredValue = useCallback((newValue: T | ((val: T) => T)) => {
    setValue(prevValue => {
        const valueToStore = newValue instanceof Function ? newValue(prevValue) : newValue;
        try {
            localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error("Error setting item to localStorage", error);
        }
        return valueToStore;
    });
  }, [key]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setValue(JSON.parse(e.newValue));
        } catch (error) {
           console.error("Error parsing storage change", error);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  return [value, setStoredValue];
}
