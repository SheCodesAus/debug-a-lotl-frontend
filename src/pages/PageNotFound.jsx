import { Link } from 'react-router-dom';

const ACCENT = "#C45D3E";
const MUTED_COLOR = "#8A7E74";
const PAGE_BG = "#fffaf6";
const SHELF_BG = "#EDE5DC";
const DOOR_COLOR = "#D4C9BC";

const NotFound = () => {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center overflow-hidden p-8"
      style={{ backgroundColor: PAGE_BG, color: "#1A1410" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap');

        .shelf-container {
          perspective: 130rem;
        }

        @keyframes leftDoorOpen {
          60% { transform: rotateY(-115deg); }
          100% { transform: rotateY(-110deg); }
        }
        @keyframes rightDoorOpen {
          60% { transform: rotateY(125deg); }
          100% { transform: rotateY(120deg); }
        }
        @keyframes leftDoorFlap {
          0%   { transform: rotateY(-110deg); }
          5%   { transform: rotateY(-115deg); }
          15%  { transform: rotateY(-107deg); }
          25%  { transform: rotateY(-113deg); }
          30%  { transform: rotateY(-110deg); }
          100% { transform: rotateY(-110deg); }
        }
        @keyframes rightDoorFlap {
          0%   { transform: rotateY(120deg); }
          5%   { transform: rotateY(125deg); }
          15%  { transform: rotateY(117deg); }
          25%  { transform: rotateY(123deg); }
          30%  { transform: rotateY(120deg); }
          100% { transform: rotateY(120deg); }
        }

        .door-left {
          transform-origin: left center;
          animation:
            leftDoorOpen 3.5s ease-out forwards 1s,
            leftDoorFlap 15s linear infinite forwards 9s;
        }
        .door-right {
          transform-origin: right center;
          animation:
            rightDoorOpen 3s ease-out forwards 1.5s,
            rightDoorFlap 10s linear infinite forwards 8s;
        }

        .book-spine {
          writing-mode: vertical-rl;
          text-orientation: mixed;
          transform: rotate(180deg);
          letter-spacing: 0.15rem;
        }

        .book-link:hover {
          background-color: rgba(196, 93, 62, 0.2);
        }
      `}</style>

      {/* Shelf */}
      <div
        className="shelf-container relative w-full max-w-2xl mx-auto rounded-xl shadow-lg"
        style={{
          height: "280px",
          minWidth: "320px",
          border: `6px solid ${DOOR_COLOR}`,
          backgroundColor: SHELF_BG,
          boxShadow: "inset 0 0 2rem rgba(0,0,0,0.08), rgba(26,20,16,0.12) 0px 8px 32px",
        }}
      >
        {/* Books on shelf */}
        <div className="absolute inset-0 flex items-end pb-4 pl-8 gap-2 z-0">
          {/* Book 1 - Home */}
          <Link
            to="/"
            className="book-link flex items-center justify-center rounded-sm transition-colors cursor-pointer"
            style={{
              width: "52px",
              height: "180px",
              backgroundColor: "rgba(196, 93, 62, 0.25)",
              border: "1px solid rgba(196, 93, 62, 0.3)",
            }}
          >
            <span
              className="book-spine text-xs font-semibold uppercase"
              style={{ color: "#1A1410", letterSpacing: "0.15rem" }}
            >
              Home
            </span>
          </Link>

          {/* Book 2 - Clubs */}
          <Link
            to="/clubs"
            className="book-link flex items-center justify-center rounded-sm transition-colors cursor-pointer"
            style={{
              width: "52px",
              height: "210px",
              backgroundColor: "rgba(107, 123, 92, 0.25)",
              border: "1px solid rgba(107, 123, 92, 0.3)",
            }}
          >
            <span
              className="book-spine text-xs font-semibold uppercase"
              style={{ color: "#1A1410", letterSpacing: "0.15rem" }}
            >
              Clubs
            </span>
          </Link>

          {/* Book 3 - Profile */}
          <Link
            to="/profile"
            className="book-link flex items-center justify-center rounded-sm transition-colors cursor-pointer"
            style={{
              width: "52px",
              height: "195px",
              backgroundColor: "rgba(122, 91, 166, 0.2)",
              border: "1px solid rgba(122, 91, 166, 0.25)",
            }}
          >
            <span
              className="book-spine text-xs font-semibold uppercase"
              style={{ color: "#1A1410", letterSpacing: "0.15rem" }}
            >
              Profile
            </span>
          </Link>

          {/* Missing book placeholder */}
          <div
            className="flex items-center justify-center rounded-sm"
            style={{
              width: "52px",
              height: "160px",
              border: `2px dashed ${ACCENT}`,
              opacity: 0.35,
            }}
          />
        </div>

        {/* Left door */}
        <div
          className="door-left absolute top-0 left-0 z-10 flex items-center justify-end pr-4 rounded-r-xl"
          style={{
            width: "50%",
            height: "100%",
            backgroundColor: DOOR_COLOR,
            boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
          }}
        >
          <div
            className="w-5 h-5 rounded-full"
            style={{ backgroundColor: "rgba(196, 93, 62, 0.3)" }}
          />
        </div>

        {/* Right door */}
        <div
          className="door-right absolute top-0 right-0 z-10 flex items-center pl-4 rounded-l-xl"
          style={{
            width: "50%",
            height: "100%",
            backgroundColor: DOOR_COLOR,
            boxShadow: "-2px 0 8px rgba(0,0,0,0.1)",
          }}
        >
          <div
            className="w-5 h-5 rounded-full"
            style={{ backgroundColor: "rgba(196, 93, 62, 0.3)" }}
          />
        </div>
      </div>

      {/* Text */}
      <h1
        className="mt-10 text-5xl font-bold text-center"
        style={{ fontFamily: "'Playfair Display', serif", color: "#1A1410" }}
      >
        Looks like this page checked itself out
      </h1>

      <p
        className="text-center mt-3 text-sm"
        style={{ color: MUTED_COLOR }}
      >
        Error 404 — the page you're looking for can't be found
      </p>

      <Link
        to="/"
        className="mt-6 rounded-lg text-white font-semibold transition hover:opacity-90 px-6 py-3 text-sm"
        style={{ backgroundColor: ACCENT }}
      >
        Back to home
      </Link>
    </div>
  );
};

export default NotFound;