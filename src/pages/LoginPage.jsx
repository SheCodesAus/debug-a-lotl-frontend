import { Link } from "react-router-dom";
import LoginForm from "../components/3.forms/LoginForm.jsx";

const ACCENT = "#C45D3E"; // rgb(196, 93, 62) from design

function LoginPage() {
  return (
    <div
      className="min-h-full flex flex-col items-center justify-center px-4 py-12 font-source-sans"
      style={{ backgroundColor: "#fffaf6" }}
    >
      <div
        className="w-full max-w-[520px] rounded-2xl bg-white flex flex-col items-center"
        style={{
          padding: 56,
          boxShadow: "rgba(26, 20, 16, 0.08) 0px 8px 32px",
        }}
      >
        <Link
          to="/"
          className="flex items-center gap-2.5 justify-center w-full mb-8"
          style={{ marginBottom: 32 }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: ACCENT, borderRadius: 8 }}
            aria-hidden
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="1.5"
              aria-hidden
            >
              <path d="M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 004 17V5a2.5 2.5 0 012.5-2.5H20v15H6.5A2.5 2.5 0 004 19.5z" />
            </svg>
          </div>
          <span className="font-playfair font-bold text-[22px] text-[#1A1410]">
            Open Book
          </span>
        </Link>

        <h2
          className="font-playfair font-bold text-[26px] text-center w-full m-0 mb-2"
          style={{ color: "#1A1410" }}
        >
          Welcome back
        </h2>
        <p
          className="font-source-sans text-sm text-center w-full m-0 mb-7"
          style={{ fontSize: 14, color: "#8A7E74" }}
        >
          Sign in to your account
        </p>

        <div className="w-full text-left">
          <LoginForm linkColor={ACCENT} buttonColor={ACCENT} />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
