/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const AuthUser = localStorage?.getItem("chat-user");
    if (AuthUser) {
      setAuthUser(JSON?.parse(AuthUser)); // parse the string to object
    }
  }, []);
  return (
    <AuthContext.Provider
      value={{
        authUser,
        setAuthUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
