/**
 * Club page header: gradient background, club name, subtitle (members · created by · visibility), Invite Members button.
 */
function ClubHeader({ club, creatorName, memberCount = 0 }) {
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
      </div>
    </header>
  );
}

export default ClubHeader;
