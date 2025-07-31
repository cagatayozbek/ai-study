/**
 * Markdown metni HTML'e dönüştürür
 * @param {string} text - Dönüştürülecek markdown metni
 * @returns {string} HTML string
 */
const renderMarkdown = (text) => {
  if (!text) return "";

  let html = text
    .replace(
      /```(\w+)?\n?([\s\S]*?)```/g,
      '<pre class="code-block"><code>$2</code></pre>'
    )
    .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/^- (.*$)/gim, "<li>$1</li>")
    .replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br>");

  return `<p>${html}</p>`.replace(/<p><\/p>/g, "");
};

export default renderMarkdown;
