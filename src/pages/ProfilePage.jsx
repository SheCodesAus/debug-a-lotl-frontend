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
      <div className="text-center w-full max-w-md mx-auto">
        <h1 className="text-2xl font-semibold text-gray-700 mb-4">
          Profile
        </h1>
        <p className="text-gray-600 mb-4">
          You need to be logged in to view your profile.
        </p>
        <Link
          to="/login"
          className="inline-block px-4 py-2 rounded-md font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          Log in
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center w-full">
        <p className="text-gray-600">Loading your profile…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center w-full max-w-md mx-auto">
        <h1 className="text-2xl font-semibold text-gray-700 mb-4">Profile</h1>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="px-4 py-2 rounded-md font-medium text-blue-600 border border-blue-600 hover:bg-blue-50"
        >
          Back to home
        </button>
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
    <div className="w-full max-w-lg mx-auto text-center">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Your profile</h1>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 flex flex-col items-center gap-4">
        {profile?.profile_picture ? (
          <img
            src={profile.profile_picture}
            alt=""
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-2xl font-medium">
            {profile?.username?.charAt(0)?.toUpperCase() ?? "?"}
          </div>
        )}

        <div className="space-y-1">
          <p className="text-xl font-medium text-gray-900">{profile?.username}</p>
          {profile?.email && (
            <p className="text-gray-600">{profile.email}</p>
          )}
        </div>

        {profile?.bio && (
          <p className="text-gray-700 text-left w-full border-t border-gray-100 pt-4 mt-2">
            {profile.bio}
          </p>
        )}

        {joinedDate && (
          <p className="text-sm text-gray-500">Member since {joinedDate}</p>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
