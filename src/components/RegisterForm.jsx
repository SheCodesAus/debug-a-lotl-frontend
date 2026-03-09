import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";
import postRegister from "../api/post-register";
import postLogin from "../api/post-login";

function RegisterForm() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [fields, setFields] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    const { id, value } = event.target;
    setFields((prev) => ({ ...prev, [id]: value }));
    setError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (!fields.username || !fields.password) {
      setError("Username and password are required.");
      return;
    }

    if (fields.password !== fields.passwordConfirm) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await postRegister({
        username: fields.username,
        email: fields.email,
        password: fields.password,
      });

      const response = await postLogin(fields.username, fields.password);
      if (!response.token || !response.username) {
        setError("Invalid response from server. Please try again.");
        return;
      }
      const user_id = response.user_id ?? null;
      window.localStorage.setItem("token", response.token);
      window.localStorage.setItem("username", response.username);
      if (user_id != null) window.localStorage.setItem("user_id", String(user_id));
      setAuth({ token: response.token, user_id, username: response.username });
      navigate("/");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="w-[360px] mx-auto my-[60px] px-12 pt-10 pb-12 bg-white rounded-3xl shadow-xl font-sans">
      <h2 className="m-0 mb-6 text-2xl font-bold text-gray-900">Register</h2>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        {error && (
          <div className="px-3 py-2.5 rounded-[10px] bg-red-50 border border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-gray-500" htmlFor="username">
            Username
          </label>
          <input
            className="px-3 py-2.5 rounded-[10px] border border-gray-200 bg-gray-50 text-sm outline-none transition focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30 placeholder:text-gray-400"
            type="text"
            id="username"
            placeholder="Choose a username"
            value={fields.username}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-gray-500" htmlFor="email">
            Email (optional)
          </label>
          <input
            className="px-3 py-2.5 rounded-[10px] border border-gray-200 bg-gray-50 text-sm outline-none transition focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30 placeholder:text-gray-400"
            type="email"
            id="email"
            placeholder="you@example.com"
            value={fields.email}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-gray-500" htmlFor="password">
            Password
          </label>
          <input
            className="px-3 py-2.5 rounded-[10px] border border-gray-200 bg-gray-50 text-sm outline-none transition focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30 placeholder:text-gray-400"
            type="password"
            id="password"
            placeholder="Choose a password"
            value={fields.password}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-gray-500" htmlFor="passwordConfirm">
            Confirm password
          </label>
          <input
            className="px-3 py-2.5 rounded-[10px] border border-gray-200 bg-gray-50 text-sm outline-none transition focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30 placeholder:text-gray-400"
            type="password"
            id="passwordConfirm"
            placeholder="Confirm your password"
            value={fields.passwordConfirm}
            onChange={handleChange}
          />
        </div>

        <button
          className="mt-2.5 w-full py-3 px-4 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white text-[15px] font-semibold cursor-pointer shadow-lg shadow-blue-600/35 transition hover:-translate-y-px hover:shadow-xl hover:shadow-blue-600/45 active:translate-y-0 active:shadow-md"
          type="submit"
        >
          Create account
        </button>
      </form>
    </div>
  );
}

export default RegisterForm;
