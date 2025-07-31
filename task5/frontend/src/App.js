import { useState } from "react";
import AppHeader from "./components/AppHeader";
import MessageList from "./components/MessageList";
import InputArea from "./components/InputArea";
import AppStyles from "./components/AppStyles";
import useAutoResizeTextarea from "./hooks/useAutoResizeTextarea";
import useAutoScroll from "./hooks/useAutoScroll";
import useClipboard from "./hooks/useClipboard";
import axios from "axios";
import React from "react";

const MODEL_OPTIONS = [
  { value: "llama3", label: "Llama 3 (Hugging Face)" },
  { value: "fireworks-qwen3", label: "Qwen3-235B (Fireworks)" },
  { value: "gemini", label: "gemini 2.0 flash" },
];

const loadingDotsStyle = {
  display: "inline-block",
  width: "1.5em",
  textAlign: "left",
};
function LoadingDots() {
  const [dotCount, setDotCount] = useState(1);
  React.useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((c) => (c % 3) + 1);
    }, 400);
    return () => clearInterval(interval);
  }, []);
  return <span style={loadingDotsStyle}>{".".repeat(dotCount)}</span>;
}

function App() {
  const [messages, setMessages] = useState([]);
  const [inputCode, setInputCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(MODEL_OPTIONS[0].value);
  const [rememberContext, setRememberContext] = useState(false);
  const [summary, setSummary] = useState("");
  const [contextUsed, setContextUsed] = useState(false);

  const textareaRef = useAutoResizeTextarea(inputCode);
  const messagesEndRef = useAutoScroll(messages);
  const { copy, copied } = useClipboard();

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
      if (i % 3 === 0) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }
  };

  const handleSubmit = async () => {
    if (!inputCode.trim()) return;
    const userMessage = {
      type: "user",
      content: inputCode,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputCode("");
    setLoading(true);
    setMessages((prev) => [
      ...prev,
      {
        type: "bot",
        content: "",
        timestamp: new Date(),
      },
    ]);
    setContextUsed(false);
    try {
      const res = await axios.post("http://127.0.0.1:8000/explain", {
        code: userMessage.content,
        model: selectedModel,
        remember_context: rememberContext,
        previous_summary: rememberContext ? summary : "",
      });
      await simulateStreaming(res.data.output);
      if (rememberContext && res.data.new_summary !== undefined) {
        setSummary(res.data.new_summary);
        setContextUsed(!!res.data.context_used);
      } else {
        setSummary("");
        setContextUsed(false);
      }
    } catch (err) {
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1].content =
          "Bir hata oluştu: " + (err.response?.data?.detail || err.message);
        return newMessages;
      });
    } finally {
      setLoading(false);
    }
  };

  // Bot mesajı loading durumunda animasyonlu üç nokta göster
  const enhancedMessages = messages.map((msg, idx) => {
    if (
      msg.type === "bot" &&
      loading &&
      idx === messages.length - 1 &&
      !msg.content
    ) {
      return { ...msg, content: <LoadingDots /> };
    }
    return msg;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <AppHeader />
      <div className="max-w-4xl mx-auto w-full mt-4 mb-2">
        {/* Removed model selection and remember context checkbox from here */}
      </div>
      <MessageList
        messages={enhancedMessages}
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
        modelOptions={MODEL_OPTIONS}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        rememberContext={rememberContext}
        setRememberContext={setRememberContext}
        contextUsed={contextUsed}
      />
      <AppStyles />
    </div>
  );
}

export default App;
