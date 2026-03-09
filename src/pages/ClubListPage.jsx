/**
 * Club list page: shows all book clubs the user can see (public + owned/member when logged in).
 * Rendered at route /clubs.
 */
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/use-auth";
import getClubs from "../api/get-clubs";
import BookClubCard from "../components/4.clubs/BookClubCard";

function ClubListPage() {
  const { auth } = useAuth();

  // List of club objects from the API; empty until fetch completes
  const [clubs, setClubs] = useState([]);
  // True while the initial GET request is in progress
  const [loading, setLoading] = useState(true);
  // Error message string if the fetch failed; null when no error
  const [error, setError] = useState(null);

  // Fetch clubs on mount and whenever auth token changes (e.g. user logs in/out)
  useEffect(() => {
    setError(null);
    getClubs(auth?.token ?? null)
      .then((data) => setClubs(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message || "Failed to load clubs"))
      .finally(() => setLoading(false));
  }, [auth?.token]);

  // Show loading state until first response
  if (loading) {
    return (
      <div className="text-center py-12 text-gray-500">
        Loading clubs…
      </div>
    );
  }

  // Show error message if the API request failed
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  // Main content: empty state or list of BookClubCards
  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-gray-700 mb-6">
        Book clubs
      </h1>
      {clubs.length === 0 ? (
        <p className="text-gray-500">No clubs yet. Create one to get started.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {clubs.map((club) => (
            <li key={club.id}>
              <BookClubCard club={club} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ClubListPage;
