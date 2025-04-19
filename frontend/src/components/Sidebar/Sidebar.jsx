import React from "react";
import SearchInput from "./SearchInput";
import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import { useGetConversations } from "../../hooks/useGetConversations";

const Sidebar = () => {
  const {
    conversations,
    conversationsOriginal,
    loading,
    setFilteredConversations,
  } = useGetConversations();
  return (
    <div className="border-r border-slate-500 p-4 flex flex-col">
      <SearchInput
        conversationsOriginal={conversationsOriginal}
        setFilteredConversations={setFilteredConversations}
      />

      <div className="divider px-3" />

      <Conversations conversations={conversations} loading={loading} />

      <LogoutButton />
    </div>
  );
};

export default Sidebar;
