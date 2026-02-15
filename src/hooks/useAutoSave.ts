"use client";

import { useEffect, useRef, useState } from "react";

export function useAutoSave<T>(
  data: T,
  isDirty: boolean,
  onSave: (data: T) => Promise<void>,
  debounceMs: number = 1000
) {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!isDirty) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      setIsSaving(true);
      try {
        await onSave(data);
        setLastSaved(new Date());
      } catch (error) {
        console.error("Auto-save failed:", error);
      } finally {
        setIsSaving(false);
      }
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, isDirty, debounceMs]);

  return { isSaving, lastSaved };
}
