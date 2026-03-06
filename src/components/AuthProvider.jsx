import { createContext, useState, useEffect } from "react";
import getCurrentUser from "../api/get-current-user";

// Here we create the Context
export const AuthContext = createContext();

// Here we create the component that will wrap our app, this means all its children can access the context using our hook.
export const AuthProvider = (props) => {
  // Using an object for the state here, this way we can add more properties to the state later on like user id.
  const [auth, setAuth] = useState({
    // Here we initialize the context with the token and username from local storage, this way if the user refreshes the page we can still have them in memory.
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
