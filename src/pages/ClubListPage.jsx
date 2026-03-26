/**
 * Club list page: hero, search, grid of book club tiles, pagination.
 * Rendered at route /clubs.
 */
import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";
import getClubs from "../api/get-clubs";
import getBookCategories from "../api/get-book-categories";
import BookClubCard from "../components/clubs/BookClubCard";
import useClubsCurrentBooks from "../hooks/use-clubs-current-books";
import { BookClubCardSkeleton } from "../components/loaders/PageSkeletons.jsx";

const ACCENT = "#C45D3E";
const DARK = "#303030";
const MUTED = "#606060";
const PAGE_SIZE = 8;

function ClubListPage() {
  const { auth } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") ?? "");
  const [visibilityFilter, setVisibilityFilter] = useState(
    searchParams.get("visibility") ?? "all",
  ); // "all" | "public" | "private"
  const [bookCategories, setBookCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);
  const [maxGenreSelect, setMaxGenreSelect] = useState(10);
  const [selectedGenres, setSelectedGenres] = useState(
    searchParams.getAll("genres") ?? [],
  );
  const [isGenresModalOpen, setIsGenresModalOpen] = useState(false);
  const [draftGenres, setDraftGenres] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    setCategoriesLoading(true);
    setCategoriesError(null);
    getBookCategories()
      .then(({ categories, maxSelect }) => {
        if (!cancelled) {
          setBookCategories(categories);
          setMaxGenreSelect(maxSelect);
        }
      })
      .catch((err) => {
        if (!cancelled) setCategoriesError(err.message || "Could not load genres.");
      })
      .finally(() => {
        if (!cancelled) setCategoriesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    // keep URL shareable and stable
    const next = new URLSearchParams();
    const q = searchQuery.trim();
    if (q) next.set("q", q);
    if (visibilityFilter && visibilityFilter !== "all")
      next.set("visibility", visibilityFilter);
    for (const g of selectedGenres) next.append("genres", g);
    setSearchParams(next, { replace: true });
  }, [searchQuery, visibilityFilter, selectedGenres, setSearchParams]);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getClubs(auth?.token ?? null, {
      q: searchQuery,
      visibility: visibilityFilter,
      genres: selectedGenres,
    })
      .then((data) => setClubs(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message || "Failed to load clubs"))
      .finally(() => setLoading(false));
  }, [auth?.token, searchQuery, visibilityFilter, selectedGenres]);

  const filteredClubs = useMemo(() => clubs, [clubs]);

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
  }, [searchQuery, visibilityFilter, selectedGenres]);

  function openGenresModal() {
    setDraftGenres(selectedGenres);
    setIsGenresModalOpen(true);
  }

  function closeGenresModal() {
    setIsGenresModalOpen(false);
  }

  function cancelGenresModal() {
    setDraftGenres([]);
    closeGenresModal();
  }

  function applyGenresModal() {
    setSelectedGenres(draftGenres);
    closeGenresModal();
  }

  function toggleDraftGenre(label) {
    setDraftGenres((prev) => {
      if (prev.includes(label)) return prev.filter((g) => g !== label);
      if (prev.length >= maxGenreSelect) return prev;
      return [...prev, label];
    });
  }

  function removeSelectedGenre(label) {
    setSelectedGenres((prev) => prev.filter((g) => g !== label));
  }

  const draftUnchanged =
    draftGenres.length === selectedGenres.length &&
    draftGenres.every((g) => selectedGenres.includes(g));

  const genresButtonLabel = selectedGenres.length
    ? `Genres (${selectedGenres.length})`
    : "Genres";

  const applyDisabled =
    categoriesLoading || Boolean(categoriesError) || draftUnchanged;

  function handleGenresBackdropClick(e) {
    if (e.target === e.currentTarget) cancelGenresModal();
  }

  function handleSearchSubmit(e) {
    e?.preventDefault?.();
    // Search is already reactive on typing; this button is primarily UX.
    // Trimming ensures the URL stays tidy and avoids accidental trailing-space queries.
    setSearchQuery((prev) => (typeof prev === "string" ? prev.trim() : ""));
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
          {/* Search + filters bar (Fable-style) */}
          <form
            onSubmit={handleSearchSubmit}
            className="w-full rounded-2xl bg-white mb-8"
            style={{
              boxShadow: "rgba(26, 20, 16, 0.10) 0px 10px 28px",
              padding: 16,
            }}
          >
            <div className="flex flex-col lg:flex-row gap-3 lg:gap-6 lg:items-center">
              {/* Search input */}
              <div
                className="flex-1 min-w-0 lg:min-w-[420px] flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-3"
                style={{ backgroundColor: "rgba(250, 246, 241, 0.8)" }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z"
                    stroke={MUTED}
                    strokeWidth="2"
                  />
                  <path
                    d="M21 21l-4.3-4.3"
                    stroke={MUTED}
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <input
                  type="search"
                  placeholder="Search for a club"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-0 outline-none font-nunito text-[#303030] placeholder:text-[#606060]"
                  aria-label="Search book clubs"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3 lg:flex-none lg:items-center lg:gap-8">
                <div className="flex items-center gap-5 sm:gap-7 flex-wrap">
                  {/* Genre */}
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <span
                        className="font-nunito text-[10px] uppercase tracking-wider"
                        style={{ color: MUTED }}
                      >
                        Genre
                      </span>
                      <button
                        type="button"
                        onClick={openGenresModal}
                        className="font-nunito text-sm font-semibold text-left flex items-center gap-2 p-0 border-0 bg-transparent"
                        style={{ color: DARK }}
                        aria-haspopup="dialog"
                        aria-expanded={isGenresModalOpen}
                      >
                        {selectedGenres.length === 1
                          ? selectedGenres[0]
                          : genresButtonLabel}
                        <span aria-hidden="true">▾</span>
                      </button>
                    </div>
                  </div>

                  <div
                    className="hidden sm:block"
                    style={{
                      width: 1,
                      height: 34,
                      backgroundColor: "rgba(48,48,48,0.15)",
                    }}
                  />

                  {/* Visibility */}
                  <div className="flex flex-col">
                    <label
                      className="font-nunito text-[10px] uppercase tracking-wider"
                      style={{ color: MUTED }}
                      htmlFor="visibility"
                    >
                      Visibility
                    </label>
                    <div className="flex items-center gap-2">
                      <select
                        id="visibility"
                        value={visibilityFilter}
                        onChange={(e) => setVisibilityFilter(e.target.value)}
                        className="font-nunito text-sm font-semibold border-0 bg-transparent outline-none p-0"
                        style={{ color: DARK, WebkitAppearance: "none" }}
                        aria-label="Visibility filter"
                      >
                        <option value="all">All clubs</option>
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                      </select>
                      <span aria-hidden="true" className="text-sm" style={{ color: MUTED }}>
                        ▾
                      </span>
                    </div>
                  </div>
                </div>

                {/* Search button */}
                <button
                  type="submit"
                  className="w-full sm:w-auto rounded-xl font-nunito font-semibold text-white transition-colors hover:opacity-90 shrink-0 flex items-center justify-center gap-2"
                  style={{ backgroundColor: ACCENT, padding: "12px 18px" }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M21 21l-4.3-4.3"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  Search
                </button>
              </div>
            </div>
          </form>

          {selectedGenres.length > 0 && (
            <div className="mb-8 sm:mb-10">
              <div className="flex flex-wrap gap-2">
                {selectedGenres.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => removeSelectedGenre(g)}
                    className="px-3 py-1 rounded-full border border-gray-200 font-nunito text-xs hover:bg-white transition-colors"
                    style={{ color: DARK }}
                    aria-label={`Remove ${g} filter`}
                  >
                    {g} ×
                  </button>
                ))}
                <button
                  type="button"
                  className="px-3 py-1 rounded-full border border-gray-200 font-nunito text-xs hover:bg-white transition-colors"
                  style={{ color: ACCENT }}
                  onClick={() => setSelectedGenres([])}
                >
                  Clear all
                </button>
              </div>
            </div>
          )}

          {isGenresModalOpen && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              style={{ backgroundColor: "rgba(26, 20, 16, 0.5)" }}
              onClick={handleGenresBackdropClick}
              role="dialog"
              aria-modal="true"
              aria-label="Select genres"
            >
              <div
                className="w-full max-w-md rounded-2xl bg-white shadow-xl overflow-hidden"
                style={{ maxHeight: "90vh" }}
              >
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
                  <div className="min-w-0">
                    <h2
                      className="text-sm font-semibold uppercase tracking-wider m-0"
                      style={{ color: "#1A1410" }}
                    >
                      Genres
                    </h2>
                    <p className="font-nunito text-xs m-0 mt-1" style={{ color: MUTED }}>
                      Choose up to {maxGenreSelect}. Apply to update results.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={cancelGenresModal}
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

                <div className="px-6 py-5 overflow-y-auto" style={{ maxHeight: "60vh" }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-nunito text-sm" style={{ color: MUTED }}>
                      Selected {draftGenres.length ? `(${draftGenres.length})` : ""}
                    </span>
                    <button
                      type="button"
                      className="text-sm font-nunito font-semibold px-3 py-1 rounded-lg border border-gray-200 hover:bg-white transition-colors"
                      style={{ color: ACCENT }}
                      onClick={() => setDraftGenres([])}
                      disabled={draftGenres.length === 0}
                    >
                      Clear all
                    </button>
                  </div>

                  {categoriesLoading ? (
                    <p className="font-nunito text-sm m-0" style={{ color: MUTED }}>
                      Loading genres…
                    </p>
                  ) : categoriesError ? (
                    <p className="font-nunito text-sm m-0" style={{ color: MUTED }}>
                      {categoriesError}
                    </p>
                  ) : (
                    <ul className="list-none m-0 p-0 flex flex-col gap-0.5">
                      {bookCategories.map((label) => {
                        const checked = draftGenres.includes(label);
                        const atCap =
                          !checked && draftGenres.length >= maxGenreSelect;
                        return (
                          <li key={label}>
                            <label
                              className="flex items-center gap-2 cursor-pointer font-nunito text-sm py-2 px-2 rounded-md hover:bg-gray-50"
                              style={{ opacity: atCap ? 0.5 : 1 }}
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                disabled={atCap}
                                onChange={() => toggleDraftGenre(label)}
                              />
                              <span className="text-[#303030]">{label}</span>
                            </label>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    className="px-5 py-2.5 rounded-lg font-nunito font-semibold border border-gray-200 hover:bg-gray-50 transition-colors"
                    style={{ color: DARK }}
                    onClick={cancelGenresModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="px-5 py-2.5 rounded-lg font-nunito font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: ACCENT }}
                    onClick={applyGenresModal}
                    disabled={applyDisabled}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Grid of book club tiles */}
          {loading ? (
            <BookClubCardSkeleton count={PAGE_SIZE} />
          ) : filteredClubs.length === 0 ? (
            <p className="font-nunito text-[#606060] text-center py-12">
              {searchQuery.trim() ||
              visibilityFilter !== "all" ||
              selectedGenres.length > 0
                ? "No clubs match your filters. Try fewer genres, different keywords, or show all clubs."
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
