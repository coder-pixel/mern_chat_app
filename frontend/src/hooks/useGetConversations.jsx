import { useEffect, useState } from "react";
import { errorHandler } from "../helpers";

export const useGetConversations = () => {
  const [conversations, setConversations] = useState([]);
  const [conversationsOriginal, setConversationsOriginal] = useState([]);
  const [loading, setLoading] = useState(false);

  const _getConversation = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/users", {
        method: "GET",
        headers: { "Content-type": "application/json" },
      });

      const data = await res?.json();

      if (data?.error) {
        throw new Error(data?.error);
      }

      setConversations(data);
      setConversationsOriginal(data);
    } catch (err) {
      errorHandler(err);
    } finally {
      setLoading(false);
    }
  };

  const setFilteredConversations = (updatedConversations = undefined) => {
    if (updatedConversations) {
      setConversations(updatedConversations);
    } else {
      setConversations(conversationsOriginal); // reset to original
    }
  };

  const _getUserById = (id) => {
    return (
      conversations?.data?.find((each) => each?._id === id)?.fullName || ""
    );
  };

  useEffect(() => {
    _getConversation();
  }, []);

  return {
    loading,
    conversations,
    conversationsOriginal,
    setFilteredConversations,
    getUserById: _getUserById,
  };
};
