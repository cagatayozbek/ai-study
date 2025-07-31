import {
  Send,
  Settings,
  Cpu,
  MessageCircle,
  ChevronDown,
  Check,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

const InputArea = ({
  inputCode,
  setInputCode,
  onSubmit,
  loading,
  textareaRef,
  modelOptions,
  selectedModel,
  setSelectedModel,
  rememberContext,
  setRememberContext,
  contextUsed,
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowModelDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    const handleKeyPress = (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        onSubmit();
      }
    };

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleModelSelect = (modelValue) => {
    setSelectedModel(modelValue);
    setShowModelDropdown(false);
  };

  return (
    <div className="bg-white border-t">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Settings Panel */}
        {showSettings && (
          <div className="mb-4 bg-gray-50 rounded-xl p-4 border border-gray-200 animate-in slide-in-from-top-2 duration-200">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-gray-600" />
                  <label className="text-sm font-medium text-gray-700">
                    Gelişmiş Ayarlar
                  </label>
                </div>
                <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={rememberContext}
                    onChange={(e) => setRememberContext(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-700">
                      Konuşma bağlamını hatırla
                    </div>
                    <div className="text-xs text-gray-500">
                      Önceki konuşmaları dikkate alarak daha detaylı açıklamalar
                      sunar
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Context Status */}
        {contextUsed && (
          <div className="mb-3 flex items-center justify-center gap-2 text-xs text-emerald-600 bg-emerald-50 rounded-lg py-2 px-3 border border-emerald-200">
            <MessageCircle className="w-3 h-3" />
            <span>Önceki konuşma bağlamı kullanılıyor</span>
          </div>
        )}

        {/* Input Area */}
        <div className="relative">
          <div className="bg-gray-50 rounded-2xl border-2 border-gray-200 focus-within:border-blue-500 focus-within:bg-white transition-all duration-200 shadow-sm">
            <textarea
              ref={textareaRef}
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSubmit();
                }
              }}
              placeholder="Kodunuzu buraya yapıştırın... (Enter ile gönder, Shift+Enter ile yeni satır)"
              className="w-full bg-transparent border-none outline-none resize-none px-6 py-4 text-gray-800 placeholder-gray-400 font-mono text-sm leading-relaxed"
              style={{ minHeight: "80px", maxHeight: "240px" }}
              disabled={loading}
            />

            {/* Bottom Bar */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <div className="flex items-center gap-3">
                {/* Model Selector */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowModelDropdown(!showModelDropdown)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg text-xs text-gray-700 border border-gray-200 hover:bg-gray-50 transition-all min-w-0"
                  >
                    <Cpu className="w-3 h-3 flex-shrink-0" />
                    <span className="font-medium truncate">
                      {modelOptions.find((opt) => opt.value === selectedModel)
                        ?.label || selectedModel}
                    </span>
                    <ChevronDown
                      className={`w-3 h-3 flex-shrink-0 transition-transform ${
                        showModelDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Model Dropdown */}
                  {showModelDropdown && (
                    <div className="absolute bottom-full mb-2 left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-48 max-h-48 overflow-y-auto">
                      {modelOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleModelSelect(option.value)}
                          className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 transition-colors flex items-center justify-between ${
                            selectedModel === option.value
                              ? "bg-blue-50 text-blue-700"
                              : "text-gray-700"
                          }`}
                        >
                          <span className="font-medium">{option.label}</span>
                          {selectedModel === option.value && (
                            <Check className="w-3 h-3 text-blue-600" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Context Toggle */}
                <button
                  onClick={() => setRememberContext(!rememberContext)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    rememberContext
                      ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                      : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <MessageCircle className="w-3 h-3" />
                  <span>Bağlam</span>
                  {rememberContext && <Check className="w-3 h-3" />}
                </button>

                {/* Settings Toggle */}
              </div>

              {/* Send Button */}
              <button
                onClick={onSubmit}
                disabled={loading || !inputCode.trim()}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  loading || !inputCode.trim()
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md active:scale-95"
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    <span>Analiz ediliyor...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Analiz Et</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Helper Text */}
          <p className="text-xs text-gray-500 mt-3 text-center">
            Bu asistan kodlarınızı analiz eder ve detaylı açıklamalar sunar
          </p>
        </div>
      </div>
    </div>
  );
};

export default InputArea;
