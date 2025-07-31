import { Bot } from "lucide-react";

const EmptyState = () => (
  <div className="text-center py-12">
    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
      <Bot className="w-8 h-8 text-white" />
    </div>
    <h2 className="text-xl font-semibold text-gray-700 mb-2">
      Kod analizine başlayalım!
    </h2>
    <p className="text-gray-500">
      Kodunuzu aşağıya yapıştırın, size detaylı açıklama yapayım.
    </p>
  </div>
);

export default EmptyState;
