import React from "react";

const ChatList = ({ chats, activeChatId, onSelectChat, onNewChat }) => {
  return (
    <div className="w-full md:w-64 bg-white border-r h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <span className="font-semibold text-gray-700">Sohbetler</span>
        <button
          onClick={onNewChat}
          className="ml-2 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm"
        >
          + Yeni Chat
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`px-4 py-3 cursor-pointer border-b text-sm transition-colors ${
              chat.id === activeChatId
                ? "bg-blue-50 text-blue-700 font-semibold"
                : "hover:bg-gray-50 text-gray-700"
            }`}
          >
            {chat.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;
