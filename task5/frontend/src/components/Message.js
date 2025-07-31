import UserMessage from "./UserMessage";
import BotMessage from "./BotMessage";

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

export default Message;
