import { createContext, useState, useEffect } from "react";
import getCurrentUser from "../api/get-current-user";

// Here we create the Context
export const AuthContext = createContext();

// Here we create the component that will wrap our app, this means all its children can access the context using our hook.
export const AuthProvider = (props) => {
  // Using an object for the state here, this way we can add more properties to the state later on like user id.
  const [auth, setAuth] = useState({
    // Here we initialize the context with the token, user_id and username from local storage, this way if the user refreshes the page we can still have them in memory.
    token: window.localStorage.getItem("token"),
    user_id: window.localStorage.getItem("user_id")
      ? Number(window.localStorage.getItem("user_id"))
      : null,
    username: window.localStorage.getItem("username"),
    name: window.localStorage.getItem("name"),
  });

  // When we have a token but missing username or user_id (e.g. old session or page refresh), fetch the current user
  useEffect(() => {
    if (!auth.token || (auth.username && auth.user_id != null)) return;

    getCurrentUser(auth.token)
      .then((data) => {
        const username = data.username ?? null;
        const user_id = data.id ?? null;
        const name = data.name ?? null;
        if (username != null || user_id != null || name != null) {
          if (username != null) {
            window.localStorage.setItem("username", username);
          }
          if (user_id != null) {
            window.localStorage.setItem("user_id", String(user_id));
          }
          if (name != null) {
            window.localStorage.setItem("name", name);
          }
          setAuth((prev) => ({ ...prev, username, user_id, name }));
        }
      })
      .catch(() => {
        // Token may be invalid; clear auth so the user can log in again
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("username");
        window.localStorage.removeItem("user_id");
        window.localStorage.removeItem("name");
        setAuth({ token: null, user_id: null, username: null, name: null });
      });
  }, [auth.token, auth.username, auth.user_id]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {props.children}
    </AuthContext.Provider>
  );
};
