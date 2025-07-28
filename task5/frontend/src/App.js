import { useState, useRef, useEffect } from "react";
import { Send, Code, Bot, User, Copy, Check } from "lucide-react";

// ==================== UTILITY FUNCTIONS ====================

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

/**
 * Metni clipboard'a kopyalar
 * @param {string} text - Kopyalanacak metin
 * @returns {Promise<boolean>} Başarı durumu
 */
const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error("Kopyalama başarısız:", err);
    return false;
  }
};

/**
 * Mock API response generator
 * @returns {string} Örnek açıklama metni
 */
const generateMockResponse = () => {
  return `# Kod Analizi

Bu Python kodunu **adım adım** açıklayayım:

## 1. Import Statements
\`\`\`python
import pandas as pd
import numpy as np
\`\`\`
Bu satırlar **pandas** ve **numpy** kütüphanelerini içe aktarır.

## 2. Fonksiyon Tanımı
Kodunuzda tanımlanan fonksiyon şu işlemleri gerçekleştirir:

- **Veri okuma**: CSV dosyasından veri alır
- **İşleme**: Verileri temizler ve düzenler  
- **Analiz**: İstatistiksel hesaplamalar yapar

## 3. Ana Mantık
Kod şu adımları takip eder:

1. Veri setini yükle
2. Eksik değerleri kontrol et
3. Sonuçları hesapla
4. Görselleştir

Bu kod **veri analizi** için optimize edilmiş ve **profesyonel** standartlara uygun yazılmış.`;
};

// ==================== CUSTOM HOOKS ====================

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

// ==================== COMPONENTS ====================

/**
 * Uygulama başlığı komponenti
 */
const AppHeader = () => (
  <div className="bg-white shadow-sm border-b px-6 py-4">
    <div className="max-w-4xl mx-auto flex items-center gap-3">
      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
        <Code className="w-5 h-5 text-white" />
      </div>
      <div>
        <h1 className="text-xl font-semibold text-gray-800">
          Kod Açıklayıcı Asistan
        </h1>
        <p className="text-sm text-gray-500">
          Python kodlarınızı analiz eden AI asistan
        </p>
      </div>
    </div>
  </div>
);

/**
 * Boş durum komponenti
 */
const EmptyState = () => (
  <div className="text-center py-12">
    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
      <Bot className="w-8 h-8 text-white" />
    </div>
    <h2 className="text-xl font-semibold text-gray-700 mb-2">
      Kod analizine başlayalım!
    </h2>
    <p className="text-gray-500">
      Python kodunuzu aşağıya yapıştırın, size detaylı açıklama yapayım.
    </p>
  </div>
);

/**
 * Kullanıcı mesajı komponenti
 */
const UserMessage = ({ message }) => (
  <div className="flex gap-4 justify-end">
    <div className="max-w-3xl rounded-2xl px-6 py-4 bg-blue-500 text-white">
      <pre className="whitespace-pre-wrap font-mono text-sm">
        {message.content}
      </pre>
    </div>
    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
      <User className="w-4 h-4 text-white" />
    </div>
  </div>
);

/**
 * Bot mesajı komponenti
 */
const BotMessage = ({ message, loading, onCopy, copied }) => (
  <div className="flex gap-4 justify-start">
    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
      <Bot className="w-4 h-4 text-white" />
    </div>

    <div className="max-w-3xl rounded-2xl px-6 py-4 bg-white shadow-sm border">
      <div
        className="prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{
          __html: renderMarkdown(
            message.content || (loading ? "Düşünüyorum..." : "")
          ),
        }}
      />
      {message.content && (
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

/**
 * Mesaj komponenti - tip kontrolü yapar
 */
const Message = ({ message, loading, onCopy, copied }) => {
  if (message.type === "user") {
    return <UserMessage message={message} />;
  }

  return (
    <BotMessage
      message={message}
      loading={loading}
      onCopy={onCopy}
      copied={copied}
    />
  );
};

/**
 * Mesajlar listesi komponenti
 */
const MessageList = ({ messages, loading, onCopy, copied, scrollRef }) => (
  <div className="flex-1 overflow-y-auto px-4 py-6">
    <div className="max-w-4xl mx-auto space-y-6">
      {messages.length === 0 ? (
        <EmptyState />
      ) : (
        messages.map((message, index) => (
          <Message
            key={index}
            message={message}
            loading={loading && index === messages.length - 1}
            onCopy={onCopy}
            copied={copied}
          />
        ))
      )}
      <div ref={scrollRef} />
    </div>
  </div>
);

/**
 * Input alanı komponenti
 */
const InputArea = ({
  inputCode,
  setInputCode,
  onSubmit,
  loading,
  textareaRef,
}) => {
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="bg-white border-t px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <div className="relative bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
          <textarea
            ref={textareaRef}
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Python kodunuzu buraya yapıştırın... (Enter ile gönder, Shift+Enter ile yeni satır)"
            className="w-full bg-transparent border-none outline-none resize-none px-4 py-4 text-gray-700 placeholder-gray-400 font-mono text-sm"
            style={{ minHeight: "60px", maxHeight: "200px" }}
            disabled={loading}
          />
          <div className="absolute bottom-3 right-3">
            <button
              onClick={onSubmit}
              disabled={loading || !inputCode.trim()}
              className="w-10 h-10 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Bu asistan Python kodlarınızı analiz eder ve açıklar
        </p>
      </div>
    </div>
  );
};

/**
 * CSS stilleri komponenti
 */
const AppStyles = () => {
  // CSS stillerini head'e ekle
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

// ==================== MAIN APP COMPONENT ====================

/**
 * Ana uygulama komponenti
 */
function App() {
  // State yönetimi
  const [messages, setMessages] = useState([]);
  const [inputCode, setInputCode] = useState("");
  const [loading, setLoading] = useState(false);

  // Custom hooks
  const textareaRef = useAutoResizeTextarea(inputCode);
  const messagesEndRef = useAutoScroll(messages);
  const { copy, copied } = useClipboard();

  /**
   * Streaming efektini simüle eder
   * @param {string} text - Stream edilecek metin
   */
  const simulateStreaming = async (text) => {
    const words = text.split(" ");

    for (let i = 0; i < words.length; i++) {
      const currentText = words.slice(0, i + 1).join(" ");

      setMessages((prev) => {
        const newMessages = [...prev];
        if (newMessages[newMessages.length - 1]?.type === "bot") {
          newMessages[newMessages.length - 1].content = currentText;
        }
        return newMessages;
      });

      // Her 3 kelimede bir pause
      if (i % 3 === 0) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }
  };

  /**
   * Form submit handler
   */
  const handleSubmit = async () => {
    if (!inputCode.trim()) return;

    // Kullanıcı mesajını ekle
    const userMessage = {
      type: "user",
      content: inputCode,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputCode("");
    setLoading(true);

    // Bot mesajı placeholder'ı ekle
    setMessages((prev) => [
      ...prev,
      {
        type: "bot",
        content: "",
        timestamp: new Date(),
      },
    ]);

    try {
      // API gecikmesini simüle et
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock response ile streaming simüle et
      const mockResponse = generateMockResponse();
      await simulateStreaming(mockResponse);

      // Gerçek API kullanımı için:
      // const res = await axios.post("http://localhost:8000/explain", {
      //   code: inputCode,
      // });
      // await simulateStreaming(res.data.output);
    } catch (err) {
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1].content =
          "Bir hata oluştu: " + err.message;
        return newMessages;
      });
    } finally {
      setLoading(false);
    }
  };

  // Render
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <AppHeader />

      <MessageList
        messages={messages}
        loading={loading}
        onCopy={copy}
        copied={copied}
        scrollRef={messagesEndRef}
      />

      <InputArea
        inputCode={inputCode}
        setInputCode={setInputCode}
        onSubmit={handleSubmit}
        loading={loading}
        textareaRef={textareaRef}
      />

      <AppStyles />
    </div>
  );
}

export default App;
