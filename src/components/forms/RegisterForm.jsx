import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/use-auth";
import postRegister from "../../api/post-register";
import postLogin from "../../api/post-login";

const MUTED_COLOR = "#8A7E74";
const INPUT_BORDER = "#E8E0D8";
const INPUT_BG = "#FAF6F1";
const TEXT_COLOR = "#1A1410";

function RegisterForm({ linkColor = "#C45D3E", buttonColor = "#C45D3E" }) {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [fields, setFields] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
    bio: "",
    profile_picture: "",
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

    if (!fields.name || !fields.username || !fields.email || !fields.password) {
      setError("Name, username, email and password are required.");
      return;
    }

    if (fields.password !== fields.passwordConfirm) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await postRegister({
        name: fields.name,
        username: fields.username,
        email: fields.email,
        password: fields.password,
        bio: fields.bio.trim() || undefined,
        profile_picture: fields.profile_picture.trim() || undefined,
      });

      const response = await postLogin(fields.username, fields.password);
      if (!response.token || !response.username) {
        setError("Invalid response from server. Please try again.");
        return;
      }
      const user_id = response.user_id ?? null;
      const name = response.name ?? (fields.name || null);
      window.localStorage.setItem("token", response.token);
      window.localStorage.setItem("username", response.username);
      if (user_id != null)
        window.localStorage.setItem("user_id", String(user_id));
      if (name != null) window.localStorage.setItem("name", name);
      setAuth({ token: response.token, user_id, username: response.username, name });
      navigate("/");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    }
  };

  const labelStyle = {
    fontSize: 13,
    color: MUTED_COLOR,
    letterSpacing: "0.5px",
    marginBottom: 20,
  };

  const inputStyle = {
    padding: "12px 16px",
    borderRadius: 8,
    border: `1.5px solid ${INPUT_BORDER}`,
    backgroundColor: INPUT_BG,
    fontSize: 14,
    color: TEXT_COLOR,
  };

  const inputClassName =
    "w-full rounded-lg outline-none box-border transition focus:border-[#1A1410]/40 focus:ring-1 focus:ring-[#1A1410]/20 text-left";

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
            style={labelStyle}
            htmlFor="name"
          >
            Name <span className="text-red-500">*</span>
          </label>
          <input
            className={inputClassName}
            style={inputStyle}
            type="text"
            id="name"
            placeholder="Your name"
            value={fields.name}
            onChange={handleChange}
          />
        </div>

        <div className="w-full">
          <label
            className="block uppercase font-semibold w-full"
            style={labelStyle}
            htmlFor="username"
          >
            Username (how you want others to see you){" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            className={inputClassName}
            style={inputStyle}
            type="text"
            id="username"
            placeholder="Choose a username"
            value={fields.username}
            onChange={handleChange}
          />
        </div>

        <div className="w-full">
          <label
            className="block uppercase font-semibold w-full"
            style={labelStyle}
            htmlFor="email"
          >
            Email <span className="text-red-500">*</span>
          </label>
          <input
            className={inputClassName}
            style={inputStyle}
            type="email"
            id="email"
            placeholder="you@example.com"
            value={fields.email}
            onChange={handleChange}
          />
        </div>

        <div className="w-full">
          <label
            className="block uppercase font-semibold w-full"
            style={labelStyle}
            htmlFor="bio"
          >
            Bio (optional)
          </label>
          <textarea
            className={inputClassName}
            style={{ ...inputStyle, minHeight: 80, resize: "vertical" }}
            id="bio"
            placeholder="A short bit about you..."
            value={fields.bio}
            onChange={handleChange}
            rows={3}
          />
        </div>

        <div className="w-full">
          <label
            className="block uppercase font-semibold w-full"
            style={labelStyle}
            htmlFor="profile_picture"
          >
            Profile picture URL (optional)
          </label>
          <input
            className={inputClassName}
            style={inputStyle}
            type="url"
            id="profile_picture"
            placeholder="https://..."
            value={fields.profile_picture}
            onChange={handleChange}
          />
        </div>

        <div className="w-full">
          <label
            className="block uppercase font-semibold w-full"
            style={labelStyle}
            htmlFor="password"
          >
            Password <span className="text-red-500">*</span>
          </label>
          <input
            className={inputClassName}
            style={inputStyle}
            type="password"
            id="password"
            placeholder="Choose a password"
            value={fields.password}
            onChange={handleChange}
          />
        </div>

        <div className="w-full">
          <label
            className="block uppercase font-semibold w-full"
            style={labelStyle}
            htmlFor="passwordConfirm"
          >
            Confirm password <span className="text-red-500">*</span>
          </label>
          <input
            className={inputClassName}
            style={inputStyle}
            type="password"
            id="passwordConfirm"
            placeholder="Confirm your password"
            value={fields.passwordConfirm}
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
          Create account
        </button>

        <p
          className="text-center m-0 mt-6"
          style={{ fontSize: 13, color: MUTED_COLOR }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold transition hover:opacity-80"
            style={{ color: linkColor }}
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterForm;
