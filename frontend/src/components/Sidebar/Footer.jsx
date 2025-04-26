import React from "react";
import { BiLogOut } from "react-icons/bi";
import { useLogout } from "../../hooks/useLogout";
import { useAuthContext } from "../../context/AuthContext";

const Footer = () => {
  const { loading, logout } = useLogout();
  const { authUser } = useAuthContext();

  return (
    <div className="mt-auto">
      {/* {!loading?.logoutLoading ? (
        <BiLogOut
          className="w-6 h-6 text-white cursor-pointer"
          onClick={logout}
        />
      ) : (
        <span className="loading loading-spinner" /> // Add a loading spinner
      )} */}
      <div className="mt-auto flex items-center justify-between p-2 bg-slate-700 rounded-lg">
        <div className="relative group">
          <div className="flex items-center gap-2">
            <img
              src={authUser?.profilePic || "/default-profile.png"}
              alt="Profile"
              className="w-10 h-10 rounded-full cursor-pointer border-2 border-slate-500 hover:border-slate-300 transition-all duration-300"
            />
            <span className="text-white font-medium hidden md:block">
              {authUser?.fullName}
            </span>
          </div>
          <div className="absolute bottom-full left-0 mb-2 w-64 bg-slate-800 rounded-lg shadow-xl p-4 hidden group-hover:block border border-slate-600">
            <div className="text-sm text-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <img
                  src={authUser?.profilePic || "/default-profile.png"}
                  alt="Profile"
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-bold text-lg">{authUser?.fullName}</p>
                  <p className="text-slate-400">@{authUser?.username}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Gender:</span>
                  <span className="text-white">{authUser?.gender}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Status:</span>
                  <span className="text-green-500">Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {!loading?.logoutLoading ? (
          <BiLogOut
            title="Logout"
            className="w-6 h-6 text-white cursor-pointer"
            onClick={logout}
          />
        ) : (
          <span className="loading loading-spinner" />
        )}
      </div>
    </div>
  );
};

export default Footer;
