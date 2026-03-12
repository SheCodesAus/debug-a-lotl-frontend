import { Link } from "react-router-dom";

const ACCENT = "#e07a5f";

function Footer() {
  return (
    <footer className="px-5 sm:px-6 lg:px-8 pt-12 pb-8 bg-[rgb(247,244,240)] shrink-0">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: ACCENT }}
              aria-hidden
            >
              <svg
                className="w-4 h-4 text-white"
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
            <span className="font-lora font-semibold text-lg text-[#303030]">
              Open Book
            </span>
          </div>
          <nav className="flex flex-wrap gap-6" aria-label="Footer navigation">
            <Link
              to="/"
              className="font-nunito text-sm text-[#606060] hover:text-[#303030] transition-colors"
            >
              Discover
            </Link>
            <Link
              to="/clubs"
              className="font-nunito text-sm text-[#606060] hover:text-[#303030] transition-colors"
            >
              How It Works
            </Link>
            <Link
              to="/clubs/create"
              className="font-nunito text-sm font-medium transition-colors hover:opacity-90"
              style={{ color: ACCENT }}
            >
              Create Your Club
            </Link>
          </nav>
        </div>
        <div className="mt-10 pt-8 border-t border-gray-200/70">
          <p className="font-nunito text-sm text-[#606060]">
            © {new Date().getFullYear()} Open Book. Read together, grow together.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
