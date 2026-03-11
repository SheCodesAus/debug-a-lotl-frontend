function BookClubCard({ club }) {
  if (!club) return null;

  return (
    <article className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition">
      <div className="flex gap-4">
        {club.banner_image ? (
          <img
            src={club.banner_image}
            alt=""
            className="w-20 h-20 rounded-lg object-cover shrink-0"
          />
        ) : (
          <div className="w-20 h-20 rounded-lg bg-gray-100 shrink-0 flex items-center justify-center text-gray-400 text-2xl">
            📚
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold text-gray-900 truncate">{club.name}</h2>
          <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">
            {club.description || "No description."}
          </p>
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-400">
            <span>
              {club.club_meeting_mode === "in_person" ? "In person" : "Virtual"}
            </span>
            {club.is_public && (
              <span className="text-blue-600">Public</span>
            )}
            {club.max_members != null && (
              <span>Max {club.max_members} members</span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default BookClubCard;
