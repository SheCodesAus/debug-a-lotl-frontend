import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/use-auth";
import postLogin from "../../api/post-login";

const MUTED_COLOR = "#8A7E74";
const INPUT_BORDER = "#E8E0D8";
const INPUT_BG = "#FAF6F1";
const TEXT_COLOR = "#1A1410";

function LoginForm({ linkColor = "#C45D3E", buttonColor = "#C45D3E" }) {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    const { id, value } = event.target;
    setCredentials((prev) => ({ ...prev, [id]: value }));
  };

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
        const user_id = response.user_id ?? null;
        const name = response.name ?? null;
        window.localStorage.setItem("token", response.token);
        window.localStorage.setItem("username", response.username);
        if (user_id != null)
          window.localStorage.setItem("user_id", String(user_id));
        if (name != null) window.localStorage.setItem("name", name);
        setAuth({
          token: response.token,
          user_id,
          username: response.username,
          name,
        });
        navigate("/");
      })
      .catch((err) => {
        setError(err.message || "Login failed. Please try again.");
      });
  };

  return (
    <div className="w-full font-source-sans text-left">
      <form
        className="flex flex-col w-full"
        style={{ gap: 16 }}
        onSubmit={handleSubmit}
      >
        {error && (
          <div className="px-3 py-2.5 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700 mb-2">
            {error}
          </div>
        )}

        <div className="w-full">
          <label
            className="block uppercase font-semibold w-full"
            style={{
              fontSize: 13,
              color: MUTED_COLOR,
              letterSpacing: "0.5px",
              marginBottom: 20,
            }}
            htmlFor="username"
          >
            Username
          </label>
          <input
            className="w-full rounded-lg outline-none box-border transition focus:border-[#1A1410]/40 focus:ring-1 focus:ring-[#1A1410]/20 text-left"
            style={{
              padding: "12px 16px",
              borderRadius: 8,
              border: `1.5px solid ${INPUT_BORDER}`,
              backgroundColor: INPUT_BG,
              fontSize: 14,
              color: TEXT_COLOR,
            }}
            type="text"
            id="username"
            placeholder="username"
            value={credentials.username}
            onChange={handleChange}
          />
        </div>

        <div className="w-full">
          <label
            className="block uppercase font-semibold w-full"
            style={{
              fontSize: 13,
              color: MUTED_COLOR,
              letterSpacing: "0.5px",
              marginBottom: 20,
            }}
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="w-full rounded-lg outline-none box-border transition focus:border-[#1A1410]/40 focus:ring-1 focus:ring-[#1A1410]/20 text-left"
            style={{
              padding: "12px 16px",
              borderRadius: 8,
              border: `1.5px solid ${INPUT_BORDER}`,
              backgroundColor: INPUT_BG,
              fontSize: 14,
              color: TEXT_COLOR,
            }}
            type="password"
            id="password"
            placeholder="••••••••"
            value={credentials.password}
            onChange={handleChange}
          />
        </div>

        <button
          className="w-full rounded-lg text-white font-semibold cursor-pointer transition hover:opacity-90"
          style={{
            padding: 12,
            borderRadius: 8,
            backgroundColor: buttonColor,
            fontSize: 15,
            marginTop: 8,
          }}
          type="submit"
        >
          Sign In
        </button>

        <p
          className="text-center m-0 mt-6"
          style={{ fontSize: 13, color: MUTED_COLOR }}
        >
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="font-semibold transition hover:opacity-80"
            style={{ color: linkColor }}
          >
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}

export default LoginForm;
