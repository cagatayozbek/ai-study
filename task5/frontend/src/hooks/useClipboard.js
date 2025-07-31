import { useState } from "react";
import copyToClipboard from "../utils/copyToClipboard";

/**
 * Clipboard copy hook
 * @returns {Object} Copy fonksiyonu ve copied state'i
 */
const useClipboard = () => {
  const [copied, setCopied] = useState(false);

  const copy = async (text) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return { copy, copied };
};

export default useClipboard;
