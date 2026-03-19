import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";
import { getFirstNameFromProfile } from "../utils/get-first-name";
import getCurrentUser from "../api/get-current-user.js";
import patchCurrentUser from "../api/patch-current-user.js";
import getClubs from "../api/get-clubs.js";
import getMyClubs from "../api/get-my-clubs.js";
import BookClubCard from "../components/clubs/BookClubCard.jsx";
import ProfileStats from "../components/ProfileStats.jsx";

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
  const [isEditing, setIsEditing] = useState(false);
  const [editProfilePicture, setEditProfilePicture] = useState("");
  const [editBio, setEditBio] = useState("");
  const [saveError, setSaveError] = useState(null);
  const [saving, setSaving] = useState(false);

  const isLoggedIn = Boolean(auth?.token && auth?.username);

  function startEditing() {
    // Pre-fill with current profile so the user can tweak rather than re-type
    setEditProfilePicture(profile?.profile_picture ?? "");
    setEditBio(profile?.bio ?? "");
    setSaveError(null);
    setIsEditing(true);
  }

  function cancelEditing() {
    setIsEditing(false);
    setSaveError(null);
  }

  async function handleSaveProfile(e) {
    e.preventDefault();
    setSaveError(null);
    setSaving(true);
    try {
      const updated = await patchCurrentUser(auth.token, {
        profile_picture: editProfilePicture.trim() || undefined,
        bio: editBio.trim() || undefined,
      });
      setProfile(updated);
      setIsEditing(false);
    } catch (err) {
      setSaveError(err.message ?? "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    async function load() {
      try {
        const [profileData, clubsData, myClubsData] = await Promise.all([
          getCurrentUser(auth.token),
          getClubs(auth.token),
          getMyClubs(auth.token),
        ]);
        if (!cancelled) {
          setProfile(profileData);
          setClubs(Array.isArray(clubsData) ? clubsData : []);
          setMyClubs(Array.isArray(myClubsData) ? myClubsData : []);
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

  const userId = profile?.id;
  const clubsOwned = userId != null ? myClubs : [];
  const clubsMemberOf =
    userId != null ? clubs.filter((c) => c.owner !== userId && c.membership_status === "approved") : [];

  const joinedFormatted = profile?.date_joined
    ? new Date(profile.date_joined).toLocaleDateString(undefined, {
        month: "short",
        year: "numeric",
      })
    : null;

  const displayName =
    getFirstNameFromProfile(profile) ??
    profile?.username ??
    "User";
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

        {/* Profile card full width; stats row below */}
        <div className="space-y-6">
          {/* Primary profile card: full row; left half = image, right half = content */}
          <section
            className="w-full rounded-2xl overflow-hidden flex flex-col sm:flex-row min-h-[280px] sm:min-h-[320px]"
            style={{
              backgroundColor: CARD_BG,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="w-full flex-1 flex flex-col p-6 sm:p-8 space-y-5">
                <div>
                  <label
                    htmlFor="profile_picture"
                    className="block text-sm font-medium mb-1.5"
                    style={{ color: TITLE_COLOR }}
                  >
                    Profile picture URL
                  </label>
                  <input
                    id="profile_picture"
                    type="url"
                    value={editProfilePicture}
                    onChange={(e) => setEditProfilePicture(e.target.value)}
                    placeholder="https://..."
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#e07a5f] focus:outline-none focus:ring-1 focus:ring-[#e07a5f]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="profile_bio"
                    className="block text-sm font-medium mb-1.5"
                    style={{ color: TITLE_COLOR }}
                  >
                    Bio
                  </label>
                  <textarea
                    id="profile_bio"
                    rows={4}
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    placeholder="Tell us a bit about yourself here..."
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#e07a5f] focus:outline-none focus:ring-1 focus:ring-[#e07a5f] resize-y"
                  />
                </div>
                {saveError && (
                  <p className="text-sm text-red-600">{saveError}</p>
                )}
                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 rounded-lg font-semibold text-white bg-[#e07a5f] hover:opacity-90 transition-opacity disabled:opacity-60"
                  >
                    {saving ? "Saving…" : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={cancelEditing}
                    disabled={saving}
                    className="px-4 py-2 rounded-lg font-semibold border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-60"
                    style={{ color: TITLE_COLOR }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                {/* Left half: profile image fills half the tile */}
                <div className="w-full sm:w-1/2 min-h-[180px] sm:min-h-0 sm:h-auto flex-shrink-0 relative bg-gray-100 rounded-t-2xl sm:rounded-t-none sm:rounded-l-2xl overflow-hidden">
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
                {/* Right half: name, email, bio */}
                <div className="w-full sm:w-1/2 min-w-0 flex flex-col justify-center p-6 sm:p-8 text-center sm:text-left">
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
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={startEditing}
                      className="text-sm font-semibold text-[#e07a5f] hover:underline"
                    >
                      Edit profile
                    </button>
                  </div>
                </div>
              </>
            )}
          </section>

          {/* Stats: row of three cards below profile */}
          <ProfileStats
            clubsCount={clubs.length}
            upcomingMeetingsCount={0}
            booksReadCount={0}
            cardBg={CARD_BG}
            statNumberColor={STAT_NUMBER}
            descriptionColor={DESCRIPTION_COLOR}
          />
        </div>

        {/* Book clubs: two sections side by side on lg, each with a grid of compact cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Book clubs you are a member of */}
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
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                {clubsMemberOf.map((club) => (
                  <Link
                    key={club.id}
                    to={`/clubs/${club.id}`}
                    className="block"
                  >
                    <BookClubCard club={club} compact />
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Book clubs you own */}
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
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                {clubsOwned.map((club) => (
                  <Link
                    key={club.id}
                    to={`/clubs/${club.id}`}
                    className="block"
                  >
                    <BookClubCard club={club} compact />
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
