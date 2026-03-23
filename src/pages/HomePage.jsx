import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import getClubs from "../api/get-clubs";
import { useAuth } from "../hooks/use-auth";
import BookClubCard from "../components/clubs/BookClubCard";
import HomePageStats from "../components/HomePageStats";
import useClubsCurrentBooks from "../hooks/use-clubs-current-books";

const ACCENT = "#C45D3E";
const DARK = "#303030";
const PARAGRAPH = "#606060";
const INITIAL_CLUBS_VISIBLE = 6;

const stripePattern = `repeating-linear-gradient(
  45deg,
  transparent,
  transparent 8px,
  rgba(255,255,255,0.06) 8px,
  rgba(255,255,255,0.06) 16px
)`;

/* Mobile: 3 overlapping tilted cards */
const mobileBooks = [
  {
    title: "Lessons in Chemistry",
    author: "B. Garmus",
    bg: "#a18ead",
    rotation: "-6",
  },
  {
    title: "Project Hail Mary",
    author: "A. Weir",
    bg: "#6d8396",
    rotation: "0",
  },
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
  const { auth } = useAuth();
  const [clubs, setClubs] = useState([]);
  const [clubsLoading, setClubsLoading] = useState(true);
  const [clubsError, setClubsError] = useState(null);

  const { currentBooksByClubId } = useClubsCurrentBooks(
    clubs.map((c) => c?.id).filter(Boolean),
    auth?.token ?? null,
  );

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
                  <p className="font-lora font-bold text-sm sm:text-base leading-tight">
                    {book.title}
                  </p>
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
            <h1
              className="font-lora text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4"
              style={{ color: DARK }}
            >
              <span className="block">Read together,</span>
              <span className="block" style={{ color: ACCENT }}>
                grow together.
              </span>
            </h1>
            <p
              className="text-base sm:text-lg mb-8"
              style={{ color: PARAGRAPH }}
            >
              Organise your book club, vote on your next read, track progress,
              and host discussions — all in one beautiful place.
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

        {/* About Section */}
        <section className="mt-20 sm:mt-24 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 bg-[#f2ece4] py-16 sm:py-20 border-y border-[#e7ddd1]">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-3xl">
              <p
                className="text-xs font-semibold uppercase tracking-[0.22em] mb-3"
                style={{ color: ACCENT }}
              >
                How It Works
              </p>
              <h2
                className="font-lora text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-5"
                style={{ color: DARK }}
              >
                Where Every Page Starts a Conversation
              </h2>

              <p
                className="text-base sm:text-lg leading-8 max-w-2xl"
                style={{ color: PARAGRAPH }}
              >
                Create your own book club, discover others to join, and keep everything organised in one place. From choosing the next read
                to scheduling meetings and sharing updates, our platform helps readers stay connected and enjoy the whole journey together.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
              <article className="rounded-3xl p-7 shadow-sm border border-[#e7ddd1] bg-[#fffaf6]">
                <p
                  className="text-xs font-semibold uppercase tracking-[0.18em] mb-3"
                  style={{ color: "#C45D3E" }}
                >
                  01
                </p>
                <h3
                  className="font-lora text-xl sm:text-2xl font-bold mb-3"
                  style={{ color: DARK }}
                >
                  Create or join clubs
                </h3>
                <p className="text-sm sm:text-base m-0 leading-7" style={{ color: PARAGRAPH }}>
                  Start your own club or find one that matches your reading
                  style. Join public clubs instantly or request access to
                  private ones.
                </p>
              </article>

              <article className="rounded-3xl p-7 shadow-sm border border-[#dce6de] bg-[#f4f8f4]">
                <p
                  className="text-xs font-semibold uppercase tracking-[0.18em] mb-3"
                  style={{ color: "#6b7b5c" }}
                >
                  02
                </p>
                <h3
                  className="font-lora text-xl sm:text-2xl font-bold mb-3"
                  style={{ color: DARK }}
                >
                  Organise books and meetings
                </h3>
                <p className="text-sm sm:text-base m-0 leading-7" style={{ color: PARAGRAPH }}>
                  Club owners can add books, track what the group is reading,
                  schedule meetings, and post announcements to keep everyone
                  updated.
                </p>
              </article>

              <article className="rounded-3xl p-7 shadow-sm border border-[#e5dfeb] bg-[#faf7fd]">
                <p
                  className="text-xs font-semibold uppercase tracking-[0.18em] mb-3"
                  style={{ color: "#7a5ba6" }}
                >
                  03
                </p>
                <h3
                  className="font-lora text-xl sm:text-2xl font-bold mb-3"
                  style={{ color: DARK }}
                >
                  Read together
                </h3>
                <p className="text-sm sm:text-base m-0 leading-7" style={{ color: PARAGRAPH }}>
                  Members can follow the club&apos;s reading journey, book into
                  meetings, and stay involved in discussions along the way. 
                </p>
              </article>
            </div>

          </div>
        </section>

        <section className="mt-8 sm:mt-10 max-w-6xl mx-auto">
          <div className="max-w-5xl mx-auto rounded-[2rem] bg-white px-6 py-12 sm:px-10 sm:py-14 shadow-sm border border-[#ece2d7]">
            <HomePageStats bookClubsCount={clubs.length} embedded />
          </div>
        </section>

        
        {/* Current book clubs section – full-width background band */}
        <section
          id="current-book-clubs"
          className="mt-20 sm:mt-28 py-16 sm:py-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 bg-[rgb(247,244,240)] scroll-mt-20"
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="font-lora text-3xl sm:text-4xl md:text-5xl font-bold text-center text-[#303030] mb-3">
              Current book clubs
            </h2>
            <p className="text-center text-[#606060] text-base sm:text-lg mb-10 max-w-2xl mx-auto">
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
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {clubs.slice(0, INITIAL_CLUBS_VISIBLE).map((club) => (
                    <Link
                      key={club.id}
                      to={`/clubs/${club.id}`}
                      className="block w-full min-w-0"
                    >
                      <BookClubCard
                        club={club}
                        currentBook={currentBooksByClubId?.[club.id] ?? null}
                      />
                    </Link>
                  ))}
                </div>
                {clubs.length > INITIAL_CLUBS_VISIBLE ? (
                  <div className="flex flex-wrap justify-center gap-3 mt-8">
                    <Link
                      to="/clubs"
                      className="px-6 py-3 rounded-lg font-semibold text-white transition-colors hover:opacity-90 inline-block text-center"
                      style={{ backgroundColor: ACCENT }}
                    >
                      See all clubs
                    </Link>
                  </div>
                ) : null}
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default HomePage;
