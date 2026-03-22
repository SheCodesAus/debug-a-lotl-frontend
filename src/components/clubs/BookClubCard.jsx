import {
  IconInPerson,
  IconPrivate,
  IconPublic,
  IconVirtual,
} from "./ClubPillIcons.jsx";

function BookClubCard({ club, compact = false, dense = false, currentBook = null }) {
  if (!club) return null;

  const coverUrl = currentBook?.cover_image || "";
  const pillIconClass = compact
    ? "w-3.5 h-3.5 sm:w-3.5 sm:h-3.5"
    : "w-4 h-4 sm:w-4 sm:h-4";
  const coverAlt = currentBook?.title ? `${currentBook.title} cover` : "Current book cover";
  const isInactive = club.is_active === false;
  /** Shorter card body + flatter banner only; typography and horizontal layout stay `compact`. */
  const verticalCompact = compact && dense;

  return (
    <article
      className={
        (compact
          ? "rounded-xl overflow-hidden bg-[rgb(253,252,250)] shadow-sm hover:shadow-md transition-shadow border border-[rgba(48,48,48,0.06)]"
          : "rounded-2xl overflow-hidden bg-[rgb(253,252,250)] shadow-sm hover:shadow-md transition-shadow border border-[rgba(48,48,48,0.06)]") +
        " w-full min-w-0"
      }
    >
      {/* Hero image with overlay title */}
      <div
        className={
          verticalCompact
            ? "relative w-full bg-gray-100 aspect-[2/1]"
            : compact
              ? "relative w-full bg-gray-100 aspect-[16/10]"
              : "relative w-full bg-gray-100 aspect-[16/9]"
        }
      >
        {club.banner_image ? (
          <img
            src={club.banner_image}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className={`w-full h-full flex items-center justify-center text-[#e07a5f] bg-[rgb(247,244,240)] ${verticalCompact ? "text-3xl" : "text-4xl"}`}
          >
            📚
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.65)] via-[rgba(0,0,0,0.35)] to-transparent" />
        {isInactive && (
          <span
            className="absolute top-2 left-2 z-20 rounded-full text-xs px-2 py-1 pointer-events-none"
            style={{ backgroundColor: "rgb(196, 93, 62)", color: "white" }}
          >
            Inactive
          </span>
        )}
        <div
          className={
            compact
              ? "absolute inset-x-3 bottom-4 sm:bottom-5"
              : "absolute inset-x-5 bottom-6 sm:bottom-7"
          }
        >
          <h2
            className={
              compact
                ? "font-lora text-lg sm:text-base font-semibold text-white drop-shadow-md line-clamp-2"
                : "font-lora text-2xl sm:text-xl font-semibold text-white drop-shadow-md line-clamp-2"
            }
          >
            {club.name}
          </h2>
        </div>
      </div>

      {/* Content area under hero */}
      <div
        className={
          verticalCompact
            ? "px-3 py-3 sm:py-3 bg-white/90 min-h-[8.25rem] flex flex-col"
            : compact
              ? "px-3 py-5 sm:py-6 bg-white/90 min-h-[10.5rem] flex flex-col"
              : "px-5 py-7 sm:py-8 bg-white/90 min-h-[12rem] flex flex-col"
        }
      >
        <div
          className={
            (compact
              ? "flex gap-2.5 items-start flex-1 min-h-0"
              : "flex gap-3 sm:gap-4 items-start flex-1 min-h-0") + " w-full min-w-0"
          }
        >
          {/* Left: “now reading” — distinct panel (kept narrow so pills stay on one row) */}
          <div
            className={
              compact
                ? "flex-shrink-0 rounded-lg border border-[#e7ddd1] bg-[rgb(247,244,240)] p-1.5"
                : "flex-shrink-0 rounded-xl border border-[#e7ddd1] bg-[rgb(247,244,240)] p-2 sm:p-2.5"
            }
          >
            <div
              className={
                compact
                  ? "flex flex-col gap-0.5 w-20 sm:w-16"
                  : "flex flex-col gap-1 w-32 sm:w-24"
              }
            >
              <p
                className={
                  compact
                    ? "text-[8px] sm:text-[9px] font-semibold uppercase tracking-[0.02em] text-[#606060] font-nunito m-0 leading-[1.15] text-center max-w-full"
                    : "text-xs sm:text-[11px] font-semibold uppercase tracking-wide text-[#606060] font-nunito m-0 leading-tight text-center"
                }
              >
                Now reading
              </p>
              <div
                className={
                  (compact
                    ? "w-full aspect-[3/4] rounded-md bg-[rgb(253,252,250)] overflow-hidden flex items-center justify-center "
                    : "w-full aspect-[3/4] rounded-lg bg-[rgb(253,252,250)] overflow-hidden flex items-center justify-center ") +
                  (!coverUrl ? "border border-dashed border-[rgba(224,122,95,0.35)]" : "")
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
                  <span className="text-[10px] text-[#606060] font-nunito">—</span>
                ) : (
                  <p className="text-xs sm:text-sm text-[#606060] text-center font-nunito px-2 leading-snug">
                    Coming soon
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Club details: pills + description */}
          <div
            className={
              compact
                ? "min-w-0 flex-1 flex flex-col gap-2.5"
                : "min-w-0 flex-1 flex flex-col gap-3.5"
            }
          >
            <div className="flex flex-row flex-nowrap items-center gap-1 sm:gap-1.5 shrink-0 min-w-0">
              <span
                className={
                  compact
                    ? "inline-flex shrink-0 items-center gap-0.5 px-2 py-1 rounded-full bg-[rgb(247,244,240)] text-xs sm:text-[11px] text-[#606060] font-nunito"
                    : "inline-flex shrink-0 items-center gap-0.5 px-2 py-1.5 sm:px-2.5 rounded-full bg-[rgb(247,244,240)] text-xs sm:text-[11px] text-[#606060] font-nunito"
                }
              >
                {club.club_meeting_mode === "in_person" ? "In person" : "Virtual"}
                {club.club_meeting_mode === "in_person" ? (
                  <IconInPerson className={pillIconClass} />
                ) : (
                  <IconVirtual className={pillIconClass} />
                )}
              </span>
              {club.is_public ? (
                <span
                  className={
                    compact
                      ? "inline-flex shrink-0 items-center gap-0.5 px-2 py-1 rounded-full bg-[rgba(122,171,161,0.2)] text-[#7aaba1] text-xs sm:text-[11px] font-nunito"
                      : "inline-flex shrink-0 items-center gap-0.5 px-2 py-1.5 sm:px-2.5 rounded-full bg-[rgba(122,171,161,0.2)] text-[#7aaba1] text-xs sm:text-[11px] font-nunito"
                  }
                >
                  Public
                  <IconPublic className={pillIconClass} />
                </span>
              ) : (
                <span
                  className={
                    compact
                      ? "inline-flex shrink-0 items-center gap-0.5 px-2 py-1 rounded-full bg-[rgba(224,122,95,0.08)] text-[#e07a5f] text-xs sm:text-[11px] font-nunito"
                      : "inline-flex shrink-0 items-center gap-0.5 px-2 py-1.5 sm:px-2.5 rounded-full bg-[rgba(224,122,95,0.08)] text-[#e07a5f] text-xs sm:text-[11px] font-nunito"
                  }
                >
                  Private
                  <IconPrivate className={pillIconClass} />
                </span>
              )}
            </div>
            <p
              className={
                compact
                  ? "m-0 min-w-0 flex-1 text-xs sm:text-sm text-[#606060] font-nunito line-clamp-4 break-words"
                  : "m-0 min-w-0 flex-1 text-sm sm:text-base text-[#606060] font-nunito line-clamp-4 break-words"
              }
              title={club.description || undefined}
            >
              {club.description || "No description yet – add one to help readers discover your club."}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

export default BookClubCard;
