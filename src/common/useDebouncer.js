import { useEffect, useState } from "react";

function useDebouncer(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
  }, [value, delay]);
  return debouncedValue;
}
export default useDebouncer;
