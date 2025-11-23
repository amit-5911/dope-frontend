import { useState, useEffect } from "react";
import { generateNinjas, type Ninja } from "@/features/ninjas";

interface UseNinjasDataResult {
  data: Ninja[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useNinjasData = (count: number = 1000): UseNinjasDataResult => {
  const [data, setData] = useState<Ninja[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // network delay (300-800ms)
        await new Promise((resolve) =>
          setTimeout(resolve, Math.random() * 500 + 300)
        );

        // network errors (5% chance)
        if (Math.random() < 0.05) {
          throw new Error("Failed to fetch ninja data");
        }

        const ninjas = generateNinjas(count);
        setData(ninjas);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [count, refetchTrigger]);

  const refetch = () => {
    setRefetchTrigger({});
  };

  return { data, isLoading, error, refetch };
};
