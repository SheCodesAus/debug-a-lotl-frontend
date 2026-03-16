import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";

import ClubHeader from "../components/clubs/ClubHeader";
import BookSearchSection from "../components/clubs/BookSearchSection";
import ClubAnnouncmentBoard from "../components/clubs/ClubAnnouncmentBoard";
import getClub from "../api/get-club.js";
import postClubBook from "../api/post-club-book";
import useClubBooks from "../hooks/use-club-books";

const ACCENT = "#C45D3E";
const MUTED_COLOR = "#8A7E74";
const PAGE_BG = "#fffaf6";

function ClubPage() {
  const { clubId } = useParams();
  const { auth } = useAuth();

  const [club, setClub] = useState(null);
  const [isLoadingClub, setIsLoadingClub] = useState(true);
  const [clubError, setClubError] = useState("");

  const {
    clubBooks,
    isLoadingBooks,
    booksError,
    refetchClubBooks,
  } = useClubBooks(clubId);

  useEffect(() => {
    async function loadClub() {
      try {
        setIsLoadingClub(true);
        setClubError("");
        const clubData = await getClub(clubId, auth?.token ?? null);
        setClub(clubData);
      } catch (error) {
        setClubError(error.message || "Could not load this club.");
      } finally {
        setIsLoadingClub(false);
      }
    }
    loadClub();
  }, [clubId, auth?.token]);

  const isOwner = auth?.user_id === club?.owner;
  const creatorName = club?.owner_username ?? null;
  const memberCount = club?.member_count ?? 1;

  async function handleAddBook(selectedBook) {
    await postClubBook({
      club_id: Number(clubId),
      google_books_id: selectedBook.google_books_id,
      title: selectedBook.title,
      author: selectedBook.author,
      description: selectedBook.description,
      cover_image: selectedBook.cover_image,
    });
    await refetchClubBooks();
  }

  const books = Array.isArray(clubBooks) ? clubBooks : [];
  const readingBooks = books.filter((book) => book.status === "READING");
  const readBooks = books.filter((book) => book.status === "READ");
  const currentBook = readingBooks[0] ?? null;

  // Placeholder content for sections that are not yet wired to the backend
  const placeholderPendingApprovals = [
    { id: "placeholder-1", name: "member #1" },
    { id: "placeholder-2", name: "member #2" },
  ];

  const placeholderMeetings = [
    { id: "meeting-1", label: "Meeting 1", book: "TBD book" },
    { id: "meeting-2", label: "Meeting 2", book: "TBD book" },
    { id: "meeting-3", label: "Meeting 3", book: "TBD book" },
  ];

  const displayMemberCount = memberCount ?? 0;

  const memberList = [
    {
      id: "owner",
      name: club?.owner_username ?? "Owner",
      isOrganiser: true,
    },
    { id: "m-2", name: "Jane R." },
    { id: "m-3", name: "Aisha K." },
    { id: "m-4", name: "Tom W." },
    { id: "m-5", name: "Sophia L." },
  ];

  const memberAvatarColors = ["#6b7b5c", "#C45D3E", "#7A5BA6", "#8A7E54", "#5C7387"];

  function getInitials(name) {
    if (!name) return "";
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }

  if (isLoadingClub || isLoadingBooks) return <p className="p-6">Loading...</p>;
  if (clubError) return <p className="p-6 text-red-600">{clubError}</p>;
  if (booksError) return <p className="p-6 text-red-600">{booksError}</p>;
  if (!club) return <p className="p-6">Club not found.</p>;

  return (
    <main className="min-h-full flex flex-col" style={{ backgroundColor: PAGE_BG }}>
      <ClubHeader
        club={club}
        creatorName={creatorName}
        memberCount={memberCount}
      />

      <div className="flex-1 px-4 sm:px-6 py-8 max-w-6xl w-full mx-auto space-y-8">
        {/* Owner-only: book search directly under hero */}
        <BookSearchSection
          isOwner={isOwner}
          clubBooks={books}
          onAddBook={handleAddBook}
        />

        {/* Top row: on mobile About first, then Currently Reading, then Members; on lg Currently Reading (left 2 cols, full height) | About + Members (right col) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-[auto_auto] gap-6">
          {/* About this club: first on mobile, right column row 1 on lg */}
          <section
            className="order-1 lg:order-2 lg:col-span-1 lg:col-start-3 lg:row-start-1 rounded-2xl bg-white p-6 shadow-sm"
            style={{ boxShadow: "rgba(26, 20, 16, 0.06) 0px 4px 20px" }}
          >
            <h2
              className="text-xs font-semibold uppercase tracking-wider m-0 mb-4"
              style={{ color: MUTED_COLOR, letterSpacing: "0.5px" }}
            >
              About this club
            </h2>
            <div className="flex items-start gap-4">
              <div
                className="w-16 h-16 rounded-lg flex items-center justify-center text-white text-lg font-semibold shrink-0"
                style={{ backgroundColor: "#6b7b5c" }}
              >
                {(club.name || "Club")
                  .split(/\s+/)
                  .map((s) => s[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-[#1A1410] text-base m-0">
                  {club.name}
                </h3>
                {club.description && (
                  <p
                    className="text-sm m-0 mt-1 line-clamp-3"
                    style={{ color: MUTED_COLOR }}
                  >
                    {club.description}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <span
                    className="px-2 py-0.5 rounded-full border border-gray-200"
                    style={{ color: MUTED_COLOR }}
                  >
                    {memberCount} member{memberCount !== 1 ? "s" : ""}
                  </span>
                  {/* Placeholder genres until wired to backend */}
                  <span className="px-2 py-0.5 rounded-full bg-[#f5f0d9] text-[#5f574f]">
                    Genre A
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#f5f0d9] text-[#5f574f]">
                    Genre B
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Currently Reading: second on mobile, left (2 cols, span 2 rows) on lg so it matches right column height */}
          <section
            className="order-2 lg:order-1 lg:col-span-2 lg:row-span-2 lg:row-start-1 rounded-2xl bg-white p-6 shadow-sm"
            style={{ boxShadow: "rgba(26, 20, 16, 0.06) 0px 4px 20px" }}
          >
            <h2
              className="text-xs font-semibold uppercase tracking-wider m-0 mb-4"
              style={{ color: MUTED_COLOR, letterSpacing: "0.5px" }}
            >
              Currently Reading
            </h2>
            {currentBook ? (
              <div className="flex flex-col sm:flex-row gap-6">
                {currentBook.cover_image ? (
                  <img
                    src={currentBook.cover_image}
                    alt=""
                    className="w-full sm:w-32 h-48 sm:h-56 object-cover rounded-lg shrink-0"
                  />
                ) : (
                  <div
                    className="w-full sm:w-32 shrink-0 rounded-lg overflow-hidden flex items-end text-white text-left p-3"
                    style={{
                      minHeight: 200,
                      background:
                        "linear-gradient(145deg, #2c3e50 0%, #3498db 100%)",
                    }}
                  >
                    <div>
                      <div className="font-semibold text-sm leading-tight">
                        {currentBook.title}
                      </div>
                      <div className="text-xs opacity-90">
                        {currentBook.author}
                      </div>
                    </div>
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="font-playfair font-bold text-xl text-[#1A1410] m-0 mb-1">
                    {currentBook.title}
                  </h3>
                  <p
                    className="text-sm m-0 mb-3"
                    style={{ color: MUTED_COLOR }}
                  >
                    {currentBook.author}
                    {currentBook.page_count && ` · ${currentBook.page_count} pages`}
                    {currentBook.genre && ` · ${currentBook.genre}`}
                  </p>
                  {currentBook.description && (
                    <p className="text-sm text-[#1A1410] m-0 leading-relaxed">
                      {currentBook.description}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm m-0" style={{ color: MUTED_COLOR }}>
                No book is currently set as reading. Add one and move it to
                Reading.
              </p>
            )}
          </section>

          {/* Members: third on mobile, right column row 2 on lg (below About) */}
          <section
            className="order-3 lg:col-span-1 lg:col-start-3 lg:row-start-2 rounded-2xl bg-white p-6 shadow-sm"
            style={{ boxShadow: "rgba(26, 20, 16, 0.06) 0px 4px 20px" }}
          >
            <h2
              className="text-xs font-semibold uppercase tracking-wider m-0 mb-4"
              style={{ color: MUTED_COLOR, letterSpacing: "0.5px" }}
            >
              Members ({displayMemberCount})
            </h2>
            <ul className="list-none p-0 m-0 flex flex-col gap-3">
              {memberList.slice(0, 4).map((member, index) => (
                <li key={member.id} className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-semibold shrink-0"
                    style={{ backgroundColor: memberAvatarColors[index % memberAvatarColors.length] }}
                  >
                    {getInitials(member.name)}
                  </div>
                  <div className="min-w-0 flex-1 flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-[#1A1410] truncate">
                      {member.name}
                    </span>
                    {member.isOrganiser && (
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-medium shrink-0"
                        style={{
                          backgroundColor: "#f5f0d9",
                          color: "#8a7e74",
                        }}
                      >
                        Organiser
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="mt-4 text-sm font-semibold transition hover:opacity-80 text-left"
              style={{ color: ACCENT }}
            >
              View all {displayMemberCount} members →
            </button>
          </section>
        </div>

        {/* Middle row: Pending approvals, Historic reading & meetings */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Historic reading list */}
          <section
            className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-2"
            style={{ boxShadow: "rgba(26, 20, 16, 0.06) 0px 4px 20px" }}
          >
            <h2
              className="text-xs font-semibold uppercase tracking-wider m-0 mb-4"
              style={{ color: MUTED_COLOR, letterSpacing: "0.5px" }}
            >
              Historic reading
            </h2>
            {readBooks.length === 0 ? (
              <p className="text-sm m-0" style={{ color: MUTED_COLOR }}>
                No finished books yet.
              </p>
            ) : (
              <ol className="list-decimal list-inside space-y-1 text-sm text-[#1A1410] m-0">
                {readBooks.map((book) => (
                  <li key={book.id}>
                    <span className="font-medium">{book.title}</span>
                    {book.author && (
                      <span style={{ color: MUTED_COLOR }}> · {book.author}</span>
                    )}
                  </li>
                ))}
              </ol>
            )}
          </section>

          {/* Meetings - placeholder layout */}
          <section
            className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-1"
            style={{ boxShadow: "rgba(26, 20, 16, 0.06) 0px 4px 20px" }}
          >
            <h2
              className="text-xs font-semibold uppercase tracking-wider m-0 mb-4"
              style={{ color: MUTED_COLOR, letterSpacing: "0.5px" }}
            >
              Meetings
            </h2>
            <div className="space-y-3">
              {placeholderMeetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <div className="min-w-0">
                    <p className="m-0 text-[#1A1410]">{meeting.label}</p>
                    <p
                      className="m-0 text-xs"
                      style={{ color: MUTED_COLOR }}
                    >
                      {meeting.book}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="text-xs px-3 py-1 rounded border border-gray-200 hover:bg-gray-50 shrink-0"
                  >
                    book
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="mt-4 w-full text-xs font-semibold px-3 py-2 rounded border border-dashed border-gray-300 hover:bg-gray-50"
            >
              book new meeting
            </button>
          </section>
        </div>

        <ClubAnnouncmentBoard
          clubId={clubId}
          isOwner={isOwner}
          token={auth?.token ?? null}
        />

        {/* Owner tools: add book and manage club books */}
        {isOwner && (
          <section
            className="space-y-6 rounded-2xl"
          >
            <section
              className="rounded-2xl bg-white p-6 shadow-sm"
              style={{
                boxShadow: "rgba(26, 20, 16, 0.06) 0px 4px 20px",
                border: "2px solid #eab308",
              }}
            >
              <h2
                className="text-xs font-semibold uppercase tracking-wider m-0 mb-4"
                style={{ color: MUTED_COLOR, letterSpacing: "0.5px" }}
              >
                Pending approvals
              </h2>
              <ul className="list-none p-0 m-0 space-y-3">
                {placeholderPendingApprovals.map((member) => (
                  <li
                    key={member.id}
                    className="flex items-center justify-between gap-3"
                  >
                    <span className="text-sm text-[#1A1410]">{member.name}</span>
                    <div className="flex gap-2 shrink-0">
                      <button
                        type="button"
                        className="text-xs px-3 py-1 rounded border-0 text-white hover:opacity-90"
                        style={{ backgroundColor: "rgb(107, 123, 92)" }}
                      >
                        accept
                      </button>
                      <button
                        type="button"
                        className="text-xs px-3 py-1 rounded border-0 text-white hover:opacity-90"
                        style={{ backgroundColor: "rgb(196, 93, 62)" }}
                      >
                        reject
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </section>
        )}
      </div>
    </main>
  );
}

export default ClubPage;
