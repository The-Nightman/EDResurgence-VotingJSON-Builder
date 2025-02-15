import { useEffect, useState } from "react";

/**
 * Custom hook that debounces a value by a specified delay.
 *
 * @remarks Since this hook depends on usage alongside a state value it should be noted that
 * it does not prevent state updates in the component and is intended to be used in small break-away
 * components that will update a state in parent in order to improve performance of complex components.
 *
 * @template T - The type of the value to debounce.
 * @param {T} value - The value to debounce.
 * @param {number} [delay=500] - (optional) The delay in milliseconds to debounce the value. Defaults to 500ms.
 * @returns {T} - The debounced value.
 *
 * @example
 * ```tsx
 * const component = ({updateParent}) => {
 * ...
 *  const [searchTerm, setSearchTerm] = useState("");
 *  const debouncedSearchTerm = useDebounce(searchTerm, 300);
 *  useEffect(() => {
 *    updateParent(debouncedSearchTerm);
 *  }, [debouncedSearchTerm]);
 * ...
 * };
 * export component;
 * ```
 */
const useDebounce = <T>(value: T, delay: number = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
