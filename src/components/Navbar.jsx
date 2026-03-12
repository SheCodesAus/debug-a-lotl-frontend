import { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/use-auth";
import Footer from "./Footer";

const PRIMARY = "#b46a4f";
const HEADER_BG = "#e3bd74"; /* golden yellow on scroll */
const HEADER_BG_TOP = "rgb(253,252,250)"; /* hero colour when at top */

function NavBar() {
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();
  const isLoggedIn = Boolean(auth?.token && auth?.username);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll(); // in case we're already scrolled (e.g. refresh)
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        to="/clubs"
        onClick={closeMobileMenu}
        className={`font-medium transition-colors ${isScrolled ? "text-gray-800 hover:text-gray-900" : "text-gray-500 hover:text-gray-800"}`}
      >
        Discover Clubs
      </Link>
      {isLoggedIn && (
        <Link
          to="/profile"
          onClick={closeMobileMenu}
          className={`font-medium transition-colors ${isScrolled ? "text-gray-800 hover:text-gray-900" : "text-gray-500 hover:text-gray-800"}`}
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
          <span
            className={`font-medium ${isScrolled ? "text-gray-800" : "text-gray-600"}`}
          >
            Hi, {auth.username}
          </span>
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
      {/* Sticky header: hero colour at top, yellow on scroll */}
      <header
        className="sticky top-0 z-10 shrink-0 transition-[background-color,box-shadow] duration-200"
        style={{
          backgroundColor: isScrolled ? HEADER_BG : HEADER_BG_TOP,
          boxShadow: isScrolled ? "0 1px 3px 0 rgb(0 0 0 / 0.1)" : "none",
        }}
      >
        <div
          className="h-1 w-full transition-colors duration-200"
          style={{ backgroundColor: isScrolled ? "rgba(0,0,0,0.12)" : PRIMARY }}
          aria-hidden
        />
        <nav className="flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 py-4">
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
            <span className="font-semibold text-gray-900 text-lg">
              Open Book
            </span>
          </Link>

          {/* Desktop: center nav + right auth (lg and up) */}
          <div className="hidden lg:flex lg:items-center lg:gap-8 lg:flex-1 lg:justify-center lg:mr-6">
            {navLinks}
          </div>
          <div className="hidden lg:flex lg:items-center lg:ml-auto">
            {authSection}
          </div>

          {/* Mobile/tablet: burger button (below lg) */}
          <div className="lg:hidden ml-auto">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className={`p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${isScrolled ? "text-gray-800 hover:bg-black/10 focus:ring-gray-600" : "text-gray-600 hover:bg-gray-100 focus:ring-gray-400"}`}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </nav>

        {/* Mobile menu dropdown – inside header so it sticks with nav */}
        {mobileMenuOpen && (
          <div
            className="lg:hidden px-4 py-4 flex flex-col gap-4 border-t border-black/10"
            style={{ backgroundColor: isScrolled ? HEADER_BG : HEADER_BG_TOP }}
            role="dialog"
            aria-label="Mobile navigation"
          >
            {navLinks}
            <div className="pt-2 border-t border-black/10">{authSection}</div>
          </div>
        )}
      </header>

      <main className="flex-1 flex flex-col min-h-0 bg-[rgb(253,252,250)] overflow-y-auto">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default NavBar;
