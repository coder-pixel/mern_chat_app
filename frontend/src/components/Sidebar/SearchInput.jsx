import React, { useRef, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";

const SearchInput = ({ conversationsOriginal, setFilteredConversations }) => {
  const searchRef = useRef();
  const [search, setSearch] = useState("");

  const _handleSubmit = (e, searchPayload = undefined) => {
    if (e) e.preventDefault();

    let searchTerm =
      searchPayload || searchPayload === "" ? searchPayload : search;
    if (!searchTerm) {
      setFilteredConversations(undefined);
      return;
    }

    // if (searchTerm?.length < 3) {
    //   return errorHandler({
    //     reason: "Search term must be at least 3 characters long",
    //   });
    // }

    const filteredConversations = conversationsOriginal?.data?.filter((c) =>
      c?.fullName
        ?.toLowerCase()
        ?.includes(searchTerm?.toLowerCase()?.toLowerCase())
    );

    setFilteredConversations({
      data: filteredConversations,
      totalCount: filteredConversations?.length,
    });
  };

  const _handleOnChange = (e) => {
    if (searchRef?.current) clearTimeout(searchRef?.current);
    setSearch(e.target.value);

    searchRef.current = setTimeout(() => {
      _handleSubmit(e, e.target.value);
    }, 1000);
  };

  return (
    <form onSubmit={_handleSubmit} className="flex items-center gap-2">
      <input
        type="text"
        placeholder="Search…"
        className="input input-bordered rounded-full"
        value={search}
        onChange={(e) => _handleOnChange(e)}
      />
      <button type="submit" className="btn btn-circle bg-sky-500 text-white">
        <IoSearchSharp className="w-6 h-6 outline-none" />
      </button>
    </form>
  );
};

export default SearchInput;
