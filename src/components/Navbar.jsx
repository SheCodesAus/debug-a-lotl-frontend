import { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/use-auth";
import { getFirstNameFromProfile } from "../utils/get-first-name";
import Footer from "./Footer";

const PRIMARY = "#C45D3E";
const HEADER_BG_TOP = "rgb(253,252,250)"; /* hero colour when at top */

function NavBar() {
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();
  const isLoggedIn = Boolean(auth?.token && auth?.username);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const firstName = getFirstNameFromProfile(auth) ?? auth.username ?? "User";

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
    window.localStorage.removeItem("name");
    setAuth({ token: null, user_id: null, username: null, name: null });
    setMobileMenuOpen(false);
    navigate("/");
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const navLinks = (
    <>
      <Link
        to="/clubs"
        onClick={closeMobileMenu}
        className="px-3 py-2 rounded-lg font-nunito font-semibold text-[15px] tracking-[0.01em] text-[#4f4a45] transition-colors hover:bg-black/5 hover:text-[#2f2a26] focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
      >
        Discover Clubs
      </Link>
      {isLoggedIn && (
        <Link
          to="/profile"
          onClick={closeMobileMenu}
          className="px-3 py-2 rounded-lg font-nunito font-semibold text-[15px] tracking-[0.01em] text-[#4f4a45] transition-colors hover:bg-black/5 hover:text-[#2f2a26] focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
        >
          Profile
        </Link>
      )}
    </>
  );

  const authSection = (
    <div className="flex items-center gap-3 text-base">
      {isLoggedIn ? (
        <>
          <span
            className="inline-flex items-center gap-2 font-nunito font-semibold cursor-default select-none text-[#C45D3E]"
          >
            <img
              src="/img/hand-wave.png"
              alt=""
              className="h-5 w-auto object-contain"
              aria-hidden="true"
            />
            Hi, {firstName}
          </span>
          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl font-nunito font-semibold text-white text-[15px] transition-colors hover:opacity-90"
            style={{ backgroundColor: PRIMARY }}
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link
            to="/login"
            onClick={closeMobileMenu}
            className="px-4 py-2 rounded-xl font-nunito font-semibold text-[15px] text-[#3d3732] border border-[#ddd2c5] bg-white hover:bg-[#faf7f2] transition-colors"
          >
            Log In
          </Link>
          <Link
            to="/register"
            onClick={closeMobileMenu}
            className="px-4 py-2 rounded-xl font-nunito font-semibold text-[15px] text-white transition-colors hover:opacity-90"
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
      {/* Sticky header: keep the same background and add depth on scroll */}
      <header
        className="sticky top-0 z-10 shrink-0 transition-[background-color,box-shadow] duration-200"
        style={{
          backgroundColor: HEADER_BG_TOP,
          boxShadow: isScrolled
            ? "0 14px 30px -22px rgba(26, 20, 16, 0.28)"
            : "0 1px 0 rgba(26, 20, 16, 0.05)",
          backdropFilter: "blur(12px)",
        }}
      >
        <nav className="max-w-6xl mx-auto flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 py-4 text-lg">
          {/* Logo + title */}
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="flex items-center gap-3 shrink-0"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
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
            <span className="font-lora font-bold text-[#2f2a26] text-2xl tracking-tight">
              Open Book
            </span>
          </Link>

          {/* Desktop: center nav + right auth (lg and up) */}
          <div className="hidden lg:flex lg:items-center lg:gap-5 lg:flex-1 lg:justify-center lg:mr-6">
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
              className="p-2 rounded-xl text-[#4f4a45] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 hover:bg-[#f3ede5] focus:ring-[#C45D3E]/40"
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
          <div className="lg:hidden px-4 pb-4">
            <div
              className="mt-2 rounded-2xl border border-[#e7ddd1] bg-[#fffaf6] p-4 flex flex-col gap-3 shadow-sm"
              role="dialog"
              aria-label="Mobile navigation"
            >
              <div className="flex flex-col gap-1">{navLinks}</div>
              <div className="pt-3 border-t border-[#ebe1d5]">{authSection}</div>
            </div>
          </div>
        )}

        <div
          className="h-px w-full"
          style={{ backgroundColor: "rgba(26, 20, 16, 0.08)" }}
          aria-hidden
        />
      </header>

      <main className="flex-1 flex flex-col min-h-0 bg-[rgb(253,252,250)] overflow-y-auto">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default NavBar;
