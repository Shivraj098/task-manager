"use client";

import {
  useState,
  useCallback,
} from "react";

export function useApi() {
  const [loading, setLoading] =
    useState(false);

  const execute = useCallback(
    async <T>(
      callback: () => Promise<T>,
    ): Promise<T | null> => {
      try {
        setLoading(true);

        return await callback();
      } catch (error) {
        console.error(error);

        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    loading,
    execute,
  };
}