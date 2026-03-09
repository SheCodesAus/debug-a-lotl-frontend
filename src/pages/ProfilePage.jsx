import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";
import getCurrentUser from "../api/get-current-user.js";

function ProfilePage() {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [profile, setProfile] = useState(null);
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
        const data = await getCurrentUser(auth.token);
        if (!cancelled) {
          setProfile(data);
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
      <div className="w-full">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="rounded-3xl p-8 sm:p-10 font-nunito text-center space-y-5">
            <h1 className="text-3xl sm:text-4xl font-lora text-[#3f2a28] leading-snug">
              Profile
            </h1>
            <p className="text-base text-[#8c6b5c]">
              You need to be logged in to view your profile.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full font-semibold text-white bg-[#e07a5f] hover:bg-[#cc664b] shadow-sm transition-colors"
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
      <div className="w-full">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="rounded-3xl border border-[#f0dac8] shadow-[0_18px_40px_rgba(60,32,20,0.12)] p-9 sm:p-10 font-nunito text-center space-y-4">
            <div className="inline-block h-9 w-9 animate-spin rounded-full border-2 border-[#f0dac8] border-t-[#e07a5f]" />
            <p className="text-base text-[#8c6b5c]">Loading your profile…</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="rounded-3xl border border-red-200/80 shadow-[0_18px_40px_rgba(60,32,20,0.12)] p-8 sm:p-10 font-nunito text-center space-y-5">
            <h1 className="text-3xl sm:text-4xl font-lora text-[#3f2a28] leading-snug">
              Profile
            </h1>
            <p className="text-base text-red-600">{error}</p>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-5 py-2.5 rounded-full font-semibold text-[#3f2a28] border border-[#f0dac8] bg-[#fffaf6] hover:bg-[#f7e6d7] transition-colors"
            >
              Back to home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const joinedDate = profile?.date_joined
    ? new Date(profile.date_joined).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="w-full">
      <div className="max-w-2xl mx-auto px-5 py-10 sm:px-10 sm:py-16 space-y-8 font-nunito">
        {/* Top section: avatar + greeting (mobile-first) */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start sm:justify-between gap-6">
            {/* Avatar: on top for mobile, to the right on desktop */}
            <div className="order-1 sm:order-2 self-center sm:self-auto">
              {profile?.profile_picture ? (
                <img
                  src={profile.profile_picture}
                  alt=""
                  className="w-32 h-32 sm:w-36 sm:h-36 rounded-full object-cover border-2 border-[#f0dac8] shrink-0"
                />
              ) : (
                <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-[#f3dfcf] flex items-center justify-center text-[#8c6b5c] text-4xl sm:text-5xl font-semibold shrink-0">
                  {profile?.username?.charAt(0)?.toUpperCase() ?? "?"}
                </div>
              )}
            </div>

            {/* Greeting + metadata */}
            <div className="order-2 sm:order-1 text-center sm:text-left">
              <p className="text-5xl sm:text-6xl font-lora text-[#111111] leading-tight">
                Hello,
              </p>
              <p className="text-5xl sm:text-6xl font-lora text-[#e07a5f] leading-tight">
                {profile?.username}
              </p>
              {profile?.email && (
                <p className="text-lg text-[#8c6b5c] truncate">
                  {profile.email}
                </p>
              )}
              {joinedDate && (
                <p className="text-base text-[#b18973]">
                  Member since {joinedDate}
                </p>
              )}
            </div>
          </div>

          {profile?.bio && (
            <p className="text-lg leading-relaxed text-[#4f342f] whitespace-pre-wrap w-full">
              {profile.bio}
            </p>
          )}
        </section>

        {/* Second section: white card on beige background for book clubs (mobile-friendly) */}
        <section className="mt-10 rounded-3xl bg-white shadow-[0_18px_40px_rgba(60,32,20,0.18)] p-6 sm:p-8 space-y-3">
          <h2 className="text-xl font-lora text-[#3f2a28] leading-snug">
            Your book clubs
          </h2>
          <p className="text-base text-[#8c6b5c]">
            You&apos;ll be able to see your book clubs here soon.
          </p>
        </section>
      </div>
    </div>
  );
}

export default ProfilePage;
