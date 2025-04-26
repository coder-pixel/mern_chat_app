import React from "react";
import Conversation from "./Conversation";

const Conversations = ({ loading, conversations, callOngoing }) => {
  return (
    <div className="py-2 flex flex-col overflow-auto">
      {conversations?.data?.map((conversation, idx) => (
        <Conversation
          key={conversation?._id}
          conversation={conversation}
          lastIdx={idx === conversations?.totalCount - 1}
          callOngoing={callOngoing}
        />
      ))}

      {loading ? <span className="loading loading-spinner mx-auto" /> : null}
    </div>
  );
};

export default Conversations;
