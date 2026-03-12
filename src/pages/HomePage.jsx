import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import getClubs from "../api/get-clubs";
import { useAuth } from "../hooks/use-auth";

const ACCENT = "#e07a5f";
const DARK = "#303030";
const PARAGRAPH = "#606060";

const stripePattern = `repeating-linear-gradient(
  45deg,
  transparent,
  transparent 8px,
  rgba(255,255,255,0.06) 8px,
  rgba(255,255,255,0.06) 16px
)`;

/* Mobile: 3 overlapping tilted cards */
const mobileBooks = [
  { title: "Lessons in Chemistry", author: "B. Garmus", bg: "#a18ead", rotation: "-6" },
  { title: "Project Hail Mary", author: "A. Weir", bg: "#6d8396", rotation: "0" },
  { title: "Piranesi", author: "S. Clarke", bg: "#7aaba1", rotation: "6" },
];

/* Desktop: 4 cards in 2x2 grid */
const desktopBooks = [
  { title: "Lessons in Chemistry", author: "B. Garmus", bg: "#a18ead" },
  { title: "Project Hail Mary", author: "A. Weir", bg: "#6d8396" },
  { title: "Piranesi", author: "S. Clarke", bg: "#7aaba1" },
  { title: "Midnight Library", author: "M. Haig", bg: "#e3bd74" },
];

/* Stats section: one color per stat, matching hero card palette */
const statsData = [
  { value: "40+", label: "Curated Genres", color: "#a18ead" },
  { value: "70,000+", label: "Books Recommended", color: "#6d8396" },
  { value: "95,000+", label: "Engaged Readers", color: "#7aaba1" },
  { value: "2,300+", label: "Book Clubs", color: "#e3bd74" },
];

function HomePage() {
  const { auth } = useAuth();
  const [clubs, setClubs] = useState([]);
  const [clubsLoading, setClubsLoading] = useState(true);
  const [clubsError, setClubsError] = useState(null);

  useEffect(() => {
    setClubsError(null);
    getClubs(auth?.token ?? null)
      .then((data) => setClubs(Array.isArray(data) ? data : []))
      .catch((err) => setClubsError(err.message || "Failed to load clubs"))
      .finally(() => setClubsLoading(false));
  }, [auth?.token]);

  return (
    <div className="min-h-full flex flex-col bg-[rgb(253,252,250)]">
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between lg:gap-16">
        {/* Mobile only: 3 overlapping tilted cards above content */}
        <div className="flex items-end justify-center gap-0 mb-10 sm:mb-14 lg:hidden">
          {mobileBooks.map((book, i) => (
            <div
              key={book.title}
              className="relative w-28 sm:w-36 flex-shrink-0 rounded-lg shadow-lg"
              style={{
                transform: `rotate(${book.rotation}deg)`,
                zIndex: i === 1 ? 10 : 5 - Math.abs(i - 1),
                marginLeft: i === 0 ? 0 : "-1.5rem",
                marginRight: i === 2 ? 0 : "-1.5rem",
              }}
            >
              <div
                className="aspect-[3/4] rounded-lg overflow-hidden flex flex-col justify-end p-4 text-white"
                style={{
                  backgroundColor: book.bg,
                  backgroundImage: stripePattern,
                }}
              >
                <p className="font-lora font-bold text-sm sm:text-base leading-tight">{book.title}</p>
                <p className="text-xs sm:text-sm opacity-90">{book.author}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Left: text and buttons */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-xl mx-auto lg:mx-0 mb-12 lg:mb-0">
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-3"
            style={{ color: ACCENT }}
          >
            Your book club, simplified
          </p>
          <h1 className="font-lora text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4" style={{ color: DARK }}>
            <span className="block">Read together,</span>
            <span className="block" style={{ color: ACCENT }}>grow together.</span>
          </h1>
          <p
            className="text-base sm:text-lg mb-8"
            style={{ color: PARAGRAPH }}
          >
            Organise your book club, vote on your next read, track progress, and
            host discussions — all in one beautiful place.
          </p>
          <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
            <Link
              to="/clubs/create"
              className="px-6 py-3 rounded-lg font-semibold text-white transition-colors hover:opacity-90"
              style={{ backgroundColor: ACCENT }}
            >
              Create Your Club
            </Link>
            <a
              href="#current-book-clubs"
              className="px-6 py-3 rounded-lg font-semibold border-2 transition-colors hover:bg-gray-100 inline-block"
              style={{ color: DARK, borderColor: DARK }}
            >
              View clubs
            </a>
          </div>
        </div>

        {/* Desktop only: 2x2 book cards - placeholders, replace with Canva images later */}
        <div className="hidden lg:grid grid-cols-2 gap-4 sm:gap-6 w-full max-w-md mx-auto lg:max-w-sm">
          {desktopBooks.map((book) => (
            <div
              key={book.title}
              className="aspect-[3/4] rounded-lg overflow-hidden flex flex-col justify-end p-4 text-white shadow-md"
              style={{
                backgroundColor: book.bg,
                backgroundImage: stripePattern,
              }}
            >
              <p className="font-lora font-bold text-sm sm:text-base leading-tight">
                {book.title}
              </p>
              <p className="text-xs sm:text-sm opacity-90">{book.author}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Current book clubs section – full-width background band */}
      <section id="current-book-clubs" className="mt-20 sm:mt-28 py-16 sm:py-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 bg-[rgb(247,244,240)] scroll-mt-20">
        <div className="max-w-6xl mx-auto">
        <h2 className="font-lora text-2xl sm:text-3xl font-bold text-center text-[#303030] mb-2">
          Current book clubs
        </h2>
        <p className="text-center text-[#606060] text-base sm:text-lg mb-10">
          Browse and join clubs that match your reading style.
        </p>

        {clubsLoading ? (
          <p className="text-center text-[#606060] py-12">Loading clubs…</p>
        ) : clubsError ? (
          <p className="text-center text-red-600 py-12">{clubsError}</p>
        ) : clubs.length === 0 ? (
          <p className="text-center text-[#606060] py-12">
            No clubs yet. Create one to get started.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {clubs.map((club) => (
              <Link
                key={club.id}
                to={`/clubs/${club.id}`}
                className="block p-6 rounded-xl bg-white/80 shadow-sm hover:shadow-md transition-shadow text-left"
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl mb-4 bg-[#e07a5f]/10">
                  📚
                </div>
                <h3 className="font-semibold text-[#303030] text-lg mb-2">
                  {club.name}
                </h3>
                <p className="text-sm text-[#606060] line-clamp-3">
                  {club.description || "No description."}
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-[#606060]">
                  <span>
                    {club.club_meeting_mode === "in_person" ? "In person" : "Virtual"}
                  </span>
                  {club.is_public && (
                    <span className="text-[#e07a5f]">Public</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
        </div>
      </section>

      {/* Stats section – hero background; divider at top is section-above colour with sharp V */}
      <section className="pt-0 pb-16 sm:pb-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 bg-[rgb(253,252,250)]">
        {/* Divider: section-above colour, one pointy dip in the middle (deep V) */}
        <div className="relative -mx-4 sm:-mx-6 lg:-mx-8" aria-hidden>
          <svg
            viewBox="0 0 1440 180"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-20 sm:h-28 md:h-36 block"
            preserveAspectRatio="none"
          >
            <path
              d="M0 0 L1440 0 L1440 80 L720 170 L0 80 Z"
              fill="rgb(247,244,240)"
            />
          </svg>
        </div>
        <div className="pt-8 sm:pt-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 text-center">
            {statsData.map((stat) => (
              <div key={stat.label}>
                <p
                  className="font-lora text-3xl sm:text-4xl md:text-5xl font-bold"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </p>
                <p className="font-nunito mt-1 text-sm sm:text-base text-[#606060]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
        </div>
      </section>
      </div>

      {/* Footer – matches page design and colours */}
      <footer className="px-5 sm:px-6 lg:px-8 pt-12 pb-8 bg-[rgb(247,244,240)]">
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
    </div>
  );
}

export default HomePage;
