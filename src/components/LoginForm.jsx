import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";
import postLogin from "../api/post-login";

// Simple controlled login form that tracks username and password in local state
function LoginForm() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  // Group both fields in a single state object so we can update them together
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState(null);

  // Generic change handler that updates whichever input field was edited
  const handleChange = (event) => {
    const { id, value } = event.target; // e.g. id === "username" or "password"
    setCredentials((prevCredentials) => ({
      ...prevCredentials, // keep the other field(s) unchanged
      [id]: value, // update only the field that matches the input's id
    }));
  };

  // Handle the login button click / form submission:
  // 1. Prevent the browser's default form submit (page reload)
  // 2. Call postLogin to send the credentials to the backend
  // 3. If successful and we get both token and username, persist them, update auth, and navigate home
  // 4. If the response is missing token/username or the request fails, show an error
  const handleSubmit = (event) => {
    event.preventDefault();
    setError(null);

    if (!credentials.username || !credentials.password) return;

    postLogin(credentials.username, credentials.password)
      .then((response) => {
        if (!response.token || !response.username) {
          setError("Invalid response from server. Please try again.");
          return;
        }
        // Persist the returned token and username so the user stays logged in on refresh
        window.localStorage.setItem("token", response.token);
        window.localStorage.setItem("username", response.username);
        // Update the global auth context so the rest of the app knows we're logged in
        setAuth({ token: response.token, username: response.username });
        // Redirect the user to the home page after a successful login
        navigate("/");
      })
      .catch((err) => {
        setError(err.message || "Login failed. Please try again.");
      });
  };

  return (
    <div className="w-[360px] mx-auto my-[60px] px-12 pt-10 pb-12 bg-white rounded-3xl shadow-xl font-sans">
      <h2 className="m-0 mb-6 text-2xl font-bold text-gray-900">Log In</h2>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        {error && (
          <div className="px-3 py-2.5 rounded-[10px] bg-red-50 border border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-gray-500" htmlFor="username">
            Your email
          </label>
          <input
            className="px-3 py-2.5 rounded-[10px] border border-gray-200 bg-gray-50 text-sm outline-none transition focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30 placeholder:text-gray-400"
            type="text"
            id="username"
            placeholder="Enter username"
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-gray-500" htmlFor="password">
            Your password
          </label>
          <input
            className="px-3 py-2.5 rounded-[10px] border border-gray-200 bg-gray-50 text-sm outline-none transition focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30 placeholder:text-gray-400"
            type="password"
            id="password"
            placeholder="Password"
            onChange={handleChange}
          />
        </div>

        <button
          className="mt-2.5 w-full py-3 px-4 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white text-[15px] font-semibold cursor-pointer shadow-lg shadow-blue-600/35 transition hover:-translate-y-px hover:shadow-xl hover:shadow-blue-600/45 active:translate-y-0 active:shadow-md"
          type="submit"
        >
          Log In
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
