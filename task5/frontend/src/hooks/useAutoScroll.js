import { useRef, useEffect } from "react";

/**
 * Auto scroll to bottom hook
 * @param {Array} dependency - Bağımlılık dizisi
 * @returns {React.RefObject} Scroll ref'i
 */
const useAutoScroll = (dependency) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [dependency]);

  return scrollRef;
};

export default useAutoScroll;
