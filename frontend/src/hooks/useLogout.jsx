import { useState } from "react";
import { errorHandler } from "../helpers";
import { useAuthContext } from "../context/AuthContext";

export const useLogout = () => {
  const { setAuthUser } = useAuthContext();

  const [loading, setLoading] = useState({
    logoutLoading: false,
  });

  const _manageLoading = (key, value) => {
    setLoading((prev) => ({ ...prev, [key]: value }));
  };

  const _logout = async () => {
    try {
      _manageLoading("logoutLoading", true);

      const res = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res?.json();

      if (data?.error) {
        throw new Error(data?.error);
      }

      localStorage.removeItem("chat-user");
      setAuthUser(null);
    } catch (err) {
      errorHandler(err);
    } finally {
      _manageLoading("logoutLoading", false);
    }
  };

  return {
    logout: _logout,
    loading: loading,
  };
};
