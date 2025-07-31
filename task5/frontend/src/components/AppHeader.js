import { Code } from "lucide-react";

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
          Kodlarınızı analiz eden AI asistan
        </p>
      </div>
    </div>
  </div>
);

export default AppHeader;
