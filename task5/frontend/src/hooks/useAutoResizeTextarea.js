import { useRef, useEffect } from "react";

/**
 * Textarea auto-resize hook
 * @param {string} value - Textarea değeri
 * @returns {React.RefObject} Textarea ref'i
 */
const useAutoResizeTextarea = (value) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px";
    }
  }, [value]);

  return textareaRef;
};

export default useAutoResizeTextarea;
