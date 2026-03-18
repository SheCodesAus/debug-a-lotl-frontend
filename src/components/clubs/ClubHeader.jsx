/**
 * Club page hero/header: the top section of a single club's page.
 *
 * - Background: Uses the club's banner_image if set (with a dark overlay for
 *   text legibility), otherwise a gradient.
 * - Title: Club name as the main h1 (responsive type scale, white, truncates
 *   on narrow screens).
 * - Badge: Public/Private pill (green for public, orange for private).
 * - Subtitle: Optional "Created by {creatorName}" when creatorName is passed.
 *
 * Layout uses the same horizontal padding and max-width as the page body
 * (px-4 sm:px-6 max-w-6xl) so the hero title lines up with the content cards
 * below on all breakpoints.
 *
 * Props: club (object), creatorName (string | null), memberCount (number, optional),
 * isOwner (boolean, optional), onEditClub (function, optional).
 */
function ClubHeader({
  club,
  creatorName,
  memberCount = 0,
  isOwner = false,
  onEditClub,
}) {
  if (!club) return null;

  const visibility = club.is_public ? "Public" : "Private";
  const subtitleParts = [
    creatorName ? `Created by ${creatorName}` : null,
  ].filter(Boolean);

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
        <div className="min-w-0 w-full flex items-start justify-between gap-4">
          <div className="min-w-0">
          <h1 className="font-lora font-bold text-3xl sm:text-4xl lg:text-5xl text-white m-0 truncate">
            {club.name}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white"
              style={{
                backgroundColor: club.is_public
                  ? "rgb(107, 123, 92)"
                  : "rgb(196, 93, 62)",
              }}
            >
              {visibility}
            </span>
            {subtitleParts.length > 0 && (
              <p className="text-sm text-gray-200 m-0">
                {subtitleParts.join(" · ")}
              </p>
            )}
          </div>
          </div>

          {isOwner && (
            <button
              type="button"
              onClick={onEditClub}
              className="shrink-0 rounded-lg bg-white/15 text-white font-semibold px-4 py-2 text-sm border border-white/25 backdrop-blur-sm hover:bg-white/20 transition"
            >
              Edit club
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default ClubHeader;
