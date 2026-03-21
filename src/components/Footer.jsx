import { Link } from "react-router-dom";

const ACCENT = "#C45D3E";

function Footer() {
  return (
    <footer className="px-5 sm:px-6 lg:px-8 pt-14 pb-8 bg-[rgb(253,252,250)] shrink-0 border-t border-[#e7ddd1]">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
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
            <span className="font-lora font-bold text-xl tracking-tight text-[#2f2a26]">
              Open Book
            </span>
          </div>
          <nav
            className="flex flex-wrap justify-center sm:justify-end gap-x-6 gap-y-3"
            aria-label="Footer navigation"
          >
            <Link
              to="/"
              className="font-nunito text-[15px] font-semibold text-[#5a534d] hover:text-[#2f2a26] transition-colors"
            >
              Discover
            </Link>
            <Link
              to="/clubs"
              className="font-nunito text-[15px] font-semibold text-[#5a534d] hover:text-[#2f2a26] transition-colors"
            >
              How It Works
            </Link>
            <Link
              to="/clubs/create"
              className="font-nunito text-[15px] font-semibold transition-colors hover:opacity-90"
              style={{ color: ACCENT }}
            >
              Create Your Club
            </Link>
          </nav>
        </div>
        <div className="mt-10 pt-6 border-t border-[#e5dacc] text-center sm:text-left">
          <p className="font-nunito text-sm text-[#706860]">
            © {new Date().getFullYear()} Open Book. Read together, grow together.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
