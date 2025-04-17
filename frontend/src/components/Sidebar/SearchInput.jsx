import React, { useState } from "react";
import { IoSearchSharp } from "react-icons/io5";

const SearchInput = () => {
  const [search, setSearch] = useState("");

  const _handleSubmit = (e) => {
    if (e) e.preventDefault();
  };

  return (
    <form onSubmit={_handleSubmit} className="flex items-center gap-2">
      <input
        type="text"
        placeholder="Search…"
        className="input input-bordered rounded-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button type="submit" className="btn btn-circle bg-sky-500 text-white">
        <IoSearchSharp className="w-6 h-6 outline-none" />
      </button>
    </form>
  );
};

export default SearchInput;
