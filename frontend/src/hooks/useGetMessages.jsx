import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import { errorHandler } from "../helpers";

const useGetMessages = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();

  const _getMessages = async () => {
    try {
      setLoading(true);

      const res = await fetch(`/api/messages/${selectedConversation?._id}`);

      const data = await res?.json();
      if (data?.error) throw new Error(data?.error);

      setMessages(data);
    } catch (error) {
      errorHandler(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedConversation?._id) _getMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedConversation?._id, setMessages]);

  return { messages, loading };
};
export default useGetMessages;
