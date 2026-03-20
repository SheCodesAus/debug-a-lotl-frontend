import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";
import ClubHeader from "../components/clubs/ClubHeader";
import BookSearchSection from "../components/clubs/BookSearchSection";
import getClub from "../api/get-club.js";
import postClubBook from "../api/post-club-book";
import patchClubBookStatus from "../api/patch-club-book-status";
import useClubBooks from "../hooks/use-club-books";
import JoinClubForm from "../components/forms/JoinClubForm";
import ScheduleMeetingForm from "../components/forms/ScheduleMeetingForm";
import EditClubForm from "../components/forms/EditClubForm";
import getClubMembers from "../api/get-club-members.js";
import patchClubMember from "../api/patch-club-member.js";
import getClubMeetings from "../api/get-club-meetings.js";
import postAttendMeeting from "../api/post-attend-meeting.js";
import ClubAnnouncmentBoard from "../components/clubs/ClubAnnouncmentBoard.jsx";
import ClubMemberContentPlaceholder from "../components/clubs/ClubMemberContentPlaceholder.jsx";
import BookDetailsModal from "../components/modals/BookDetailsModal";

const ACCENT = "#C45D3E";
const MUTED_COLOR = "#8A7E74";
const PAGE_BG = "#fffaf6";

function ScheduleMeetingModal({ clubId, onClose, onSuccess }) {
  function handleBackdrop(e) {
    if (e.target === e.currentTarget) onClose();
  }
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(26, 20, 16, 0.5)" }}
      onClick={handleBackdrop}
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-white shadow-xl overflow-y-auto"
        style={{ maxHeight: "90vh" }}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED_COLOR }}>
            Schedule a meeting
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors rounded-lg p-1 hover:bg-gray-100"
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M13.5 4.5L4.5 13.5M4.5 4.5l9 9" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="px-6 py-5">
          <ScheduleMeetingForm
            clubId={clubId}
            onSuccess={() => { onClose(); onSuccess(); }}
          />
        </div>
      </div>
    </div>
  );
}

function EditClubModal({ club, token, onClose, onSuccess }) {
  function handleBackdrop(e) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(26, 20, 16, 0.5)" }}
      onClick={handleBackdrop}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl bg-white shadow-xl overflow-y-auto"
        style={{ maxHeight: "90vh" }}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <h2
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: MUTED_COLOR }}
          >
            Edit club
          </h2>
          <button
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

        <div className="px-6 py-5">
          <EditClubForm
            club={club}
            token={token}
            onCancel={onClose}
            onSuccess={(updated) => {
              onSuccess(updated);
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
}

function ClubPage() {
  const { clubId } = useParams();
  const { auth } = useAuth();

  const [club, setClub] = useState(null);
  const [isLoadingClub, setIsLoadingClub] = useState(true);
  const [clubError, setClubError] = useState("");
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedHistoricBook, setSelectedHistoricBook] = useState(null);
  const [showHistoricBookModal, setShowHistoricBookModal] = useState(false);
  const [selectedToReadBook, setSelectedToReadBook] = useState(null);
  const [showToReadModal, setShowToReadModal] = useState(false);
  const [pendingMembers, setPendingMembers] = useState([]);
  const [approvedMembers, setApprovedMembers] = useState([]);
  const [memberActionLoading, setMemberActionLoading] = useState(null);
  const [meetings, setMeetings] = useState([]);

  // ✅ Track booking state per meeting: { [meetingId]: 'idle' | 'loading' | 'booked' | 'error' }
  const [bookingState, setBookingState] = useState({});

  useEffect(() => {
    setBookingState({});
  }, [clubId]);

  const { clubBooks, isLoadingBooks, booksError, refetchClubBooks } =
    useClubBooks(clubId, auth?.token ?? null);

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

  useEffect(() => {
    if (!isOwner || !auth?.token) return;
    async function loadMembers() {
      try {
        const all = await getClubMembers(clubId, auth.token);
        setPendingMembers(all.filter((m) => m.status === "pending"));
        setApprovedMembers(all.filter((m) => m.status === "approved"));
      } catch (err) {
        console.error("Could not load members:", err.message);
      }
    }
    loadMembers();
  }, [isOwner, clubId, auth?.token]);

  useEffect(() => {
    if (!auth?.token) return;
    if (!club) return;
    const canViewMeetings =
      club.is_public || isOwner || club.membership_status === "approved";
    if (!canViewMeetings) {
      setMeetings([]);
      return;
    }
    async function loadMeetings() {
      try {
        const data = await getClubMeetings(clubId, auth.token);
        setMeetings(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Could not load meetings:", err.message);
      }
    }
    loadMeetings();
  }, [clubId, auth?.token, club, isOwner]);

  // ✅ Handle booking a meeting
  async function handleBookMeeting(meetingId) {
    setBookingState((prev) => ({ ...prev, [meetingId]: "loading" }));
    try {
      await postAttendMeeting(meetingId, auth.token);
      setBookingState((prev) => ({ ...prev, [meetingId]: "booked" }));
    } catch (err) {
      setBookingState((prev) => ({ ...prev, [meetingId]: err.message || "Could not book meeting" }));
    }
  }

  async function handleMemberAction(memberId, newStatus) {
    setMemberActionLoading(memberId);
    try {
      await patchClubMember(clubId, memberId, newStatus, auth.token);
      setPendingMembers((prev) => prev.filter((m) => m.id !== memberId));
      if (newStatus === "approved") {
        const member = pendingMembers.find((m) => m.id === memberId);
        if (member) setApprovedMembers((prev) => [...prev, { ...member, status: "approved" }]);
      }
    } catch (err) {
      console.error("Could not update member status:", err.message);
    } finally {
      setMemberActionLoading(null);
    }
  }

  const [isMarkingRead, setIsMarkingRead] = useState(false);
  const [isSettingReading, setIsSettingReading] = useState(false);

  async function moveCurrentReadingToHistoric() {
    if (!currentBook?.id || !auth?.token) return;
    await patchClubBookStatus(auth.token, clubId, currentBook.id, { status: "read" });
  }

  async function handleAddBook(selectedBook, status = "to_read") {
    if (!auth?.token) return;

    if (status === "reading") {
      setIsSettingReading(true);
      try {
        await moveCurrentReadingToHistoric();
        await postClubBook(auth.token, {
          club_id: Number(clubId),
          google_books_id: selectedBook.google_books_id,
          title: selectedBook.title,
          author: selectedBook.author,
          description: selectedBook.description,
          cover_image: selectedBook.cover_image,
          isbn: selectedBook.isbn,
          genre: selectedBook.genre,
          status: "reading",
        });
        await refetchClubBooks();
      } finally {
        setIsSettingReading(false);
      }
      return;
    }

    await postClubBook(auth.token, {
      club_id: Number(clubId),
      google_books_id: selectedBook.google_books_id,
      title: selectedBook.title,
      author: selectedBook.author,
      description: selectedBook.description,
      cover_image: selectedBook.cover_image,
      isbn: selectedBook.isbn,
      genre: selectedBook.genre,
      status: "to_read",
    });
    await refetchClubBooks();
  }

  async function handleStartReading(book) {
    if (!book?.id || !auth?.token) return;
    setIsSettingReading(true);
    try {
      await moveCurrentReadingToHistoric();
      await patchClubBookStatus(auth.token, clubId, book.id, { status: "reading" });
      await refetchClubBooks();
    } finally {
      setIsSettingReading(false);
    }
  }

  async function handleMarkAsRead(book) {
    if (!book?.id || !auth?.token) return;
    setIsMarkingRead(true);
    try {
      await patchClubBookStatus(auth.token, clubId, book.id, { status: "read" });
      await refetchClubBooks();
    } finally {
      setIsMarkingRead(false);
    }
  }

  const books = Array.isArray(clubBooks) ? clubBooks : [];
  const readingBooks = books.filter((book) => book.status === "reading");
  const toReadBooks = books.filter((book) => book.status === "to_read");
  const readBooks = books.filter((book) => book.status === "read");
  const currentBook = readingBooks[0] ?? null;
  const displayMemberCount = memberCount ?? 0;

  const memberList = [
    { id: "owner", name: club?.owner_username ?? "Owner", isOrganiser: true },
    ...approvedMembers.map((m) => ({ id: m.id, name: m.username })),
  ];

  const memberAvatarColors = ["#6b7b5c", "#C45D3E", "#7A5BA6", "#8A7E54", "#5C7387"];

  function getInitials(name) {
    if (!name) return "";
    return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  }

  function formatBookDate(dateString) {
    if (!dateString) return "";
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  }

  function formatMeetingDate(dateString) {
    if (!dateString) return "";
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  }

  function openHistoricBookModal(book) {
    setSelectedHistoricBook(book);
    setShowHistoricBookModal(true);
  }

  function closeHistoricBookModal() {
    setShowHistoricBookModal(false);
    setSelectedHistoricBook(null);
  }

  function openToReadModal(book) {
    setSelectedToReadBook(book);
    setShowToReadModal(true);
  }

  function closeToReadModal() {
    setShowToReadModal(false);
    setSelectedToReadBook(null);
  }

  if (isLoadingClub || isLoadingBooks) return <p className="p-6">Loading...</p>;
  if (clubError) return <p className="p-6 text-red-600">{clubError}</p>;
  if (booksError) return <p className="p-6 text-red-600">{booksError}</p>;
  if (!club) return <p className="p-6">Club not found.</p>;

  const isPrivateNonMemberView =
    !club.is_public &&
    !isOwner &&
    club.membership_status !== "approved";

  return (
    <main className="min-h-full flex flex-col" style={{ backgroundColor: PAGE_BG }}>
      <ClubHeader
        club={club}
        creatorName={creatorName}
        memberCount={memberCount}
        isOwner={isOwner}
        onEditClub={() => setShowEditModal(true)}
      />

      {showEditModal && (
        <EditClubModal
          club={club}
          token={auth?.token ?? null}
          onClose={() => setShowEditModal(false)}
          onSuccess={(updated) => setClub(updated)}
        />
      )}

      <div className="flex-1 px-4 sm:px-6 py-8 max-w-6xl w-full mx-auto space-y-8">
        {/* Owner-only: Pending approvals */}
        {isOwner && (
          <section
            className="rounded-2xl bg-white p-10 shadow-sm"
            style={{ boxShadow: "rgba(26, 20, 16, 0.06) 0px 4px 20px", border: "2px solid #eab308" }}
          >
            <h2 className="text-xs font-semibold uppercase tracking-wider m-0 mb-4" style={{ color: MUTED_COLOR, letterSpacing: "0.5px" }}>
              Pending approvals {pendingMembers.length > 0 && `(${pendingMembers.length})`}
            </h2>
            {pendingMembers.length === 0 ? (
              <p className="text-sm m-0" style={{ color: MUTED_COLOR }}>No pending requests at the moment.</p>
            ) : (
              <ul className="list-none p-0 m-0 space-y-3">
                {pendingMembers.map((member) => (
                  <li key={member.id} className="flex items-center justify-between gap-3">
                    <span className="text-sm text-[#1A1410]">{member.username}</span>
                    <div className="flex gap-2 shrink-0">
                      <button
                        type="button"
                        disabled={memberActionLoading === member.id}
                        onClick={() => handleMemberAction(member.id, "approved")}
                        className="text-xs px-3 py-1 rounded border-0 text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
                        style={{ backgroundColor: "rgb(107, 123, 92)" }}
                      >
                        {memberActionLoading === member.id ? "..." : "accept"}
                      </button>
                      <button
                        type="button"
                        disabled={memberActionLoading === member.id}
                        onClick={() => handleMemberAction(member.id, "rejected")}
                        className="text-xs px-3 py-1 rounded border-0 text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
                        style={{ backgroundColor: "rgb(196, 93, 62)" }}
                      >
                        {memberActionLoading === member.id ? "..." : "reject"}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        <BookSearchSection
          isOwner={isOwner}
          clubBooks={books}
          onAddBook={handleAddBook}
          token={auth?.token ?? null}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-[auto_auto] gap-6">
          {/* About this club */}
          <section
            className="order-1 lg:col-span-2 rounded-2xl bg-white p-6 sm:p-8 shadow-sm"
            style={{ boxShadow: "rgba(26, 20, 16, 0.06) 0px 4px 20px" }}
          >
            <h2 className="text-xs font-semibold uppercase tracking-wider m-0 mb-4" style={{ color: MUTED_COLOR, letterSpacing: "0.5px" }}>
              About this club
            </h2>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-lg flex items-center justify-center text-white text-lg font-semibold shrink-0" style={{ backgroundColor: "#6b7b5c" }}>
                {(club.name || "Club").split(/\s+/).map((s) => s[0]).join("").toUpperCase().slice(0, 2)}
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-[#1A1410] text-base m-0">{club.name}</h3>
                {club.description && (
                  <p className="text-sm m-0 mt-1 line-clamp-2" style={{ color: MUTED_COLOR }}>{club.description}</p>
                )}
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded-full border border-gray-200" style={{ color: MUTED_COLOR }}>
                    {memberCount} member{memberCount !== 1 ? "s" : ""}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#f5f0d9] text-[#5f574f]">Genre A</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#f5f0d9] text-[#5f574f]">Genre B</span>
                </div>
              </div>
            </div>

            {!isOwner && auth?.token && !club.membership_status && (
              <div className="mt-4">
                <JoinClubForm clubId={clubId} isPrivate={!club.is_public} onSuccess={() => setTimeout(() => window.location.reload(), 1500)} />
              </div>
            )}
            {!isOwner && auth?.token && club.membership_status === "pending" && (
              <div className="mt-4 px-3 py-2.5 rounded-lg text-sm" style={{ backgroundColor: "#fdf6ec", border: "1.5px solid #f0d9b5", color: "#8a6a3a" }}>
                Your request is pending approval from the owner.
              </div>
            )}
          </section>

          {/* Currently Reading */}
          <section
            className="order-2 lg:col-span-1 lg:col-start-3 lg:row-start-1 lg:row-span-2 rounded-2xl bg-white p-10 shadow-sm"
            style={{ boxShadow: "rgba(26, 20, 16, 0.06) 0px 4px 20px" }}
          >
            <h2 className="text-xs font-semibold uppercase tracking-wider m-0 mb-4" style={{ color: MUTED_COLOR, letterSpacing: "0.5px" }}>
              Currently Reading
            </h2>
            {currentBook ? (
              <div className="space-y-3">
                {currentBook.cover_image ? (
                  <img src={currentBook.cover_image} alt="" className="w-full max-w-\[260px\] mx-auto h-auto object-cover rounded-lg" />
                ) : (
                  <div className="w-full max-w-\[260px\] mx-auto rounded-lg overflow-hidden flex items-end text-white text-left p-3" style={{ minHeight: 280, background: "linear-gradient(145deg, #2c3e50 0%, #3498db 100%)" }}>
                    <div>
                      <div className="font-semibold text-sm leading-tight">{currentBook.title}</div>
                      <div className="text-xs opacity-90">{currentBook.author}</div>
                    </div>
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="font-playfair font-bold text-xl text-[#1A1410] m-0">{currentBook.title}</h3>
                  {currentBook.author && <p className="text-sm m-0 mt-1" style={{ color: MUTED_COLOR }}>{currentBook.author}</p>}
                  {(currentBook.isbn || currentBook.genre) && (
                    <p className="text-sm m-0 mt-1" style={{ color: MUTED_COLOR }}>
                      {currentBook.isbn && <span>ISBN: {currentBook.isbn}</span>}
                      {currentBook.isbn && currentBook.genre && " · "}
                      {currentBook.genre && <span>Genre: {currentBook.genre}</span>}
                    </p>
                  )}
                  {(currentBook.start_date || currentBook.finish_date || currentBook.added_at) && (
                    <p className="text-xs m-0 mt-2" style={{ color: MUTED_COLOR }}>
                      {[
                        currentBook.start_date && `Started ${formatBookDate(currentBook.start_date)}`,
                        currentBook.finish_date && `Finished ${formatBookDate(currentBook.finish_date)}`,
                        currentBook.added_at && `Added ${formatBookDate(currentBook.added_at)}`,
                      ].filter(Boolean).join(" · ")}
                    </p>
                  )}
                  {currentBook.description && (
                    <p className="text-sm m-0 mt-3 leading-relaxed italic line-clamp-4" style={{ color: MUTED_COLOR }}>
                      "{currentBook.description}"
                    </p>
                  )}
                  {isOwner && (
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={() => handleMarkAsRead(currentBook)}
                        disabled={isMarkingRead || isSettingReading}
                        className="rounded-lg text-white font-semibold cursor-pointer transition hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed px-4 py-2 text-sm"
                        style={{ backgroundColor: ACCENT }}
                      >
                        {isMarkingRead ? "Updating…" : "Mark as read"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm m-0" style={{ color: MUTED_COLOR }}>
                No book is currently set as reading. Add one and move it to Reading.
              </p>
            )}
          </section>

          {/* Members + Meetings */}
          <div className="order-3 lg:col-span-2 lg:row-start-2 flex flex-col space-y-6">
            {/* Members */}
            <section
              className={
                isPrivateNonMemberView
                  ? "rounded-2xl bg-white p-4 sm:p-5 shadow-sm"
                  : "rounded-2xl bg-white p-6 sm:p-8 shadow-sm"
              }
              style={{ boxShadow: "rgba(26, 20, 16, 0.06) 0px 4px 20px" }}
            >
              <h2
                className={`text-xs font-semibold uppercase tracking-wider m-0 ${isPrivateNonMemberView ? "mb-2" : "mb-4"}`}
                style={{ color: MUTED_COLOR, letterSpacing: "0.5px" }}
              >
                {isPrivateNonMemberView ? "Members" : `Members (${displayMemberCount})`}
              </h2>
              {isPrivateNonMemberView ? (
                <ClubMemberContentPlaceholder />
              ) : (
                <>
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
                          <span className="text-sm font-medium text-[#1A1410] truncate">{member.name}</span>
                          {member.isOrganiser && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium shrink-0" style={{ backgroundColor: "#f5f0d9", color: "#8a7e74" }}>
                              Organiser
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                  <button type="button" className="mt-4 text-sm font-semibold transition hover:opacity-80 text-left" style={{ color: ACCENT }}>
                    View all {displayMemberCount} members →
                  </button>
                </>
              )}
            </section>

            {/* ✅ Meetings with functional book button */}
            <section
              className={
                isPrivateNonMemberView
                  ? "rounded-2xl bg-white p-4 sm:p-5 shadow-sm flex-1 min-h-0"
                  : "rounded-2xl bg-white p-6 sm:p-8 shadow-sm flex-1 min-h-0"
              }
              style={{ boxShadow: "rgba(26, 20, 16, 0.06) 0px 4px 20px" }}
            >
              <div className={`flex items-center justify-between ${isPrivateNonMemberView ? "mb-2" : "mb-4"}`}>
                <h2 className="text-xs font-semibold uppercase tracking-wider m-0" style={{ color: MUTED_COLOR, letterSpacing: "0.5px" }}>
                  Meetings
                </h2>
                {isOwner && (
                  <button
                    type="button"
                    onClick={() => setShowScheduleModal(true)}
                    className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg text-white transition hover:opacity-90"
                    style={{ backgroundColor: ACCENT }}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                    </svg>
                    Schedule
                  </button>
                )}
              </div>

              {isPrivateNonMemberView ? (
                <ClubMemberContentPlaceholder />
              ) : meetings.length === 0 ? (
                <p className="text-sm m-0" style={{ color: MUTED_COLOR }}>No meetings scheduled yet.</p>
              ) : (
                <div className="space-y-3">
                  {meetings.map((meeting) => {
                    const bState = bookingState[meeting.id] ?? "idle";
                    const bookedFromApi = meeting.user_has_booked === true;
                    const isBooked =
                      bState === "booked" ||
                      (bState === "idle" && bookedFromApi);
                    const isBooking = bState === "loading";
                    const bookingError =
                      bState !== "idle" &&
                      bState !== "loading" &&
                      bState !== "booked"
                        ? bState
                        : null;

                    return (
                      <div key={meeting.id} className="flex items-start justify-between gap-3 text-sm">
                        <div className="min-w-0 flex-1">
                          <p className="m-0 font-medium text-[#1A1410]">{meeting.title}</p>
                          <p className="m-0 text-xs" style={{ color: MUTED_COLOR }}>
                            {formatMeetingDate(meeting.meeting_date)}
                            {meeting.start_time && ` · ${meeting.start_time.slice(0, 5)}`}
                            {meeting.meeting_type === "virtual" ? " · Virtual" : " · In person"}
                          </p>
                          {/* ✅ Error message under the meeting */}
                          {bookingError && (
                            <p className="m-0 mt-1 text-xs text-red-600">{bookingError}</p>
                          )}
                        </div>

                        {/* ✅ Book button — only for members, not owner */}
                        {!isOwner && (
                          <button
                            type="button"
                            disabled={isBooked || isBooking}
                            onClick={() => handleBookMeeting(meeting.id)}
                            className="text-xs px-3 py-1 rounded shrink-0 transition-colors disabled:cursor-not-allowed"
                            style={{
                              border: isBooked ? "none" : "1px solid #e5e7eb",
                              backgroundColor: isBooked ? "rgb(107, 123, 92)" : "transparent",
                              color: isBooked ? "white" : "#1A1410",
                            }}
                          >
                            {isBooking ? "..." : isBooked ? "✓ Booked" : "book"}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {/* Historic reading */}
          <section
            className="order-2 rounded-2xl bg-white p-6 sm:p-8 shadow-sm"
            style={{ boxShadow: "rgba(26, 20, 16, 0.06) 0px 4px 20px" }}
          >
            <h2 className="text-xs font-semibold uppercase tracking-wider m-0 mb-4" style={{ color: MUTED_COLOR, letterSpacing: "0.5px" }}>
              Historic reading
            </h2>
            {readBooks.length === 0 ? (
              <p className="text-sm m-0" style={{ color: MUTED_COLOR }}>No finished books yet.</p>
            ) : (
              <div className="flex flex-wrap items-start gap-3">
                {readBooks.map((book) => (
                  <div
                    key={book.id}
                    className="w-16 h-24 rounded-md overflow-hidden bg-gray-100 shrink-0 cursor-pointer hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#1A1410]/20"
                    title={[book.title, book.author].filter(Boolean).join(" · ")}
                    role="button"
                    tabIndex={0}
                    aria-label={`View details for ${book.title}`}
                    onClick={() => openHistoricBookModal(book)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        openHistoricBookModal(book);
                      }
                    }}
                  >
                    {book.cover_image ? (
                      <img src={book.cover_image} alt={book.title} className="w-full h-full object-cover" />
                    ) : (
                      <div
                        className="w-full h-full flex items-end p-2 text-white text-[10px] leading-tight"
                        style={{ background: "linear-gradient(145deg, #2c3e50 0%, #3498db 100%)" }}
                      >
                        <span className="line-clamp-2">{book.title}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          <BookDetailsModal
            book={selectedHistoricBook}
            isOpen={showHistoricBookModal}
            onClose={closeHistoricBookModal}
            showActions={false}
          />

          {/* To Read */}
          <section
            className="order-1 rounded-2xl bg-white p-6 sm:p-8 shadow-sm"
            style={{ boxShadow: "rgba(26, 20, 16, 0.06) 0px 4px 20px" }}
          >
            <div className="flex items-center justify-between gap-3 mb-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider m-0" style={{ color: MUTED_COLOR, letterSpacing: "0.5px" }}>
                To Read
              </h2>
              {toReadBooks.length > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full border border-gray-200" style={{ color: MUTED_COLOR }}>
                  {toReadBooks.length}
                </span>
              )}
            </div>

            {toReadBooks.length === 0 ? (
              <p className="text-sm m-0" style={{ color: MUTED_COLOR }}>
                No books in your to-read list yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {toReadBooks.map((book) => (
                  <article
                    key={book.id}
                    className="rounded-xl border border-gray-100 bg-white p-6 flex gap-3 cursor-pointer hover:bg-gray-50/40 transition-colors focus:outline-none focus:ring-2 focus:ring-[#1A1410]/20"
                    onClick={() => openToReadModal(book)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        openToReadModal(book);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`View details for ${book.title}`}
                  >
                    {book.cover_image ? (
                      <img src={book.cover_image} alt={book.title} className="w-16 h-24 rounded-md object-cover shrink-0" />
                    ) : (
                      <div
                        className="w-16 h-24 rounded-md shrink-0 flex items-center justify-center text-xs text-white"
                        style={{ background: "linear-gradient(145deg, #3d4f5c 0%, #2c3e3a 100%)" }}
                      >
                        Book
                      </div>
                    )}
                    <div className="min-w-0 flex-1 flex flex-col">
                      <h3 className="text-sm font-semibold text-[#1A1410] m-0 truncate">{book.title}</h3>
                      {book.author && (
                        <p className="text-xs m-0 mt-1 truncate" style={{ color: MUTED_COLOR }}>{book.author}</p>
                      )}
                      {isOwner && (
                        <div className="mt-3">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartReading(book);
                            }}
                            disabled={isSettingReading}
                            className="rounded-lg text-white font-semibold cursor-pointer transition hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed px-4 py-2 text-sm"
                            style={{ backgroundColor: ACCENT }}
                          >
                            {isSettingReading ? "Updating…" : "Start reading"}
                          </button>
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <BookDetailsModal
            book={selectedToReadBook}
            isOpen={showToReadModal}
            onClose={closeToReadModal}
            showActions={isOwner}
            actionsVariant="startReading"
            onStartReading={async () => {
              if (!selectedToReadBook) return;
              await handleStartReading(selectedToReadBook);
              closeToReadModal();
            }}
            startReadingDisabled={isSettingReading}
          />
        </div>

        <div className="space-y-8">
          <ClubAnnouncmentBoard
            clubId={clubId}
            isOwner={isOwner}
            token={auth?.token ?? null}
            restricted={isPrivateNonMemberView}
          />
        </div>
      </div>

      {showScheduleModal && (
        <ScheduleMeetingModal
          clubId={clubId}
          onClose={() => setShowScheduleModal(false)}
          onSuccess={() => {
            setShowScheduleModal(false);
            getClubMeetings(clubId, auth.token)
              .then((data) => setMeetings(Array.isArray(data) ? data : []))
              .catch(console.error);
          }}
        />
      )}
    </main>
  );
}

export default ClubPage;
