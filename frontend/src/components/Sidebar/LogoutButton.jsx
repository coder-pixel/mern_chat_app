import React from "react";
import { BiLogOut } from "react-icons/bi";
import { useLogout } from "../../hooks/useLogout";

const LogoutButton = () => {
  const { loading, logout } = useLogout();

  return (
    <div className="mt-auto">
      {!loading?.logoutLoading ? (
        <BiLogOut
          className="w-6 h-6 text-white cursor-pointer"
          onClick={logout}
        />
      ) : (
        <span className="loading loading-spinner" /> // Add a loading spinner
      )}
    </div>
  );
};

export default LogoutButton;
