import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/use-auth";
import postLogin from "../../api/post-login";
import InlineSpinner from "../ui/InlineSpinner.jsx";

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
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    const { id, value } = event.target;
    setCredentials((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(null);

    if (!credentials.username || !credentials.password) return;

    setIsLoading(true)

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
      })
      .finally(() => {
        setIsLoading(false)
      })
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
          <div className="relative w-full">
            <input
              className="w-full rounded-lg outline-none box-border transition focus:border-[#1A1410]/40 focus:ring-1 focus:ring-[#1A1410]/20 text-left"
              style={{
                padding: "12px 44px 12px 16px",
                borderRadius: 8,
                border: `1.5px solid ${INPUT_BORDER}`,
                backgroundColor: INPUT_BG,
                fontSize: 14,
                color: TEXT_COLOR,
              }}
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="••••••••"
              value={credentials.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="absolute top-1/2 -translate-y-1/2 right-2 flex items-center justify-center rounded-md p-1.5 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#1A1410]/25"
              style={{ color: MUTED_COLOR }}
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
            >
              {showPassword ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden
                >
                  <path d="M3 3l18 18M10.5 10.677a2 2 0 002.655 2.983M9.88 9.88a3 3 0 104.243 4.242M7.362 7.561C5.68 8.74 4.279 10.42 3 12c1.889 2.991 5.282 6 9 6 1.55 0 3.031-.523 4.382-1.56M12 6c4.008 0 6.701 3.009 8 4.5-.375.533-1.297 1.656-2.832 2.786" />
                </svg>
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden
                >
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <button
          className="w-full inline-flex items-center justify-center gap-2 rounded-lg text-white font-semibold cursor-pointer transition hover:opacity-90 min-h-[46px]"
          style={{
            padding: 12,
            borderRadius: 8,
            backgroundColor: buttonColor,
            fontSize: 15,
            marginTop: 8,
          }}
          disabled={isLoading}
          aria-busy={isLoading}
          type="submit"
        >
          {isLoading ? <InlineSpinner size={18} /> : null}
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
