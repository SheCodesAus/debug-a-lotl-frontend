import { useState } from "react";
import { useAuth } from "../hooks/use-auth";
import postLogin from "../api/post-login";
import "./LoginForm.css";

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

  // Handle the login button click / form submission
  // 1. Stop the browser's default form submit (page reload)
  // 2. Make sure both username and password have been filled in
  // 3. Call our `postLogin` helper to send the credentials to the backend
  // 4. If successful, save the token, update auth state, and navigate home
  const handleSubmit = (event) => {
    // Prevent the browser from doing a full page reload on form submit
    event.preventDefault();

    // Only attempt to log in if both fields have some value
    if (credentials.username && credentials.password) {
      // Send the username/password to the login API helper
      postLogin(credentials.username, credentials.password).then((response) => {
        // Persist the returned token in localStorage so the user stays logged in on refresh
        window.localStorage.setItem("token", response.token);

        // Update the global auth context so the rest of the app knows we're logged in
        setAuth({
          token: response.token,
        });

        // Redirect the user to the home page after a successful login
        navigate("/");
      });
    }
  };

  return (
    <div className="login-form-card">
      <h2 className="login-form-title">Log In</h2>

      <form className="login-form" onSubmit={handleSubmit}>
        <div className="login-form-field">
          <label className="login-form-label" htmlFor="username">
            Your email
          </label>
          <input
            className="login-form-input"
            type="text"
            id="username"
            placeholder="Enter username"
            onChange={handleChange}
          />
        </div>

        <div className="login-form-field">
          <label className="login-form-label" htmlFor="password">
            Your password
          </label>
          <input
            className="login-form-input"
            type="password"
            id="password"
            placeholder="Password"
            onChange={handleChange}
          />
        </div>

        <button className="login-form-button" type="submit">
          Log In
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
