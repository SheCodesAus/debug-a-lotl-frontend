import { createContext, useState, useEffect } from "react";
import getCurrentUser from "../api/get-current-user";

export const AuthContext = createContext();

export const AuthProvider = (props) => {
  const [auth, setAuth] = useState({
    token: window.localStorage.getItem("token"),
    username: window.localStorage.getItem("username"),
  });

  // When we have a token but no username (e.g. old session or page refresh), fetch the current user
  useEffect(() => {
    if (!auth.token || auth.username) return;

    getCurrentUser(auth.token)
      .then((data) => {
        const username = data.username ?? null;
        if (username) {
          window.localStorage.setItem("username", username);
          setAuth((prev) => ({ ...prev, username }));
        }
      })
      .catch(() => {
        // Token may be invalid; clear auth so the user can log in again
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("username");
        setAuth({ token: null, username: null });
      });
  }, [auth.token, auth.username]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {props.children}
    </AuthContext.Provider>
  );
};
