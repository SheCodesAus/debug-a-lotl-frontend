import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";
import { getFirstNameFromProfile } from "../utils/get-first-name";
import getCurrentUser from "../api/get-current-user.js";
import getClubs from "../api/get-clubs.js";
import getMyClubs from "../api/get-my-clubs.js";
import getMyBookedMeetings from "../api/get-my-booked-meetings.js";
import BookClubCard from "../components/clubs/BookClubCard.jsx";
import ProfileStats from "../components/ProfileStats.jsx";
import useClubsCurrentBooks from "../hooks/use-clubs-current-books.js";
import { formatMeetingDate } from "../utils/format-meeting-date.js";
import EditProfileModal from "../components/modals/EditProfileModal.jsx";

const PAGE_BG = "#F8F6F1";
const CARD_BG = "#FFFFFF";
const AVATAR_BG = "#e07a5f";
const STAT_NUMBER = "#e07a5f";
const TITLE_COLOR = "#333333";
const EMAIL_JOIN_COLOR = "#666666";
const DESCRIPTION_COLOR = "#777777";

function ProfilePage() {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [profile, setProfile] = useState(null);
  const [clubs, setClubs] = useState([]);
  const [myClubs, setMyClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [bookedMeetings, setBookedMeetings] = useState([]);

  const isLoggedIn = Boolean(auth?.token && auth?.username);

  const userId = profile?.id;
  const clubsMemberOf =
    userId != null
      ? clubs.filter(
          (c) => c.owner !== userId && c.membership_status === "approved",
        )
      : [];
  const clubsOwned = userId != null ? myClubs : [];
  const { currentBooksByClubId, totalHistoricReadCount } = useClubsCurrentBooks(
    [...clubsMemberOf, ...clubsOwned].map((c) => c?.id),
    auth?.token ?? null,
  );

  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    async function load() {
      try {
        const [profileData, clubsData, myClubsData, bookedData] =
          await Promise.all([
            getCurrentUser(auth.token),
            getClubs(auth.token),
            getMyClubs(auth.token),
            getMyBookedMeetings(auth.token).catch(() => []),
          ]);
        if (!cancelled) {
          setProfile(profileData);
          setClubs(Array.isArray(clubsData) ? clubsData : []);
          setMyClubs(Array.isArray(myClubsData) ? myClubsData : []);
          setBookedMeetings(Array.isArray(bookedData) ? bookedData : []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message ?? "Failed to load profile");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [isLoggedIn, auth?.token]);

  if (!isLoggedIn) {
    return (
      <div
        className="min-h-full font-nunito"
        style={{ backgroundColor: PAGE_BG }}
      >
        <div className="max-w-2xl mx-auto px-4 py-6 sm:px-8">
          <div className="rounded-2xl bg-white shadow-sm p-8 sm:p-10 text-center space-y-5">
            <h1 className="text-3xl sm:text-4xl font-lora text-[#3f2a28]">
              Profile
            </h1>
            <p className="text-base text-[#8c6b5c]">
              You need to be logged in to view your profile.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg font-semibold text-white bg-[#e07a5f] hover:opacity-90 transition-opacity"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        className="min-h-full font-nunito"
        style={{ backgroundColor: PAGE_BG }}
      >
        <div className="max-w-2xl mx-auto px-4 py-6 sm:px-8">
          <div className="rounded-2xl bg-white shadow-sm p-9 sm:p-10 text-center space-y-4">
            <div className="inline-block h-9 w-9 animate-spin rounded-full border-2 border-gray-200 border-t-[#e07a5f]" />
            <p className="text-base text-[#8c6b5c]">Loading your profile…</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-full font-nunito"
        style={{ backgroundColor: PAGE_BG }}
      >
        <div className="max-w-2xl mx-auto px-4 py-6 sm:px-8">
          <div className="rounded-2xl bg-white shadow-sm p-8 sm:p-10 text-center space-y-5">
            <h1 className="text-3xl font-lora text-[#3f2a28]">Profile</h1>
            <p className="text-base text-red-600">{error}</p>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-5 py-2.5 rounded-lg font-semibold text-[#3f2a28] border border-gray-300 bg-white hover:bg-gray-50"
            >
              Back to home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const joinedFormatted = profile?.date_joined
    ? new Date(profile.date_joined).toLocaleDateString(undefined, {
        month: "short",
        year: "numeric",
      })
    : null;

  const displayName =
    getFirstNameFromProfile(profile) ?? profile?.username ?? "User";
  const initials = displayName
    .split(/\s+/)
    .map((w) => w.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className="min-h-full font-nunito"
      style={{ backgroundColor: PAGE_BG }}
    >
      <div className="max-w-6xl w-full mx-auto px-4 py-8 sm:px-6 sm:py-10 space-y-8">
        <h1
          className="text-2xl sm:text-3xl font-lora font-bold"
          style={{ color: TITLE_COLOR }}
        >
          Your Profile
        </h1>

        {/* Profile card, then stats row — visually separate blocks */}
        <div className="space-y-8">
          <section
            className="w-full rounded-2xl overflow-hidden flex flex-col sm:flex-row sm:items-stretch"
            style={{
              backgroundColor: CARD_BG,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            <div className="w-full sm:w-2/5 lg:w-1/3 shrink-0 relative h-40 sm:h-auto sm:min-h-0 sm:self-stretch bg-gray-100 rounded-t-2xl sm:rounded-t-none sm:rounded-l-2xl overflow-hidden">
              {profile?.profile_picture ? (
                <img
                  src={profile.profile_picture}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div
                  className="absolute inset-0 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold uppercase"
                  style={{ backgroundColor: AVATAR_BG }}
                >
                  {initials || "?"}
                </div>
              )}
            </div>
            <div className="w-full sm:flex-1 min-w-0 flex flex-col justify-center p-5 sm:p-6 md:p-8 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3">
                <h2
                  className="font-lora text-2xl sm:text-3xl font-semibold"
                  style={{ color: TITLE_COLOR }}
                >
                  {displayName}
                </h2>
              </div>
              {joinedFormatted && (
                <p
                  className="text-sm sm:text-base mt-2"
                  style={{ color: EMAIL_JOIN_COLOR }}
                >
                  Joined {joinedFormatted}
                </p>
              )}
              {profile?.bio?.trim() ? (
                <p
                  className="text-sm sm:text-base mt-4 leading-relaxed"
                  style={{ color: DESCRIPTION_COLOR }}
                >
                  {profile.bio.trim()}
                </p>
              ) : null}
              <div className="mt-4 flex justify-center sm:justify-start">
                <button
                  type="button"
                  onClick={() => setShowEditModal(true)}
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#e07a5f] hover:opacity-90 transition-opacity"
                >
                  Edit profile
                </button>
              </div>
            </div>
          </section>

          <ProfileStats
            clubsCount={clubs.length}
            upcomingMeetingsCount={bookedMeetings.length}
            booksReadCount={totalHistoricReadCount}
            cardBg={CARD_BG}
            statNumberColor={STAT_NUMBER}
            descriptionColor={DESCRIPTION_COLOR}
          />

          <section
            className="rounded-2xl p-5 sm:p-6 md:p-8"
            style={{
              backgroundColor: CARD_BG,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            <h3
              className="text-xs font-semibold uppercase tracking-wider mb-4"
              style={{ color: DESCRIPTION_COLOR }}
            >
              Upcoming meetings you&apos;ve booked
            </h3>
            {bookedMeetings.length === 0 ? (
              <p className="text-sm m-0" style={{ color: DESCRIPTION_COLOR }}>
                You don&apos;t have any upcoming booked meetings. Visit a club
                you&apos;re a member of to book a slot.
              </p>
            ) : (
              <ul className="space-y-3 list-none m-0 p-0">
                {bookedMeetings.map((meeting) => {
                  const clubId = meeting.club?.id;
                  const clubName = meeting.club?.name ?? "Club";
                  const timePart =
                    meeting.start_time != null &&
                    String(meeting.start_time).length >= 5
                      ? ` · ${String(meeting.start_time).slice(0, 5)}`
                      : "";
                  const meta = `${formatMeetingDate(meeting.meeting_date)}${timePart}${
                    meeting.meeting_type === "virtual"
                      ? " · Virtual"
                      : " · In person"
                  }`;
                  const inner = (
                    <>
                      <p
                        className="m-0 text-sm font-medium"
                        style={{ color: TITLE_COLOR }}
                      >
                        {meeting.title}
                      </p>
                      <p
                        className="m-0 text-xs mt-1"
                        style={{ color: DESCRIPTION_COLOR }}
                      >
                        {clubName}
                        <span className="text-[#606060]"> · {meta}</span>
                      </p>
                    </>
                  );
                  return (
                    <li key={meeting.id}>
                      {clubId != null ? (
                        <Link
                          to={`/clubs/${clubId}`}
                          className="block rounded-xl border border-transparent px-3 py-2 -mx-3 -my-0.5 transition-colors hover:bg-[rgb(247,244,240)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e07a5f]/40"
                        >
                          {inner}
                        </Link>
                      ) : (
                        <div className="px-3 py-2">{inner}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>

        {showEditModal && (
          <EditProfileModal
            profile={profile}
            token={auth?.token ?? null}
            onClose={() => setShowEditModal(false)}
            onSuccess={(updated) => setProfile(updated)}
          />
        )}

        {/* Book clubs: single column — owned first, then memberships */}
        <div className="flex flex-col gap-10">
          <section>
            <h3
              className="text-xs font-semibold uppercase tracking-wider mb-4"
              style={{ color: DESCRIPTION_COLOR }}
            >
              Book clubs you own
            </h3>
            {clubsOwned.length === 0 ? (
              <p className="text-sm" style={{ color: DESCRIPTION_COLOR }}>
                You haven&apos;t created any clubs yet.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {clubsOwned.map((club) => (
                  <Link
                    key={club.id}
                    to={`/clubs/${club.id}`}
                    className="block"
                  >
                    <BookClubCard
                      club={club}
                      compact
                      dense
                      currentBook={currentBooksByClubId?.[club.id] ?? null}
                    />
                  </Link>
                ))}
              </div>
            )}
          </section>

          <section>
            <h3
              className="text-xs font-semibold uppercase tracking-wider mb-4"
              style={{ color: DESCRIPTION_COLOR }}
            >
              Book clubs you are a member of
            </h3>
            {clubsMemberOf.length === 0 ? (
              <p className="text-sm" style={{ color: DESCRIPTION_COLOR }}>
                You&apos;re not a member of any clubs yet. Discover clubs to
                join.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {clubsMemberOf.map((club) => (
                  <Link
                    key={club.id}
                    to={`/clubs/${club.id}`}
                    className="block"
                  >
                    <BookClubCard
                      club={club}
                      compact
                      dense
                      currentBook={currentBooksByClubId?.[club.id] ?? null}
                    />
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
