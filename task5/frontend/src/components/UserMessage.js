import { User } from "lucide-react";

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

export default UserMessage;
