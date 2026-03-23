import { useState, useEffect, useCallback } from "react";
import getClubAnnouncements from "../../api/get-club-announcements";
import postClubAnnouncement from "../../api/post-club-announcement";
import patchClubAnnouncement from "../../api/patch-club-announcement";
import ClubMemberContentPlaceholder from "./ClubMemberContentPlaceholder.jsx";

const MUTED_COLOR = "#8A7E74";
const BORDER_GREEN = "#6b7b5c"; // site green used on ClubPage (current book card, avatars)

function formatSentAt(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function ClubAnnouncmentBoard({ clubId, isOwner, token, restricted = false }) {
  const [announcements, setAnnouncements] = useState([]);
  const [visibleCount, setVisibleCount] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftMessage, setDraftMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const refetch = useCallback(async () => {
    if (!clubId) return;
    setIsLoading(true);
    setError("");
    try {
      const list = await getClubAnnouncements(clubId, token ?? null);
      setAnnouncements(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err.message ?? "Could not load announcements.");
    } finally {
      setIsLoading(false);
    }
  }, [clubId, token]);

  useEffect(() => {
    if (restricted) return;
    refetch();
  }, [refetch, restricted]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!token || !isOwner) return;
    const trimmedTitle = title.trim();
    const trimmedMessage = message.trim();
    if (!trimmedTitle && !trimmedMessage) return;

    setIsSubmitting(true);
    setSubmitError("");
    try {
      await postClubAnnouncement(
        clubId,
        { title: trimmedTitle || "Announcement", message: trimmedMessage },
        token
      );
      setTitle("");
      setMessage("");
      await refetch();
    } catch (err) {
      setSubmitError(err.message ?? "Failed to post announcement.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function startEditing(ann) {
    if (!isOwner) return;
    setSaveError("");
    setEditingId(ann?.id ?? null);
    setDraftTitle((ann?.title ?? "").toString());
    setDraftMessage((ann?.message ?? "").toString());
  }

  function cancelEditing() {
    setEditingId(null);
    setDraftTitle("");
    setDraftMessage("");
    setSaveError("");
    setIsSaving(false);
  }

  async function saveEditing(announcementId) {
    if (!token || !isOwner) return;
    const trimmedTitle = draftTitle.trim();
    const trimmedMessage = draftMessage.trim();
    if (!trimmedTitle && !trimmedMessage) return;

    setIsSaving(true);
    setSaveError("");
    try {
      await patchClubAnnouncement(
        clubId,
        announcementId,
        { title: trimmedTitle, message: trimmedMessage },
        token,
      );
      await refetch();
      cancelEditing();
    } catch (err) {
      setSaveError(err.message ?? "Failed to update announcement.");
    } finally {
      setIsSaving(false);
    }
  }

  if (restricted) {
    return (
      <section
        className="rounded-2xl bg-white p-4 sm:p-5 shadow-sm"
        style={{ boxShadow: "rgba(26, 20, 16, 0.06) 0px 4px 20px" }}
      >
        <h2
          className="text-sm font-semibold uppercase tracking-wider m-0 mb-2"
          style={{ color: "#1A1410", letterSpacing: "0.5px" }}
        >
          Announcement&apos;s board
        </h2>
        <ClubMemberContentPlaceholder />
      </section>
    );
  }

  return (
    <section
      className="rounded-2xl bg-white p-10 shadow-sm"
      style={{ boxShadow: "rgba(26, 20, 16, 0.06) 0px 4px 20px" }}
    >
      <h2
        className="text-sm font-semibold uppercase tracking-wider m-0 mb-4"
        style={{ color: "#1A1410", letterSpacing: "0.5px" }}
      >
        Announcement&apos;s board
      </h2>

      {isOwner && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-3">
          <div>
            <label htmlFor="announcement-title" className="block text-xs font-medium mb-1" style={{ color: MUTED_COLOR }}>
              Title (optional)
            </label>
            <input
              id="announcement-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Next meeting"
              className="w-full text-sm px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-200"
              maxLength={255}
            />
          </div>
          <div>
            <label htmlFor="announcement-message" className="block text-xs font-medium mb-1" style={{ color: MUTED_COLOR }}>
              Message
            </label>
            <textarea
              id="announcement-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your announcement..."
              rows={3}
              className="w-full text-sm px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-200 resize-y"
              required
            />
          </div>
          {submitError && (
            <p className="text-sm text-red-600 m-0">{submitError}</p>
          )}
          <button
            type="submit"
            disabled={isSubmitting || !message.trim()}
            className="text-sm font-semibold px-4 py-2 rounded bg-[#C45D3E] text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Posting…" : "Post announcement"}
          </button>
        </form>
      )}

      {error && (
        <p className="text-sm m-0 mb-4" style={{ color: "#b91c1c" }}>
          {error}
        </p>
      )}

      {isLoading ? (
        <p className="text-sm m-0" style={{ color: MUTED_COLOR }}>
          Loading announcements…
        </p>
      ) : announcements.length === 0 ? (
        <p className="text-sm m-0" style={{ color: MUTED_COLOR }}>
          No announcements yet.{" "}
          {isOwner
            ? "Use the form above to post one."
            : "The organiser can post updates here."}
        </p>
      ) : (() => {
        const sorted = [...announcements].sort(
          (a, b) => new Date(b.sent_at) - new Date(a.sent_at)
        );
        const visible = sorted.slice(0, visibleCount);
        const hasMore = visibleCount < sorted.length;
        return (
          <>
            <ul className="list-none p-0 m-0 space-y-4">
              {visible.map((ann) => (
                <li
                  key={ann.id}
                  className="rounded-xl p-8"
                  style={{
                    border: `2px solid ${BORDER_GREEN}`,
                    backgroundColor: "rgba(107, 123, 92, 0.06)",
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-xs m-0 mb-1" style={{ color: MUTED_COLOR }}>
                      {formatSentAt(ann.sent_at)}
                    </p>
                    {isOwner && (
                      <button
                        type="button"
                        onClick={() => startEditing(ann)}
                        disabled={isSaving || (editingId !== null && editingId !== ann.id)}
                        className="text-xs font-semibold px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ color: MUTED_COLOR }}
                      >
                        Edit
                      </button>
                    )}
                  </div>

                  {editingId === ann.id ? (
                    <div className="mt-3 space-y-3">
                      <div>
                        <label
                          htmlFor={`edit-announcement-title-${ann.id}`}
                          className="block text-xs font-medium mb-1"
                          style={{ color: MUTED_COLOR }}
                        >
                          Title (optional)
                        </label>
                        <input
                          id={`edit-announcement-title-${ann.id}`}
                          type="text"
                          value={draftTitle}
                          onChange={(e) => setDraftTitle(e.target.value)}
                          placeholder="e.g. Next meeting"
                          className="w-full text-sm px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-200"
                          maxLength={255}
                          disabled={isSaving}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor={`edit-announcement-message-${ann.id}`}
                          className="block text-xs font-medium mb-1"
                          style={{ color: MUTED_COLOR }}
                        >
                          Message
                        </label>
                        <textarea
                          id={`edit-announcement-message-${ann.id}`}
                          value={draftMessage}
                          onChange={(e) => setDraftMessage(e.target.value)}
                          placeholder="Write your announcement..."
                          rows={3}
                          className="w-full text-sm px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-200 resize-y"
                          required
                          disabled={isSaving}
                        />
                      </div>

                      {saveError && (
                        <p className="text-sm text-red-600 m-0">{saveError}</p>
                      )}

                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => saveEditing(ann.id)}
                          disabled={
                            isSaving ||
                            (!draftTitle.trim() && !draftMessage.trim())
                          }
                          className="text-sm font-semibold px-4 py-2 rounded bg-[#C45D3E] text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSaving ? "Saving…" : "Save"}
                        </button>
                        <button
                          type="button"
                          onClick={cancelEditing}
                          disabled={isSaving}
                          className="text-sm font-semibold px-4 py-2 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ color: MUTED_COLOR }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {ann.title ? (
                        <h3
                          className="text-sm font-semibold m-0 mb-1"
                          style={{ color: BORDER_GREEN }}
                        >
                          {ann.title}
                        </h3>
                      ) : null}
                      <p className="text-sm m-0 whitespace-pre-wrap">
                        {ann.message}
                      </p>
                    </>
                  )}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              {visibleCount > 1 && (
                <button
                  type="button"
                  onClick={() => setVisibleCount(1)}
                  className="text-sm font-semibold px-3 py-2 rounded border border-gray-300 hover:bg-gray-50"
                  style={{ color: MUTED_COLOR }}
                >
                  Hide announcements
                </button>
              )}
              {hasMore && (
                <button
                  type="button"
                  onClick={() => setVisibleCount((c) => c + 2)}
                  className="text-sm font-semibold px-3 py-2 rounded border border-gray-300 hover:bg-gray-50"
                  style={{ color: MUTED_COLOR }}
                >
                  Show more announcements
                </button>
              )}
            </div>
          </>
        );
      })()}
    </section>
  );
}

export default ClubAnnouncmentBoard;
