import { useState } from "react";
import { useAuth } from "../hooks/use-auth";

// Simple controlled login form that tracks username and password in local state
function LoginForm() {
  const { setAuth } = useAuth();
  // Group both fields in a single state object so we can update them together
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  // Generic change handler that updates whichever input field was edited
  const handleChange = (event) => {
    const { id, value } = event.target; // e.g. id === "username" or "password"
    setCredentials((prevCredentials) => ({
      ...prevCredentials, // keep the other field(s) unchanged
      [id]: value, // update only the field that matches the input's id
    }));
  };

  // Right now the form only captures values; submit behavior can be added later
  return (
    <form>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          placeholder="Enter username"
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          placeholder="Password"
          onChange={handleChange}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
}

export default LoginForm;
