import getGoogleBooks from "../../api/get-google-books";
import { useEffect, useRef, useState } from "react";
import BookDetailsModal from "../modals/BookDetailsModal";

const ACCENT = "#C45D3E";
const MUTED_COLOR = "#8A7E74";
const INPUT_BORDER = "#E8E0D8";
const INPUT_BG = "#FAF6F1";
const TEXT_COLOR = "#1A1410";
const BUTTON_YELLOW = "#eab308";
const BUTTON_GREEN = "rgb(107, 123, 92)";

/* This BookSearch Section is for:
-Shows search UI for owner only
-Calls Google API Books
-Show results
-Let owners click "add to club"
*/

function BookSearchSection({ isOwner, clubBooks, onAddBook, token }) {
  //What user types in the search box
  const [query, setQuery] = useState("");
  //Results we receive from Google Books
  const [results, setResults] = useState([]);
  //Loading state while waiting for API result
  const [isLoading, setIsLoading] = useState(false);
  //Error message if something fails
  const [error, setError] = useState("");

  const [isResultsOpen, setIsResultsOpen] = useState(false);
  const sectionRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const requestSeqRef = useRef(0);

  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  //only owner can see
  if (!isOwner) return null;

  const inputStyle = {
    padding: "12px 16px",
    borderRadius: 8,
    border: `1.5px solid ${INPUT_BORDER}`,
    backgroundColor: INPUT_BG,
    fontSize: 14,
    color: TEXT_COLOR,
  };

  const inputClassName =
    "w-full rounded-lg outline-none box-border transition focus:border-[#1A1410]/40 focus:ring-1 focus:ring-[#1A1410]/20 text-left";

  //Helper: checks if a searched book is already in this club
  function isAlreadyAdded(googleBookId) {
    return clubBooks.some((book) => book.google_books_id === googleBookId);
  }

  async function runSearch(cleanQuery) {
    const seq = ++requestSeqRef.current;
    setIsLoading(true);
    setError("");
    setIsResultsOpen(true);

    try {
      const books = await getGoogleBooks(cleanQuery, token ?? null);
      if (seq !== requestSeqRef.current) return;
      setResults(books);
    } catch (err) {
      if (seq !== requestSeqRef.current) return;
      setResults([]);
      setError(err.message || "Could not search books.");
    } finally {
      if (seq === requestSeqRef.current) setIsLoading(false);
    }
  }

  async function handleSearch(event) {
    event.preventDefault();

    const cleanQuery = query.trim();
    if (!cleanQuery) {
      setResults([]);
      setError("");
      setIsLoading(false);
      setIsResultsOpen(false);
      return;
    }

    await runSearch(cleanQuery);
  }

  async function handleAddClick(book, status) {
    try {
      await onAddBook(book, status);
    } catch (err) {
      setError(err.message || "Could not add this book.");
    }
  }

  function openModal(book) {
    setSelectedBook(book);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setSelectedBook(null);
  }

  function handleResultKeyDown(e, book) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openModal(book);
    }
  }

  useEffect(() => {
    const cleanQuery = query.trim();

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    if (!cleanQuery) {
      requestSeqRef.current += 1; // invalidate in-flight requests
      setResults([]);
      setError("");
      setIsLoading(false);
      setIsResultsOpen(false);
      return;
    }

    debounceTimerRef.current = setTimeout(() => {
      runSearch(cleanQuery);
    }, 400);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    };
  }, [query, token]);

  useEffect(() => {
    if (!isResultsOpen) return;

    function handlePointerDown(e) {
      const root = sectionRef.current;
      if (!root) return;
      if (root.contains(e.target)) return;
      setIsResultsOpen(false);
    }

    window.addEventListener("pointerdown", handlePointerDown);
    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, [isResultsOpen]);

  return (
    <section
      ref={sectionRef}
      className="rounded-2xl bg-white p-10 shadow-sm"
      style={{ boxShadow: "rgba(26, 20, 16, 0.06) 0px 4px 20px" }}
    >
      <h2
        className="text-xs font-semibold uppercase tracking-wider m-0 mb-4"
        style={{ color: MUTED_COLOR, letterSpacing: "0.5px" }}
      >
        Search &amp; add books
      </h2>

      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
        <input
          className={inputClassName}
          style={inputStyle}
          type="text"
          placeholder="Search by title or author"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-lg text-white font-semibold cursor-pointer transition hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
          style={{
            padding: "12px 16px",
            borderRadius: 8,
            backgroundColor: ACCENT,
            fontSize: 14,
            minWidth: 120,
          }}
        >
          {isLoading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && (
        <div className="mt-4 px-3 py-2.5 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </div>
      )}

      {isResultsOpen && isLoading && (
        <p className="mt-4 text-sm m-0" style={{ color: MUTED_COLOR }}>
          Searching…
        </p>
      )}

      {isResultsOpen && results.length > 0 && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((book) => {
            const alreadyAdded = isAlreadyAdded(book.google_books_id);
            return (
              <article
                key={book.google_books_id}
                className="rounded-xl border border-gray-100 bg-white p-6 flex gap-3 cursor-pointer hover:bg-gray-50/40 transition-colors focus:outline-none focus:ring-2 focus:ring-[#1A1410]/20"
                onClick={() => openModal(book)}
                onKeyDown={(e) => handleResultKeyDown(e, book)}
                tabIndex={0}
                role="button"
                aria-label={`View details for ${book.title}`}
              >
                <div className="w-16 shrink-0 self-stretch rounded-md overflow-hidden bg-gray-100">
                  {book.cover_image ? (
                    <img
                      src={book.cover_image}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center text-xs text-white"
                      style={{
                        background:
                          "linear-gradient(145deg, #3d4f5c 0%, #2c3e3a 100%)",
                      }}
                    >
                      Book
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1 flex flex-col">
                  <h3 className="text-sm font-semibold text-[#1A1410] m-0 truncate">
                    {book.title}
                  </h3>
                  <p
                    className="text-xs m-0 mt-1 truncate"
                    style={{ color: MUTED_COLOR }}
                  >
                    {book.author}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddClick(book, "to_read");
                      }}
                      disabled={alreadyAdded}
                      className="text-xs px-3 py-1.5 rounded border bg-transparent disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
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
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddClick(book, "reading");
                      }}
                      disabled={alreadyAdded}
                      className="text-xs px-3 py-1.5 rounded border bg-transparent disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
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
              </article>
            );
          })}
        </div>
      )}

      <BookDetailsModal
        book={selectedBook}
        isOpen={isModalOpen}
        onClose={closeModal}
        alreadyAdded={
          selectedBook ? isAlreadyAdded(selectedBook.google_books_id) : false
        }
        onAddToRead={async () => {
          if (!selectedBook) return;
          await handleAddClick(selectedBook, "to_read");
          closeModal();
        }}
        onSetCurrentlyReading={async () => {
          if (!selectedBook) return;
          await handleAddClick(selectedBook, "reading");
          closeModal();
        }}
      />
    </section>
  );
}

export default BookSearchSection;
