import { useEffect } from "react";

const AppStyles = () => {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .prose h1, .prose h2, .prose h3 {
        margin-top: 1.5rem !important;
        margin-bottom: 0.5rem !important;
        font-weight: 600 !important;
      }
      .prose h1 { font-size: 1.25rem !important; }
      .prose h2 { font-size: 1.125rem !important; }
      .prose h3 { font-size: 1rem !important; }
      .prose ul {
        margin: 0.5rem 0 !important;
        padding-left: 1.5rem !important;
      }
      .prose li {
        margin: 0.25rem 0 !important;
      }
      .code-block {
        background: #f8f9fa !important;
        border: 1px solid #e9ecef !important;
        border-radius: 8px !important;
        padding: 1rem !important;
        margin: 1rem 0 !important;
        overflow-x: auto !important;
      }
      .code-block code {
        font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace !important;
        font-size: 0.875rem !important;
        line-height: 1.5 !important;
      }
      .inline-code {
        background: #f1f5f9 !important;
        border: 1px solid #e2e8f0 !important;
        border-radius: 4px !important;
        padding: 0.125rem 0.375rem !important;
        font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace !important;
        font-size: 0.875rem !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return null;
};

export default AppStyles;
