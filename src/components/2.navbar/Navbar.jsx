import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/use-auth";

const PRIMARY = "#b46a4f";

function NavBar() {
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();
  const isLoggedIn = Boolean(auth?.token && auth?.username);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("username");
    window.localStorage.removeItem("user_id");
    setAuth({ token: null, user_id: null, username: null });
    setMobileMenuOpen(false);
    navigate("/");
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const navLinks = (
    <>
      <Link
        to="/"
        onClick={closeMobileMenu}
        className="font-medium text-gray-500 hover:text-gray-800 transition-colors"
      >
        Discover
      </Link>
      <Link
        to="/clubs"
        onClick={closeMobileMenu}
        className="font-medium text-gray-500 hover:text-gray-800 transition-colors"
      >
        How It Works
      </Link>
      {isLoggedIn && (
        <Link
          to="/profile"
          onClick={closeMobileMenu}
          className="font-medium text-gray-500 hover:text-gray-800 transition-colors"
        >
          Profile
        </Link>
      )}
    </>
  );

  const authSection = (
    <div className="flex items-center gap-4">
      {isLoggedIn ? (
        <>
          <span className="text-gray-600 font-medium">Hi, {auth.username}</span>
          <button
            type="button"
            onClick={handleLogout}
            className="px-5 py-2.5 rounded-lg font-medium text-white transition-colors hover:opacity-90"
            style={{ backgroundColor: "#e07a5f" }}
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link
            to="/login"
            onClick={closeMobileMenu}
            className="px-5 py-2.5 rounded-lg font-medium text-[#333333] border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
          >
            Log In
          </Link>
          <Link
            to="/register"
            onClick={closeMobileMenu}
            className="px-5 py-2.5 rounded-lg font-medium text-white transition-colors hover:opacity-90"
            style={{ backgroundColor: PRIMARY }}
          >
            Get Started
          </Link>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top accent bar */}
      <div
        className="h-1 w-full shrink-0"
        style={{ backgroundColor: PRIMARY }}
        aria-hidden
      />
      <nav className="flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 py-4 bg-[#f9f6f2]">
        {/* Logo + title */}
        <Link
          to="/"
          onClick={closeMobileMenu}
          className="flex items-center gap-2 shrink-0"
        >
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: PRIMARY }}
            aria-hidden
          >
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <span className="font-semibold text-gray-900 text-lg">Open Book</span>
        </Link>

        {/* Desktop: center nav + right auth */}
        <div className="hidden md:flex md:items-center md:gap-8 md:flex-1 md:justify-center md:mr-6">
          {navLinks}
        </div>
        <div className="hidden md:flex md:items-center md:ml-auto">
          {authSection}
        </div>

        {/* Mobile: burger button */}
        <div className="md:hidden ml-auto">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div
          className="md:hidden bg-[#f9f6f2] px-4 py-4 flex flex-col gap-4"
          role="dialog"
          aria-label="Mobile navigation"
        >
          {navLinks}
          <div className="pt-2 border-t border-gray-200/60">
            {authSection}
          </div>
        </div>
      )}

      <main className="flex-1 bg-[#f9f6f2] overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default NavBar;
