import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";
import getCurrentUser from "../api/get-current-user.js";
import getClubs from "../api/get-clubs.js";
import BookClubCard from "../components/clubs/BookClubCard.jsx";

const PAGE_BG = "#F8F6F1";
const CARD_BG = "#FFFFFF";
const AVATAR_BG = "#e07a5f";
const STAT_NUMBER = "#e07a5f";
const TITLE_COLOR = "#333333";
const EMAIL_JOIN_COLOR = "#666666";
const DESCRIPTION_COLOR = "#777777";

const PLACEHOLDER_DESCRIPTION =
  "Sci-fi enthusiast, coffee addict, and recovering procrastinator. Always reading two books at once.";

function ProfilePage() {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [profile, setProfile] = useState(null);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isLoggedIn = Boolean(auth?.token && auth?.username);

  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    async function load() {
      try {
        const [profileData, clubsData] = await Promise.all([
          getCurrentUser(auth.token),
          getClubs(auth.token),
        ]);
        if (!cancelled) {
          setProfile(profileData);
          setClubs(Array.isArray(clubsData) ? clubsData : []);
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
      <div className="min-h-full font-nunito" style={{ backgroundColor: PAGE_BG }}>
        <div className="max-w-2xl mx-auto px-4 py-6 sm:px-8">
          <div className="rounded-2xl bg-white shadow-sm p-8 sm:p-10 text-center space-y-5">
            <h1 className="text-3xl sm:text-4xl font-lora text-[#3f2a28]">Profile</h1>
            <p className="text-base text-[#8c6b5c]">You need to be logged in to view your profile.</p>
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
      <div className="min-h-full font-nunito" style={{ backgroundColor: PAGE_BG }}>
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
      <div className="min-h-full font-nunito" style={{ backgroundColor: PAGE_BG }}>
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
  const clubsOwned = userId != null ? clubs.filter((c) => c.owner === userId) : [];
  const clubsMemberOf = userId != null ? clubs.filter((c) => c.owner !== userId) : [];

  const joinedFormatted = profile?.date_joined
    ? new Date(profile.date_joined).toLocaleDateString(undefined, { month: "short", year: "numeric" })
    : null;

  const displayName = profile?.username ?? "User";
  const initials = displayName
    .split(/\s+/)
    .map((w) => w.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-full font-nunito" style={{ backgroundColor: PAGE_BG }}>
      <div className="max-w-2xl mx-auto px-4 py-8 sm:px-8 sm:py-10 space-y-8">
        <h1 className="text-2xl sm:text-3xl font-lora font-bold" style={{ color: TITLE_COLOR }}>
          Your Profile
        </h1>

        {/* Primary profile card: small avatar top-left, name + text below centre-aligned */}
        <section
          className="rounded-2xl p-10 sm:p-14 flex flex-col sm:flex-row gap-8 sm:gap-12 items-start"
          style={{ backgroundColor: CARD_BG, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
        >
          {profile?.profile_picture ? (
            <img
              src={profile.profile_picture}
              alt=""
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover shrink-0"
            />
          ) : (
            <div
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold uppercase shrink-0"
              style={{ backgroundColor: AVATAR_BG }}
            >
              {initials || "?"}
            </div>
          )}
          <div className="min-w-0 flex-1 text-center py-2">
            <h2 className="font-lora text-2xl sm:text-3xl font-semibold" style={{ color: TITLE_COLOR }}>
              {displayName}
            </h2>
            <p className="text-sm sm:text-base mt-3" style={{ color: EMAIL_JOIN_COLOR }}>
              {profile?.email && <span>{profile.email}</span>}
              {profile?.email && joinedFormatted && " · "}
              {joinedFormatted && <span>Joined {joinedFormatted}</span>}
            </p>
            <p className="text-sm sm:text-base mt-6 leading-relaxed" style={{ color: DESCRIPTION_COLOR }}>
              {profile?.bio?.trim() || PLACEHOLDER_DESCRIPTION}
            </p>
          </div>
        </section>

        {/* Stats: three white rounded cards */}
        <section className="grid grid-cols-3 gap-5 sm:gap-6">
          {[
            { value: clubs.length, label: "Clubs" },
            { value: 0, label: "Books Read" },
            { value: 0, label: "Discussions" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl p-8 sm:p-10 text-center"
              style={{ backgroundColor: CARD_BG, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
            >
              <p className="text-2xl sm:text-3xl font-bold" style={{ color: STAT_NUMBER }}>
                {stat.value}
              </p>
              <p className="text-sm mt-2" style={{ color: DESCRIPTION_COLOR }}>
                {stat.label}
              </p>
            </div>
          ))}
        </section>

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
              You&apos;re not a member of any clubs yet. Discover clubs to join.
            </p>
          ) : (
            <ul className="flex flex-col gap-4">
              {clubsMemberOf.map((club) => (
                <li key={club.id}>
                  <Link to={`/clubs/${club.id}`} className="block">
                    <BookClubCard club={club} />
                  </Link>
                </li>
              ))}
            </ul>
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
            <ul className="flex flex-col gap-4">
              {clubsOwned.map((club) => (
                <li key={club.id}>
                  <Link to={`/clubs/${club.id}`} className="block">
                    <BookClubCard club={club} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

export default ProfilePage;
