import { useEffect, useRef } from "react";

const ACCENT = "#C45D3E";
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
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: MUTED_COLOR }}
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
                className="w-40 h-56 sm:w-52 sm:h-72 rounded-xl object-cover shadow-sm"
              />
            ) : (
              <div
                className="w-40 h-56 sm:w-52 sm:h-72 rounded-xl flex items-end p-4 text-white shadow-sm"
                style={{
                  background:
                    "linear-gradient(145deg, #3d4f5c 0%, #2c3e3a 100%)",
                }}
              >
                <span className="text-sm font-semibold leading-tight line-clamp-4">
                  {book.title}
                </span>
              </div>
            )}
          </div>

          <div className="mt-6">
            <h3 className="font-playfair font-bold text-2xl text-[#1A1410] m-0">
              {book.title}
            </h3>
            {book.author && (
              <p className="text-sm m-0 mt-2" style={{ color: MUTED_COLOR }}>
                {book.author}
              </p>
            )}

            {(book.isbn || book.genre) && (
              <p className="text-sm m-0 mt-2" style={{ color: MUTED_COLOR }}>
                {book.isbn && <span>ISBN: {book.isbn}</span>}
                {book.isbn && book.genre && " · "}
                {book.genre && <span>Genre: {book.genre}</span>}
              </p>
            )}

            <div className="mt-6">
              <div
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: MUTED_COLOR, letterSpacing: "0.5px" }}
              >
                Description
              </div>
              {book.description ? (
                <div className="mt-2 pr-1">
                  <p
                    className="text-sm m-0 leading-relaxed whitespace-pre-line"
                    style={{ color: MUTED_COLOR }}
                  >
                    {book.description}
                  </p>
                </div>
              ) : (
                <p className="text-sm m-0 mt-2" style={{ color: MUTED_COLOR }}>
                  No description available.
                </p>
              )}
            </div>
          </div>
        </div>

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
                e.currentTarget.style.backgroundColor = "rgba(234, 179, 8, 0.10)";
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
      </div>
    </div>
  );
}

export default BookDetailsModal;

