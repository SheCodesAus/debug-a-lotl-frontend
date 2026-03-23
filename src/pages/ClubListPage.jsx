/**
 * Club list page: hero, search, grid of book club tiles, pagination.
 * Rendered at route /clubs.
 */
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";
import getClubs from "../api/get-clubs";
import BookClubCard from "../components/clubs/BookClubCard";
import useClubsCurrentBooks from "../hooks/use-clubs-current-books";

const ACCENT = "#C45D3E";
const DARK = "#303030";
const PAGE_SIZE = 8;

function ClubListPage() {
  const { auth } = useAuth();
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibilityFilter, setVisibilityFilter] = useState("all"); // "all" | "public" | "private"
  const [page, setPage] = useState(1);

  useEffect(() => {
    setError(null);
    getClubs(auth?.token ?? null)
      .then((data) => setClubs(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message || "Failed to load clubs"))
      .finally(() => setLoading(false));
  }, [auth?.token]);

  const filteredClubs = useMemo(() => {
    let result = clubs;
    if (visibilityFilter === "public")
      result = result.filter((c) => c.is_public === true);
    else if (visibilityFilter === "private")
      result = result.filter((c) => !c.is_public);
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (c) =>
          (c.name && c.name.toLowerCase().includes(q)) ||
          (c.description && c.description.toLowerCase().includes(q)),
      );
    }
    return result;
  }, [clubs, searchQuery, visibilityFilter]);

  const displayedCount = page * PAGE_SIZE;
  const displayedClubs = filteredClubs.slice(0, displayedCount);
  const hasMore =
    filteredClubs.length > PAGE_SIZE && displayedCount < filteredClubs.length;

  const { currentBooksByClubId } = useClubsCurrentBooks(
    displayedClubs.map((c) => c?.id).filter(Boolean),
    auth?.token ?? null,
  );

  useEffect(() => {
    setPage(1);
  }, [searchQuery, visibilityFilter]);

  if (loading) {
    return (
      <div className="min-h-full flex flex-col bg-[rgb(253,252,250)]">
        <div className="flex-1 flex items-center justify-center py-24">
          <p className="font-nunito text-[#606060]">Loading clubs…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-full flex flex-col bg-[rgb(253,252,250)]">
        <div className="flex-1 flex items-center justify-center py-24">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full flex flex-col bg-[rgb(253,252,250)]">
      <div className="flex-1">
        {/* Hero: book-club image background + title */}
        <section
          className="relative w-full aspect-[4/1] min-h-[180px] max-h-[280px] bg-[rgb(247,244,240)] bg-cover bg-center"
          style={{ backgroundImage: "url(/img/book-club.jpg)" }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <h1 className="font-lora text-3xl sm:text-4xl md:text-5xl font-bold text-white drop-shadow-md text-center">
              Discover book clubs
            </h1>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          {/* Search bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <input
              type="search"
              placeholder="Search for a book club to join…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 min-w-0 px-4 py-3 rounded-lg border border-gray-200 font-nunito text-[#303030] placeholder:text-[#606060] focus:outline-none focus:ring-2 focus:ring-[#C45D3E]/40 focus:border-[#C45D3E]"
              aria-label="Search book clubs"
            />
            <button
              type="button"
              className="px-6 py-3 rounded-lg font-nunito font-semibold text-white transition-colors hover:opacity-90 shrink-0"
              style={{ backgroundColor: ACCENT }}
              onClick={() => {}}
            >
              Search
            </button>
          </div>

          {/* Public / Private filter */}
          <div className="flex flex-wrap items-center gap-2 mb-8 sm:mb-10">
            <span className="font-nunito text-sm text-[#606060] mr-1">
              Show:
            </span>
            {[
              { value: "all", label: "All clubs" },
              { value: "public", label: "Public" },
              { value: "private", label: "Private" },
            ].map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setVisibilityFilter(value)}
                className="px-4 py-2 rounded-lg font-nunito text-sm font-medium transition-colors border"
                style={
                  visibilityFilter === value
                    ? {
                        backgroundColor: ACCENT,
                        color: "white",
                        borderColor: ACCENT,
                      }
                    : {
                        color: DARK,
                        borderColor: "rgb(214,211,209)",
                        backgroundColor: "transparent",
                      }
                }
              >
                {label}
              </button>
            ))}
          </div>

          {/* Grid of book club tiles */}
          {filteredClubs.length === 0 ? (
            <p className="font-nunito text-[#606060] text-center py-12">
              {searchQuery.trim() || visibilityFilter !== "all"
                ? "No clubs match your filters. Try different keywords or show all clubs."
                : "No clubs yet. Create one to get started."}
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedClubs.map((club) => (
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

              {/* Show more */}
              <div className="mt-10 flex justify-center">
                <button
                  type="button"
                  disabled={!hasMore}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-6 py-3 rounded-lg font-nunito text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={
                    hasMore
                      ? { backgroundColor: ACCENT, color: "white" }
                      : {
                          backgroundColor: "rgb(214,211,209)",
                          color: "#606060",
                        }
                  }
                >
                  Show more
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ClubListPage;
