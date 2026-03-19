function BookClubCard({ club, compact = false, currentBook = null }) {
  if (!club) return null;

  const coverUrl = currentBook?.cover_image || "";
  const coverAlt = currentBook?.title ? `${currentBook.title} cover` : "Current book cover";
  const isInactive = club.is_active === false;

  return (
    <article
      className={
        compact
          ? "rounded-xl overflow-hidden bg-[rgb(253,252,250)] shadow-sm hover:shadow-md transition-shadow border border-[rgba(48,48,48,0.06)]"
          : "rounded-2xl overflow-hidden bg-[rgb(253,252,250)] shadow-sm hover:shadow-md transition-shadow border border-[rgba(48,48,48,0.06)]"
      }
    >
      {/* Hero image with overlay title – shorter height */}
      <div className={compact ? "relative w-full bg-gray-100 aspect-[16/10]" : "relative w-full bg-gray-100 aspect-[16/9]"}>
        {club.banner_image ? (
          <img
            src={club.banner_image}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl text-[#e07a5f] bg-[rgb(247,244,240)]">
            📚
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.65)] via-[rgba(0,0,0,0.35)] to-transparent" />
        {isInactive && (
          <span
            className="absolute top-2 left-2 z-20 rounded-full text-[10px] px-2 py-1 pointer-events-none"
            style={{ backgroundColor: "rgb(196, 93, 62)", color: "white" }}
          >
            Inactive
          </span>
        )}
        <div className={compact ? "absolute inset-x-2 bottom-2" : "absolute inset-x-4 bottom-4"}>
          <h2
            className={
              compact
                ? "font-lora text-sm sm:text-base font-semibold text-white drop-shadow-md line-clamp-2"
                : "font-lora text-lg sm:text-xl font-semibold text-white drop-shadow-md line-clamp-2"
            }
          >
            {club.name}
          </h2>
        </div>
      </div>

      {/* Content area under hero – fixed height, more padding */}
      <div
        className={
          compact
            ? "px-3 py-3 sm:py-4 bg-white/90 h-[8.75rem] flex flex-col"
            : "px-5 py-5 sm:py-6 bg-white/90 h-[10.5rem] flex flex-col"
        }
      >
        <div className={compact ? "flex gap-2 items-stretch flex-1 min-h-0" : "flex gap-4 items-stretch flex-1 min-h-0"}>
          {/* Left: current book cover (fallback to placeholder) */}
          <div
            className={
              compact
                ? "w-12 h-[4.25rem] flex-shrink-0 rounded-md border border-dashed border-[rgba(224,122,95,0.35)] bg-[rgb(253,252,250)] overflow-hidden flex items-center justify-center"
                : "w-20 sm:w-24 h-full flex-shrink-0 rounded-lg border border-dashed border-[rgba(224,122,95,0.35)] bg-[rgb(253,252,250)] overflow-hidden flex items-center justify-center"
            }
          >
            {coverUrl ? (
              <img
                src={coverUrl}
                alt={coverAlt}
                className="w-full h-full object-contain bg-[rgb(253,252,250)]"
                loading="lazy"
              />
            ) : compact ? (
              <span className="text-[8px] text-[#606060] font-nunito">Book</span>
            ) : (
              <p className="text-[10px] sm:text-xs text-[#606060] text-center font-nunito px-2 leading-snug">
                Current book
                <br />
                coming soon
              </p>
            )}
          </div>

          {/* Right: metadata */}
          <div className="min-w-0 flex-1 flex flex-col justify-between overflow-hidden">
            <p
              className={
                compact
                  ? "text-[10px] sm:text-xs text-[#606060] font-nunito line-clamp-2 mb-1 break-words"
                  : "text-xs sm:text-sm text-[#606060] font-nunito line-clamp-2 mb-2 break-words"
              }
              title={club.description || undefined}
            >
              {club.description || "No description yet – add one to help readers discover your club."}
            </p>
            <div
              className={
                compact
                  ? "mt-auto flex flex-wrap gap-1 text-[9px] sm:text-[10px] text-[#606060] font-nunito shrink-0"
                  : "mt-auto flex flex-wrap gap-2 text-[11px] sm:text-xs text-[#606060] font-nunito shrink-0"
              }
            >
              <span className="px-1.5 py-0.5 rounded-full bg-[rgb(247,244,240)]">
                {club.club_meeting_mode === "in_person" ? "In person" : "Virtual"}
              </span>
              {club.is_public ? (
                <span className="px-1.5 py-0.5 rounded-full bg-[rgba(122,171,161,0.2)] text-[#7aaba1]">
                  Public
                </span>
              ) : (
                <span className="px-1.5 py-0.5 rounded-full bg-[rgba(224,122,95,0.08)] text-[#e07a5f]">
                  Private
                </span>
              )}
              {club.max_members != null && (
                <span className="px-1.5 py-0.5 rounded-full bg-[rgb(247,244,240)]">
                  Max {club.max_members}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default BookClubCard;
