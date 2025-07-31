import Message from "./Message";
import EmptyState from "./EmptyState";

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

export default MessageList;
