import { useState } from "react";
import useConversation from "../zustand/useConversation";
import { errorHandler } from "../helpers";

export const useSendMessage = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();

  const _handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const _sendMessage = async (e) => {
    try {
      if (e) e.preventDefault();

      if (!message) return; // prevent sending empty messages

      setLoading(true);
      const res = await fetch(
        `/api/messages/send/${selectedConversation?._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON?.stringify({ message }),
        }
      );
      const data = await res?.json();
      if (data?.error) throw new Error(data?.error);

      setMessages([...messages, data]);
      setMessage("");
    } catch (error) {
      errorHandler(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    message,
    loading,
    sendMessage: _sendMessage,
    handleMessageChange: _handleMessageChange,
  };
};
