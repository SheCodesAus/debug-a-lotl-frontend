import { useState, useEffect } from "react";
import { useAuth } from "../hooks/use-auth";
import getClubs from "../api/get-clubs";
import BookClubCard from "../components/4.clubs/BookClubCard";

function ClubListPage() {
  const { auth } = useAuth();
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
    getClubs(auth?.token ?? null)
      .then((data) => setClubs(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message || "Failed to load clubs"))
      .finally(() => setLoading(false));
  }, [auth?.token]);

  if (loading) {
    return (
      <div className="text-center py-12 text-gray-500">
        Loading clubs…
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

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
