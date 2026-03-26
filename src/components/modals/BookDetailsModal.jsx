import { useEffect, useRef } from "react";
import InlineSpinner from "../ui/InlineSpinner.jsx";

const ACCENT = "#C45D3E";
const BRAND_GREEN = "#6b7b5c";
const MUTED_COLOR = "#8A7E74";
const BUTTON_YELLOW = "#eab308";
const BUTTON_GREEN = "rgb(107, 123, 92)";

function BookDetailsModal({
  book,
  isOpen,
  onClose,
  alreadyAdded,
  onAddToRead,
  onSetCurrentlyReading,
  showActions = true,
  actionsVariant = "add", // "add" | "startReading"
  onStartReading,
  startReadingDisabled = false,
}) {
  const closeButtonRef = useRef(null);
  const lastActiveElementRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    lastActiveElementRef.current = document.activeElement;
    closeButtonRef.current?.focus?.();

    function onKeyDown(e) {
      if (e.key === "Escape") onClose?.();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      lastActiveElementRef.current?.focus?.();
    };
  }, [isOpen, onClose]);

  if (!isOpen || !book) return null;

  function handleBackdrop(e) {
    if (e.target === e.currentTarget) onClose?.();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(26, 20, 16, 0.5)" }}
      onClick={handleBackdrop}
      role="dialog"
      aria-modal="true"
      aria-label="Book details"
    >
      <div
        className="relative w-full max-w-xl rounded-2xl bg-white shadow-xl overflow-hidden flex flex-col"
        style={{ maxHeight: "90vh" }}
      >
        <div className="flex items-center justify-between px-6 sm:px-[70px] pt-8 pb-5 border-b border-gray-100 shrink-0">
          <h2
            className="text-sm font-semibold uppercase tracking-wider m-0"
            style={{ color: "#1A1410", letterSpacing: "0.5px" }}
          >
            Book details
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors rounded-lg p-1 hover:bg-gray-100"
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M13.5 4.5L4.5 13.5M4.5 4.5l9 9"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="px-6 sm:px-[70px] py-7 sm:py-[70px] overflow-y-auto flex-1">
          <div className="flex justify-center">
            {book.cover_image ? (
              <img
                src={book.cover_image}
                alt={book.title}
                className="w-full max-w-[260px] h-auto max-h-[min(360px,50vh)] rounded-lg object-cover shadow-sm block"
              />
            ) : (
              <div
                className="w-full max-w-[260px] min-h-[200px] sm:min-h-[240px] rounded-lg flex items-end p-4 text-white shadow-sm"
                style={{
                  background:
                    "linear-gradient(145deg, #2c3e50 0%, #3498db 100%)",
                }}
              >
                <span className="text-sm font-semibold leading-tight line-clamp-4">
                  {book.title}
                </span>
              </div>
            )}
          </div>

          <div className="mt-6 min-w-0">
            <h3 className="font-playfair font-bold text-xl sm:text-2xl text-[#1A1410] m-0 leading-tight">
              {book.title}
            </h3>
            {book.author && (
              <p className="text-sm font-semibold m-0 mt-2" style={{ color: BRAND_GREEN }}>
                {book.author}
              </p>
            )}
            {book.genre && (
              <span
                className="inline-block px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wide bg-white border border-solid mt-2"
                style={{ borderColor: BRAND_GREEN, color: BRAND_GREEN }}
              >
                {String(book.genre).toUpperCase()}
              </span>
            )}

            {book.isbn && (
              <div className="mt-4">
                <div
                  className="text-[10px] font-semibold uppercase tracking-wider m-0 mb-1"
                  style={{ color: MUTED_COLOR }}
                >
                  ISBN
                </div>
                <p className="text-sm font-medium text-[#1A1410] m-0">{book.isbn}</p>
              </div>
            )}

            {book.description ? (
              <p
                className="text-sm m-0 mt-4 leading-relaxed whitespace-pre-line"
                style={{ color: MUTED_COLOR }}
              >
                {book.description}
              </p>
            ) : (
              <p className="text-sm m-0 mt-4" style={{ color: MUTED_COLOR }}>
                No description available.
              </p>
            )}
          </div>
        </div>

        {showActions && actionsVariant === "add" && (
          <div className="px-6 sm:px-[70px] py-5 border-t border-gray-100 shrink-0 bg-white">
            <div className="flex flex-col sm:flex-row flex-wrap gap-2 justify-center">
              <button
                type="button"
                onClick={onAddToRead}
                disabled={alreadyAdded}
                className="text-xs px-3 py-2 rounded border bg-transparent disabled:opacity-60 disabled:cursor-not-allowed w-full sm:w-auto transition-colors"
                style={{
                  borderColor: alreadyAdded ? "rgb(214, 211, 209)" : BUTTON_YELLOW,
                  color: alreadyAdded ? "#8A7E74" : "#1A1410",
                }}
                onMouseEnter={(e) => {
                  if (alreadyAdded) return;
                  e.currentTarget.style.backgroundColor =
                    "rgba(234, 179, 8, 0.10)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                {alreadyAdded ? "Already Added" : "Add to To Read"}
              </button>

              <button
                type="button"
                onClick={onSetCurrentlyReading}
                disabled={alreadyAdded}
                className="rounded border bg-transparent font-semibold cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed text-xs px-3 py-2 w-full sm:w-auto transition-colors"
                style={{
                  borderColor: alreadyAdded ? "rgb(214, 211, 209)" : BUTTON_GREEN,
                  color: alreadyAdded ? "#8A7E74" : BUTTON_GREEN,
                }}
                onMouseEnter={(e) => {
                  if (alreadyAdded) return;
                  e.currentTarget.style.backgroundColor =
                    "rgba(107, 123, 92, 0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                Set as Currently Reading
              </button>
            </div>
          </div>
        )}

        {showActions && actionsVariant === "startReading" && (
          <div className="px-6 sm:px-[70px] py-5 border-t border-gray-100 shrink-0 bg-white">
            <div className="flex justify-center">
              <button
                type="button"
                onClick={onStartReading}
                disabled={startReadingDisabled}
                aria-busy={startReadingDisabled}
                className="inline-flex items-center justify-center gap-2 rounded-lg text-white font-semibold cursor-pointer transition hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed px-6 py-2 text-sm w-full sm:w-auto min-w-[9rem]"
                style={{ backgroundColor: ACCENT }}
              >
                {startReadingDisabled ? <InlineSpinner size={16} /> : null}
                Start reading
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookDetailsModal;

