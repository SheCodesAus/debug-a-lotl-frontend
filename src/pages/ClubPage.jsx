import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
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
import patchClubMeeting from "../api/patch-club-meeting.js";
import deleteClubMeeting from "../api/delete-club-meeting.js";
import ClubAnnouncmentBoard from "../components/clubs/ClubAnnouncmentBoard.jsx";
import ClubMemberContentPlaceholder from "../components/clubs/ClubMemberContentPlaceholder.jsx";
import BookDetailsModal from "../components/modals/BookDetailsModal";
import ScrollReveal from "../components/motion/ScrollReveal.jsx";

const ACCENT = "#C45D3E";
const BRAND_GREEN = "#6b7b5c";
const MUTED_COLOR = "#8A7E74";
const PAGE_BG = "#fffaf6";

// ─── Schedule Meeting Modal ───────────────────────────────────────────────────
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
          <h2
            className="text-sm font-semibold uppercase tracking-wider"
            style={{ color: "#1A1410" }}
          >
            Schedule a meeting
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
          <ScheduleMeetingForm
            clubId={clubId}
            onSuccess={() => {
              onClose();
              onSuccess();
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Edit Meeting Modal ───────────────────────────────────────────────────────
function EditMeetingModal({ clubId, meeting, token, onClose, onSuccess }) {
  const [fields, setFields] = useState({
    title: meeting.title ?? "",
    description: meeting.description ?? "",
    meeting_date: meeting.meeting_date ?? "",
    start_time: meeting.start_time ? meeting.start_time.slice(0, 5) : "",
    end_time: meeting.end_time ? meeting.end_time.slice(0, 5) : "",
    meeting_type: meeting.meeting_type ?? "virtual",
    location: meeting.location ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleBackdrop(e) {
    if (e.target === e.currentTarget) onClose();
  }

  function handleChange(e) {
    const { id, value } = e.target;
    setFields((prev) => ({ ...prev, [id]: value }));
    setError(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    if (
      !fields.title ||
      !fields.meeting_date ||
      !fields.start_time ||
      !fields.end_time
    ) {
      setError("Title, date, start time and end time are required.");
      return;
    }
    setLoading(true);
    try {
      const updated = await patchClubMeeting(token, clubId, meeting.id, fields);
      onSuccess(updated);
      onClose();
    } catch (err) {
      setError(err.message || "Could not update meeting.");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    padding: "10px 14px",
    borderRadius: 8,
    border: "1.5px solid #E8E0D8",
    backgroundColor: "#FAF6F1",
    fontSize: 14,
    color: "#1A1410",
  };
  const inputClass =
    "w-full rounded-lg outline-none box-border transition focus:border-[#1A1410]/40";
  const labelStyle = {
    fontSize: 12,
    color: MUTED_COLOR,
    letterSpacing: "0.5px",
    fontWeight: 600,
    textTransform: "uppercase",
  };

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
          <h2
            className="text-sm font-semibold uppercase tracking-wider"
            style={{ color: "#1A1410" }}
          >
            Edit meeting
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
        <form className="px-6 py-5 flex flex-col gap-4" onSubmit={handleSubmit}>
          {error && (
            <div className="px-3 py-2.5 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              {error}
            </div>
          )}
          <div>
            <label style={labelStyle} htmlFor="title">
              Meeting title
            </label>
            <input
              className={inputClass}
              style={inputStyle}
              type="text"
              id="title"
              value={fields.title}
              onChange={handleChange}
              placeholder="e.g. Chapter 5 discussion"
            />
          </div>
          <div>
            <label style={labelStyle} htmlFor="description">
              Description (optional)
            </label>
            <textarea
              className={inputClass}
              style={{ ...inputStyle, resize: "vertical", minHeight: 70 }}
              id="description"
              value={fields.description}
              onChange={handleChange}
              placeholder="What will you discuss?"
            />
          </div>
          <div>
            <label style={labelStyle} htmlFor="meeting_date">
              Date
            </label>
            <input
              className={inputClass}
              style={inputStyle}
              type="date"
              id="meeting_date"
              value={fields.meeting_date}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label style={labelStyle} htmlFor="start_time">
                Start time
              </label>
              <input
                className={inputClass}
                style={inputStyle}
                type="time"
                id="start_time"
                value={fields.start_time}
                onChange={handleChange}
              />
            </div>
            <div className="flex-1">
              <label style={labelStyle} htmlFor="end_time">
                End time
              </label>
              <input
                className={inputClass}
                style={inputStyle}
                type="time"
                id="end_time"
                value={fields.end_time}
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <label style={labelStyle} htmlFor="meeting_type">
              Meeting type
            </label>
            <select
              className={inputClass}
              style={inputStyle}
              id="meeting_type"
              value={fields.meeting_type}
              onChange={handleChange}
            >
              <option value="virtual">Virtual</option>
              <option value="in_person">In person</option>
            </select>
          </div>
          {fields.meeting_type === "in_person" && (
            <div>
              <label style={labelStyle} htmlFor="location">
                Location
              </label>
              <input
                className={inputClass}
                style={inputStyle}
                type="text"
                id="location"
                value={fields.location}
                onChange={handleChange}
                placeholder="e.g. Central Library, Room 2"
              />
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg text-white font-semibold transition hover:opacity-90 disabled:opacity-60 px-4 py-3 mt-2"
            style={{ backgroundColor: loading ? MUTED_COLOR : ACCENT }}
          >
            {loading ? "Saving…" : "Save changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Delete Meeting Confirm Modal ─────────────────────────────────────────────
function DeleteMeetingModal({ meeting, onClose, onConfirm, loading }) {
  function handleBackdrop(e) {
    if (e.target === e.currentTarget) onClose();
  }
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(26, 20, 16, 0.5)" }}
      onClick={handleBackdrop}
    >
      <div className="relative w-full max-w-sm rounded-2xl bg-white shadow-xl p-6">
        <h2 className="text-base font-semibold text-[#1A1410] mb-2">
          Delete meeting
        </h2>
        <p className="text-sm mb-6" style={{ color: MUTED_COLOR }}>
          Are you sure you want to delete <strong>{meeting.title}</strong>? This
          cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
            style={{ color: MUTED_COLOR }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: "rgb(196, 93, 62)" }}
          >
            {loading ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Meeting Detail Modal (view) ──────────────────────────────────────────────
function MeetingDetailModal({ meeting, onClose }) {
  function handleBackdrop(e) {
    if (e.target === e.currentTarget) onClose();
  }
  function formatDate(dateString) {
    if (!dateString) return "";
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(26, 20, 16, 0.5)" }}
      onClick={handleBackdrop}
    >
      <div className="relative w-full max-w-sm rounded-2xl bg-white shadow-xl p-6">
        <div className="flex items-start justify-between gap-3 mb-4">
          <h2 className="text-base font-semibold text-[#1A1410]">
            {meeting.title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors rounded-lg p-1 hover:bg-gray-100 shrink-0"
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
        <div className="flex flex-col gap-3 text-sm">
          <div
            className="flex items-center gap-2"
            style={{ color: MUTED_COLOR }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect
                x="1"
                y="2"
                width="12"
                height="11"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M1 5h12M5 1v2M9 1v2"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <span>{formatDate(meeting.meeting_date)}</span>
          </div>
          {(meeting.start_time || meeting.end_time) && (
            <div
              className="flex items-center gap-2"
              style={{ color: MUTED_COLOR }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle
                  cx="7"
                  cy="7"
                  r="6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M7 4v3l2 2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <span>
                {meeting.start_time?.slice(0, 5)}
                {meeting.end_time && ` – ${meeting.end_time.slice(0, 5)}`}
              </span>
            </div>
          )}
          <div
            className="flex items-center gap-2"
            style={{ color: MUTED_COLOR }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle
                cx="7"
                cy="7"
                r="6"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M7 4v3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <span>
              {meeting.meeting_type === "virtual" ? "Virtual" : "In person"}
            </span>
          </div>
          {meeting.location && (
            <div
              className="flex items-center gap-2"
              style={{ color: MUTED_COLOR }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M7 1C4.79 1 3 2.79 3 5c0 3.25 4 8 4 8s4-4.75 4-8c0-2.21-1.79-4-4-4z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <circle
                  cx="7"
                  cy="5"
                  r="1.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
              <span>{meeting.location}</span>
            </div>
          )}
          {meeting.description && (
            <p className="mt-1 text-sm text-[#1A1410] leading-relaxed border-t border-gray-100 pt-3">
              {meeting.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Edit Club Modal ──────────────────────────────────────────────────────────
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
            className="text-sm font-semibold uppercase tracking-wider"
            style={{ color: "#1A1410" }}
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

// ─── Main ClubPage ────────────────────────────────────────────────────────────
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
  const [bookingState, setBookingState] = useState({});

  // Meeting modals
  const [viewingMeeting, setViewingMeeting] = useState(null);
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [deletingMeeting, setDeletingMeeting] = useState(null);
  const [isDeletingMeeting, setIsDeletingMeeting] = useState(false);

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
    if (!isOwner || !auth?.token || club?.is_public) {
      setPendingMembers([]);
      return;
    }
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
  }, [isOwner, clubId, auth?.token, club?.is_public]);

  useEffect(() => {
    if (!auth?.token || !club) return;
    const canViewMeetings = isOwner || club.membership_status === "approved";
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

  async function handleBookMeeting(meetingId) {
    setBookingState((prev) => ({ ...prev, [meetingId]: "loading" }));
    try {
      await postAttendMeeting(meetingId, auth.token);
      setBookingState((prev) => ({ ...prev, [meetingId]: "booked" }));
    } catch (err) {
      setBookingState((prev) => ({
        ...prev,
        [meetingId]: err.message || "Could not book meeting",
      }));
    }
  }

  async function handleDeleteMeeting() {
    if (!deletingMeeting) return;
    setIsDeletingMeeting(true);
    try {
      await deleteClubMeeting(auth.token, clubId, deletingMeeting.id);
      setMeetings((prev) => prev.filter((m) => m.id !== deletingMeeting.id));
      setDeletingMeeting(null);
    } catch (err) {
      console.error("Could not delete meeting:", err.message);
    } finally {
      setIsDeletingMeeting(false);
    }
  }

  function handleMeetingUpdated(updated) {
    setMeetings((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
  }

  async function handleMemberAction(memberId, newStatus) {
    setMemberActionLoading(memberId);
    try {
      await patchClubMember(clubId, memberId, newStatus, auth.token);
      setPendingMembers((prev) => prev.filter((m) => m.id !== memberId));
      if (newStatus === "approved") {
        const member = pendingMembers.find((m) => m.id === memberId);
        if (member)
          setApprovedMembers((prev) => [
            ...prev,
            { ...member, status: "approved" },
          ]);
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
    await patchClubBookStatus(auth.token, clubId, currentBook.id, {
      status: "read",
    });
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
      await patchClubBookStatus(auth.token, clubId, book.id, {
        status: "reading",
      });
      await refetchClubBooks();
    } finally {
      setIsSettingReading(false);
    }
  }

  async function handleMarkAsRead(book) {
    if (!book?.id || !auth?.token) return;
    setIsMarkingRead(true);
    try {
      await patchClubBookStatus(auth.token, clubId, book.id, {
        status: "read",
      });
      await refetchClubBooks();
    } finally {
      setIsMarkingRead(false);
    }
  }

  const books = Array.isArray(clubBooks) ? clubBooks : [];
  const readingBooks = books.filter((b) => b.status === "reading");
  const toReadBooks = books.filter((b) => b.status === "to_read");
  const readBooks = [...books.filter((b) => b.status === "read")].sort(
    (a, b) => {
      const stamp = (x) => {
        const raw = x.read_at ?? x.added_at;
        if (!raw) return 0;
        const ms = new Date(raw).getTime();
        return Number.isNaN(ms) ? 0 : ms;
      };
      const diff = stamp(b) - stamp(a);
      if (diff !== 0) return diff;
      return (b.id ?? 0) - (a.id ?? 0);
    },
  );
  const currentBook = readingBooks[0] ?? null;
  const displayMemberCount = memberCount ?? 0;
  const memberList = [
    { id: "owner", name: club?.owner_username ?? "Owner", isOrganiser: true },
    ...approvedMembers.filter((m) => m.user !== club?.owner)
    .map((m) => ({ id: m.id, name: m.username })),
];
  const memberAvatarColors = [
    "#6b7b5c",
    "#C45D3E",
    "#7A5BA6",
    "#8A7E54",
    "#5C7387",
  ];

  function getInitials(name) {
    if (!name) return "";
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0])
      .join("")
      .toUpperCase();
  }
  function formatBookDate(dateString) {
    if (!dateString) return "";
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }
  function formatMeetingDate(dateString) {
    if (!dateString) return "";
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
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

  const restrictMemberSections =
    !isOwner && club.membership_status !== "approved";

  return (
    <main
      className="min-h-full flex flex-col"
      style={{ backgroundColor: PAGE_BG }}
    >
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
      {viewingMeeting && (
        <MeetingDetailModal
          meeting={viewingMeeting}
          onClose={() => setViewingMeeting(null)}
        />
      )}
      {editingMeeting && (
        <EditMeetingModal
          clubId={clubId}
          meeting={editingMeeting}
          token={auth?.token}
          onClose={() => setEditingMeeting(null)}
          onSuccess={handleMeetingUpdated}
        />
      )}
      {deletingMeeting && (
        <DeleteMeetingModal
          meeting={deletingMeeting}
          onClose={() => setDeletingMeeting(null)}
          onConfirm={handleDeleteMeeting}
          loading={isDeletingMeeting}
        />
      )}

      <div className="flex-1 px-4 sm:px-6 py-8 max-w-6xl w-full mx-auto space-y-8">
        {/* Owner-only: Pending approvals */}
        {isOwner && !club?.is_public && (
          <ScrollReveal
            as="section"
            className="rounded-2xl bg-white p-10 shadow-sm"
            style={{
              boxShadow: "rgba(26, 20, 16, 0.06) 0px 4px 20px",
              border: "2px solid #eab308",
            }}
          >
            <h2
              className="text-sm font-semibold uppercase tracking-wider m-0 mb-4"
              style={{ color: "#1A1410", letterSpacing: "0.5px" }}
            >
              Pending approvals{" "}
              {pendingMembers.length > 0 && `(${pendingMembers.length})`}
            </h2>
            {pendingMembers.length === 0 ? (
              <p className="text-sm m-0" style={{ color: MUTED_COLOR }}>
                No pending requests at the moment.
              </p>
            ) : (
              <ul className="list-none p-0 m-0 space-y-3">
                {pendingMembers.map((member) => (
                  <li
                    key={member.id}
                    className="flex items-center justify-between gap-3"
                  >
                    <span className="text-sm text-[#1A1410]">
                      {member.username}
                    </span>
                    <div className="flex gap-2 shrink-0">
                      <button
                        type="button"
                        disabled={memberActionLoading === member.id}
                        onClick={() =>
                          handleMemberAction(member.id, "approved")
                        }
                        className="text-xs px-3 py-1 rounded border-0 text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
                        style={{ backgroundColor: "rgb(107, 123, 92)" }}
                      >
                        {memberActionLoading === member.id ? "..." : "accept"}
                      </button>
                      <button
                        type="button"
                        disabled={memberActionLoading === member.id}
                        onClick={() =>
                          handleMemberAction(member.id, "rejected")
                        }
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
          </ScrollReveal>
        )}

        {isOwner && (
          <ScrollReveal as="div">
            <BookSearchSection
              isOwner={isOwner}
              clubBooks={books}
              onAddBook={handleAddBook}
              token={auth?.token ?? null}
            />
          </ScrollReveal>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-[auto_auto] gap-6">
          {/* About */}
          <ScrollReveal
            as="section"
            className="order-1 lg:col-span-2 rounded-2xl bg-white p-6 sm:p-8 shadow-sm"
            style={{ boxShadow: "rgba(26, 20, 16, 0.06) 0px 4px 20px" }}
          >
            <h2
              className="text-sm font-semibold uppercase tracking-wider m-0 mb-4"
              style={{ color: "#1A1410", letterSpacing: "0.5px" }}
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
                    className="text-sm m-0 mt-1 line-clamp-2"
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
                </div>
              </div>
            </div>
            {!isOwner && !auth?.token && !club.membership_status && (
              <div className="mt-4 w-full font-source-sans text-left">
                <div className="flex flex-col w-full" style={{ gap: 16 }}>
                  {!club.is_public && (
                    <p
                      className="m-0 px-3 py-2.5 rounded-lg"
                      style={{
                        fontSize: 13,
                        color: MUTED_COLOR,
                        backgroundColor: "#FAF6F1",
                        border: "1.5px solid #E8E0D8",
                      }}
                    >
                      This is a private club. Your request will be reviewed by
                      the owner before you can join.
                    </p>
                  )}
                  <Link
                    to="/register"
                    className="block w-full rounded-lg text-white font-semibold text-center cursor-pointer transition hover:opacity-90 no-underline"
                    style={{
                      padding: 12,
                      borderRadius: 8,
                      backgroundColor: ACCENT,
                      fontSize: 15,
                      marginTop: 8,
                    }}
                  >
                    {!club.is_public ? "Request to join" : "Join club"}
                  </Link>
                </div>
              </div>
            )}
            {!isOwner && auth?.token && !club.membership_status && (
              <div className="mt-4">
                <JoinClubForm
                  clubId={clubId}
                  isPrivate={!club.is_public}
                  onSuccess={() =>
                    setTimeout(() => window.location.reload(), 1500)
                  }
                />
              </div>
            )}
            {!isOwner &&
              auth?.token &&
              club.membership_status === "pending" && (
                <div
                  className="mt-4 px-3 py-2.5 rounded-lg text-sm"
                  style={{
                    backgroundColor: "#fdf6ec",
                    border: "1.5px solid #f0d9b5",
                    color: "#8a6a3a",
                  }}
                >
                  Your request is pending approval from the owner.
                </div>
              )}
          </ScrollReveal>

          {/* Currently Reading — centred on mobile, left-aligned from lg (sidebar) */}
          <ScrollReveal
            as="section"
            className="order-2 lg:col-span-1 lg:col-start-3 lg:row-start-1 lg:row-span-2 rounded-2xl bg-white p-10 shadow-sm text-center lg:text-left"
            style={{ boxShadow: "rgba(26, 20, 16, 0.06) 0px 4px 20px" }}
          >
            <h2
              className="text-sm font-semibold uppercase tracking-wider m-0 mb-4"
              style={{ color: "#1A1410", letterSpacing: "0.5px" }}
            >
              Currently Reading
            </h2>
            {currentBook ? (
              <div className="space-y-6">
                {currentBook.cover_image ? (
                  <img
                    src={currentBook.cover_image}
                    alt={currentBook.title}
                    className="w-full max-w-[260px] mx-auto h-auto object-cover rounded-lg block cursor-pointer hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#1A1410]/20"
                    role="button"
                    tabIndex={0}
                    aria-label={`View details for ${currentBook.title}`}
                    onClick={() => openHistoricBookModal(currentBook)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        openHistoricBookModal(currentBook);
                      }
                    }}
                  />
                ) : (
                  <div
                    className="w-full max-w-[260px] mx-auto rounded-lg overflow-hidden flex items-end justify-center text-white text-center lg:text-left lg:justify-start p-3 cursor-pointer hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#1A1410]/20"
                    style={{
                      minHeight: 280,
                      background:
                        "linear-gradient(145deg, #2c3e50 0%, #3498db 100%)",
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`View details for ${currentBook.title}`}
                    onClick={() => openHistoricBookModal(currentBook)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        openHistoricBookModal(currentBook);
                      }
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

                <div className="min-w-0">
                  <h3 className="font-playfair font-bold text-xl text-[#1A1410] m-0 leading-tight">
                    {currentBook.title}
                  </h3>
                  {currentBook.author && (
                    <p
                      className="text-sm font-semibold m-0 mt-2"
                      style={{ color: BRAND_GREEN }}
                    >
                      {currentBook.author}
                    </p>
                  )}
                  {currentBook.genre && (
                    <span
                      className="inline-block px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wide bg-white border border-solid mt-2"
                      style={{ borderColor: BRAND_GREEN, color: BRAND_GREEN }}
                    >
                      {String(currentBook.genre).toUpperCase()}
                    </span>
                  )}

                  {currentBook.description && (
                    <p
                      className="text-sm m-0 mt-4 leading-relaxed line-clamp-4"
                      style={{ color: MUTED_COLOR }}
                    >
                      {currentBook.description}
                    </p>
                  )}

                  <div className={currentBook.description ? "mt-6" : "mt-4"}>
                    <div
                      className="text-[10px] font-semibold uppercase tracking-wider m-0 mb-1"
                      style={{ color: MUTED_COLOR }}
                    >
                      Added
                    </div>
                    <p className="text-sm font-medium text-[#1A1410] m-0">
                      {currentBook.added_at
                        ? formatBookDate(currentBook.added_at)
                        : "—"}
                    </p>
                  </div>

                  {(currentBook.start_date || currentBook.finish_date) && (
                    <p
                      className="text-xs m-0 mt-2"
                      style={{ color: MUTED_COLOR }}
                    >
                      {[
                        currentBook.start_date &&
                          `Started ${formatBookDate(currentBook.start_date)}`,
                        currentBook.finish_date &&
                          `Finished ${formatBookDate(currentBook.finish_date)}`,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  )}

                  {isOwner && (
                    <button
                      type="button"
                      onClick={() => handleMarkAsRead(currentBook)}
                      disabled={isMarkingRead || isSettingReading}
                      className="mt-6 w-full flex items-center justify-center gap-2 rounded-lg border-0 py-3 px-4 text-sm font-semibold text-white cursor-pointer transition hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{ backgroundColor: ACCENT }}
                    >
                      {isMarkingRead ? "Updating…" : "Mark as read"}
                      {!isMarkingRead && (
                        <svg
                          className="shrink-0"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden
                        >
                          <path d="M7 17L17 7M17 7H9M17 7V15" />
                        </svg>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm m-0" style={{ color: MUTED_COLOR }}>
                No book is currently set as reading. Add one and move it to
                Reading.
              </p>
            )}
          </ScrollReveal>

          {/* Members + Meetings */}
          <div className="order-3 lg:col-span-2 lg:row-start-2 flex flex-col space-y-6">
            {isOwner && (
              <ScrollReveal
                as="section"
                className="rounded-2xl bg-white p-6 sm:p-8 shadow-sm"
                style={{ boxShadow: "rgba(26, 20, 16, 0.06) 0px 4px 20px" }}
              >
                <h2
                  className="text-sm font-semibold uppercase tracking-wider m-0 mb-4"
                  style={{ color: "#1A1410", letterSpacing: "0.5px" }}
                >
                  Members ({displayMemberCount})
                </h2>
                <ul className="list-none p-0 m-0 flex flex-col gap-3">
                  {memberList.slice(0, 4).map((member, index) => (
                    <li key={member.id} className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-semibold shrink-0"
                        style={{
                          backgroundColor:
                            memberAvatarColors[
                              index % memberAvatarColors.length
                            ],
                        }}
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
              </ScrollReveal>
            )}

            {/* ✅ Meetings — view/edit/delete for owner, view/book for members */}
            <ScrollReveal
              as="section"
              className={
                restrictMemberSections
                  ? "rounded-2xl bg-white p-4 sm:p-5 shadow-sm flex-1 min-h-0"
                  : "rounded-2xl bg-white p-6 sm:p-8 shadow-sm flex-1 min-h-0"
              }
              style={{ boxShadow: "rgba(26, 20, 16, 0.06) 0px 4px 20px" }}
            >
              <div
                className={`flex items-center justify-between ${restrictMemberSections ? "mb-4" : "mb-10"}`}
              >
                <h2
                  className="text-sm font-semibold uppercase tracking-wider m-0"
                  style={{ color: "#1A1410", letterSpacing: "0.5px" }}
                >
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
                      <path
                        d="M6 1v10M1 6h10"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                      />
                    </svg>
                    Schedule
                  </button>
                )}
              </div>

              {restrictMemberSections ? (
                <ClubMemberContentPlaceholder />
              ) : meetings.length === 0 ? (
                <p className="text-sm m-0" style={{ color: MUTED_COLOR }}>
                  No meetings scheduled yet.
                </p>
              ) : (
                <div className="divide-y divide-stone-200/80">
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
                      <div
                        key={meeting.id}
                        className="flex items-start justify-between gap-3 text-sm py-4 first:pt-0"
                      >
                        <div className="min-w-0 flex-1">
                          {/* ✅ Click title to view details */}
                          <button
                            type="button"
                            onClick={() => setViewingMeeting(meeting)}
                            className="m-0 font-medium text-[#1A1410] text-left hover:underline text-sm"
                          >
                            {meeting.title}
                          </button>
                          <p
                            className="m-0 text-xs"
                            style={{ color: MUTED_COLOR }}
                          >
                            {formatMeetingDate(meeting.meeting_date)}
                            {meeting.start_time &&
                              ` · ${meeting.start_time.slice(0, 5)}`}
                            {meeting.meeting_type === "virtual"
                              ? " · Virtual"
                              : " · In person"}
                          </p>
                          {bookingError && (
                            <p className="m-0 mt-1 text-xs text-red-600">
                              {bookingError}
                            </p>
                          )}
                        </div>

                        {/* ✅ Owner: edit + delete buttons */}
                        {isOwner ? (
                          <div className="flex gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => setEditingMeeting(meeting)}
                              className="text-xs px-2.5 py-1 rounded border border-gray-200 hover:bg-gray-50 transition-colors"
                              style={{ color: MUTED_COLOR }}
                            >
                              edit
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingMeeting(meeting)}
                              className="text-xs px-2.5 py-1 rounded border-0 text-white hover:opacity-90 transition-opacity"
                              style={{ backgroundColor: "rgb(196, 93, 62)" }}
                            >
                              delete
                            </button>
                          </div>
                        ) : (
                          /* ✅ Members: book button */
                          <button
                            type="button"
                            disabled={isBooked || isBooking}
                            onClick={() => handleBookMeeting(meeting.id)}
                            className="text-xs px-3 py-1 rounded shrink-0 transition-colors disabled:cursor-not-allowed"
                            style={{
                              border: isBooked ? "none" : "1px solid #e5e7eb",
                              backgroundColor: isBooked
                                ? "rgb(107, 123, 92)"
                                : "transparent",
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
            </ScrollReveal>
          </div>
        </div>

        {/* Historic reading */}
        <div className="flex flex-col gap-6">
          <ScrollReveal
            as="section"
            className="order-2 rounded-2xl bg-white p-6 sm:p-8 shadow-sm"
            style={{ boxShadow: "rgba(26, 20, 16, 0.06) 0px 4px 20px" }}
          >
            <h2
              className="text-sm font-semibold uppercase tracking-wider m-0 mb-4"
              style={{ color: "#1A1410", letterSpacing: "0.5px" }}
            >
              Historic reading
            </h2>
            {readBooks.length === 0 ? (
              <p className="text-sm m-0" style={{ color: MUTED_COLOR }}>
                No finished books yet.
              </p>
            ) : (
              <div className="flex flex-wrap items-start gap-4">
                {readBooks.map((book) => {
                  const finishedDate = formatBookDate(
                    book.read_at ?? book.added_at,
                  );
                  const ariaHistoric = finishedDate
                    ? `View details for ${book.title}, completed ${finishedDate}`
                    : `View details for ${book.title}`;
                  return (
                    <div
                      key={book.id}
                      className="flex flex-col items-center gap-1.5 shrink-0 w-24 cursor-pointer hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#1A1410]/20 rounded-md"
                      title={[book.title, book.author]
                        .filter(Boolean)
                        .join(" · ")}
                      role="button"
                      tabIndex={0}
                      aria-label={ariaHistoric}
                      onClick={() => openHistoricBookModal(book)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          openHistoricBookModal(book);
                        }
                      }}
                    >
                      <div className="w-full h-32 rounded-md overflow-hidden bg-gray-100">
                        {book.cover_image ? (
                          <img
                            src={book.cover_image}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-end p-2 text-white text-[11px] leading-tight"
                            style={{
                              background:
                                "linear-gradient(145deg, #2c3e50 0%, #3498db 100%)",
                            }}
                          >
                            <span className="line-clamp-2">{book.title}</span>
                          </div>
                        )}
                      </div>
                      {finishedDate ? (
                        <p
                          className="text-xs text-center m-0 max-w-full leading-tight px-0.5"
                          style={{ color: MUTED_COLOR }}
                        >
                          completed
                          <br />
                          {finishedDate}
                        </p>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollReveal>

          <BookDetailsModal
            book={selectedHistoricBook}
            isOpen={showHistoricBookModal}
            onClose={closeHistoricBookModal}
            showActions={false}
          />

          {/* To Read */}
          <ScrollReveal
            as="section"
            className="order-1 rounded-2xl bg-white p-6 sm:p-8 shadow-sm"
            style={{ boxShadow: "rgba(26, 20, 16, 0.06) 0px 4px 20px" }}
          >
            <div className="flex items-center justify-between gap-3 mb-4">
              <h2
                className="text-sm font-semibold uppercase tracking-wider m-0"
                style={{ color: "#1A1410", letterSpacing: "0.5px" }}
              >
                To Read
              </h2>
              {toReadBooks.length > 0 && (
                <span
                  className="text-xs px-2 py-0.5 rounded-full border border-gray-200"
                  style={{ color: MUTED_COLOR }}
                >
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
                      <img
                        src={book.cover_image}
                        alt={book.title}
                        className="w-16 h-24 rounded-md object-cover shrink-0"
                      />
                    ) : (
                      <div
                        className="w-16 h-24 rounded-md shrink-0 flex items-center justify-center text-xs text-white"
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
                      {book.author && (
                        <p
                          className="text-xs m-0 mt-1 truncate"
                          style={{ color: MUTED_COLOR }}
                        >
                          {book.author}
                        </p>
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
          </ScrollReveal>

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

        <ScrollReveal as="div" className="space-y-8">
          <ClubAnnouncmentBoard
            clubId={clubId}
            isOwner={isOwner}
            token={auth?.token ?? null}
            restricted={restrictMemberSections}
          />
        </ScrollReveal>
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
