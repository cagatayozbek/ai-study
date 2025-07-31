import { Bot, Copy, Check } from "lucide-react";
import renderMarkdown from "../utils/renderMarkdown";

const BotMessage = ({ message, loading, onCopy, copied }) => (
  <div className="flex gap-4 justify-start">
    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
      <Bot className="w-4 h-4 text-white" />
    </div>
    <div className="max-w-3xl rounded-2xl px-6 py-4 bg-white shadow-sm border">
      <div className="prose prose-sm max-w-none">
        {typeof message.content === "string" ? (
          <span
            dangerouslySetInnerHTML={{
              __html: renderMarkdown(
                message.content || (loading ? "Düşünüyorum..." : "")
              ),
            }}
          />
        ) : (
          message.content // React element ise doğrudan render et
        )}
      </div>
      {typeof message.content === "string" && message.content && (
        <button
          onClick={() => onCopy(message.content)}
          className="mt-3 flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm transition-colors"
        >
          {copied ? (
            <Check className="w-4 h-4" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
          {copied ? "Kopyalandı!" : "Kopyala"}
        </button>
      )}
    </div>
  </div>
);

export default BotMessage;
