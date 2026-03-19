import getGoogleBooks from "../../api/get-google-books";
import { useState } from "react";

const ACCENT = "#C45D3E";
const MUTED_COLOR = "#8A7E74";
const INPUT_BORDER = "#E8E0D8";
const INPUT_BG = "#FAF6F1";
const TEXT_COLOR = "#1A1410";

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

  async function handleSearch(event) {
    event.preventDefault();
    setError("");

    const cleanQuery = query.trim();
    if (!cleanQuery) {
      setError("Please type a book title or author.");
      return;
    }

    try {
      setIsLoading(true);
      const books = await getGoogleBooks(cleanQuery, token ?? null);
      setResults(books);
    } catch (err) {
      setError(err.message || "Could not search books.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAddClick(book, status) {
    try {
      await onAddBook(book, status);
    } catch (err) {
      setError(err.message || "Could not add this book.");
    }
  }

  return (
    <section
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

      {results.length > 0 && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((book) => {
            const alreadyAdded = isAlreadyAdded(book.google_books_id);
            return (
              <article
                key={book.google_books_id}
                className="rounded-xl border border-gray-100 bg-white p-6 flex gap-3"
              >
                {book.cover_image ? (
                  <img
                    src={book.cover_image}
                    alt={book.title}
                    className="w-14 h-20 rounded-md object-cover shrink-0"
                  />
                ) : (
                  <div
                    className="w-14 h-20 rounded-md shrink-0 flex items-center justify-center text-xs text-white"
                    style={{
                      background:
                        "linear-gradient(145deg, #3d4f5c 0%, #2c3e3a 100%)",
                    }}
                  >
                    Book
                  </div>
                )}
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
                      onClick={() => handleAddClick(book, "to_read")}
                      disabled={alreadyAdded}
                      className="text-xs px-3 py-1.5 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed"
                      style={alreadyAdded ? {} : { borderColor: "#f0dfd5" }}
                    >
                      {alreadyAdded ? "Already Added" : "Add to To Read"}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAddClick(book, "reading")}
                      disabled={alreadyAdded}
                      className="text-xs px-3 py-1.5 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed"
                      style={alreadyAdded ? {} : { borderColor: "#f0dfd5" }}
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
    </section>
  );
}

export default BookSearchSection;
