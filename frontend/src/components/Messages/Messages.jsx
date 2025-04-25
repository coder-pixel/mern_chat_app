import React, { useEffect, useRef } from "react";
import Message from "./Message";
import useGetMessages from "../../hooks/useGetMessages";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import useListenMessages from "../../hooks/useListenMessages";

const Messages = () => {
  const lastMessageRef = useRef();
  const { messages, loading } = useGetMessages();

  useListenMessages();

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef?.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);

  return (
    <div className="px-4 flex-1 overflow-auto">
      {messages?.length ? (
        messages?.map((message) => (
          <div key={message?._id} ref={lastMessageRef}>
            <Message data={message} />
          </div>
        ))
      ) : loading ? (
        <MessageSkeleton />
      ) : (
        <div className="flex-1 flex items-end justify-center h-full">
          <p className="text-center pb-4 text-gray-300">
            Send a message to start the conversation!
          </p>
        </div>
      )}
    </div>
  );
};

export default Messages;
