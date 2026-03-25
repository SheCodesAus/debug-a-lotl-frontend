/**
 * Club page hero/header: the top section of a single club's page.
 *
 * - Background: Uses the club's banner_image if set (with a dark overlay for
 *   text legibility), otherwise a gradient.
 * - Title: Club name as the main h1 (responsive type scale, white, truncates
 *   on narrow screens).
 * - Badge: Public/Private pill — outline/glass styling on the dark overlay so it
 *   reads as status (not a button) next to the solid Edit club control.
 * - Subtitle: Optional "Created by {creatorName}" when creatorName is passed (beside the pill).
 * - Edit club (owners): primary accent button on the same row as the pill.
 *
 * Layout uses the same horizontal padding and max-width as the page body
 * (px-4 sm:px-6 max-w-6xl) so the hero title lines up with the content cards
 * below on all breakpoints.
 *
 * Props: club (object), creatorName (string | null), memberCount (number, optional),
 * isOwner (boolean, optional), onEditClub (function, optional).
 */
import { IconPrivate, IconPublic } from "./ClubPillIcons.jsx";
import InlineSpinner from "../ui/InlineSpinner.jsx";

const ACCENT = "#C45D3E";

const pillIconClass = "w-5 h-5 sm:w-5 sm:h-5";

/** Shared non-interactive visibility styling (glass/outline — distinct from CTA button). */
const visibilityPillBaseClass =
  "inline-flex shrink-0 items-center gap-1 px-3 py-2 sm:px-4 sm:py-2 rounded-full border bg-white/10 backdrop-blur-sm text-white/90 text-sm sm:text-base font-nunito";

function IconEditPencil({ className }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M7 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-1" />
      <path d="M20.385 6.585a2.1 2.1 0 0 0-2.97-2.97L9 12v3h3l8.385-8.415z" />
    </svg>
  );
}

function ClubHeader({
  club,
  creatorName,
  memberCount = 0,
  isOwner = false,
  onEditClub,
  canLeaveClub = false,
  onLeaveClub,
  isLeavingClub = false,
}) {
  if (!club) return null;

  const subtitleParts = [
    creatorName ? `Created by ${creatorName}` : null,
  ].filter(Boolean);
  const hasCapacityLimit = club.max_members != null;

  const headerStyle = club.banner_image
    ? {
        backgroundImage: `url(${club.banner_image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : {
        background:
          "linear-gradient(135deg, #3d4f5c 0%, #2d4a3e 50%, #2c3e3a 100%)",
      };

  return (
    <header
      className="w-full py-10 relative min-h-[220px] sm:min-h-[260px]"
      style={headerStyle}
    >
      {/* Dark overlay to keep text legible on banner images */}
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />
      {/* Same content wrapper as body (px-4 sm:px-6 max-w-6xl w-full mx-auto) so hero title lines up with cards */}
      <div className="px-4 sm:px-6 max-w-6xl w-full mx-auto relative min-h-[220px] sm:min-h-[260px] flex items-center">
        <div className="min-w-0 w-full">
          <h1 className="font-lora font-bold text-3xl sm:text-4xl lg:text-5xl text-white m-0 truncate">
            {club.name}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            {club.is_public ? (
              <span
                className={`${visibilityPillBaseClass} border-white/40`}
                aria-label="This club is public"
              >
                Public
                <IconPublic className={pillIconClass} />
              </span>
            ) : (
              <span
                className={`${visibilityPillBaseClass} border-red-400/75`}
                aria-label="This club is private"
              >
                Private
                <IconPrivate className={pillIconClass} />
              </span>
            )}
            {hasCapacityLimit && (
              <span
                className={`${visibilityPillBaseClass} border-white/30`}
                aria-label={`This club has a maximum capacity of ${club.max_members} members`}
              >
                {memberCount}/{club.max_members} members
              </span>
            )}
            {isOwner && (
              <button
                type="button"
                onClick={onEditClub}
                className="inline-flex shrink-0 items-center gap-2 rounded-lg text-white font-semibold font-nunito text-sm px-4 py-2 transition hover:opacity-90"
                style={{ backgroundColor: ACCENT }}
              >
                <IconEditPencil className="shrink-0 opacity-95" />
                Edit club
              </button>
              )}
              {canLeaveClub && (
                <button
                type="button"
                onClick={onLeaveClub}
                disabled={isLeavingClub}
                aria-busy={isLeavingClub}
                className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-white/40 bg-white/10 text-white font-semibold font-nunito text-sm px-4 py-2 backdrop-blur-sm transition hover:bg-white/20 disabled:opacity-60 disabled:cursor-not-allowed min-w-[6.5rem]"
                >
                {isLeavingClub ? <InlineSpinner size={16} className="text-white" /> : null}
                Leave club
                </button>
                )}
            {subtitleParts.length > 0 && (
              <p className="text-sm text-gray-200 m-0">
                {subtitleParts.join(" · ")}
              </p>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default ClubHeader;
