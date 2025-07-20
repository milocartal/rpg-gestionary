import { useEffect, useState } from "react";

/**
 * Custom React hook that debounces a value by a specified delay.
 *
 * @template T - The type of the value to debounce.
 * @param value - The value to debounce.
 * @param delay - The delay in milliseconds before updating the debounced value.
 * @returns The debounced value.
 *
 * @example
 * const debouncedSearchTerm = useDebounce(searchTerm, 300);
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value); // Initialize with the initial value

  // Effect to update the debounced value after the specified delay
  // It clears the timeout if the component unmounts or if the value or delay changes
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue; // Return the debounced value
}
