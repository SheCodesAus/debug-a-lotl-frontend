import { Link } from "react-router-dom";

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

function HomePage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#f9f6f2] px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
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
            Organize your book club, vote on your next read, track progress, and
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
            <Link
              to="/clubs"
              className="px-6 py-3 rounded-lg font-semibold border-2 transition-colors hover:bg-gray-100"
              style={{ color: DARK, borderColor: DARK }}
            >
              See How It Works
            </Link>
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
    </div>
  );
}

export default HomePage;
