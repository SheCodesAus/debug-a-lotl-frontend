/** Striped book-cover style (matches HomePage hero cards) for gated club sections. */
const PLACEHOLDER_BG = "#e3bd74";
const stripePattern = `repeating-linear-gradient(
  45deg,
  transparent,
  transparent 8px,
  rgba(255,255,255,0.06) 8px,
  rgba(255,255,255,0.06) 16px
)`;

export default function ClubMemberContentPlaceholder() {
  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col justify-center py-3 px-4 sm:py-3.5 sm:px-5 text-white"
      style={{
        backgroundColor: PLACEHOLDER_BG,
        backgroundImage: stripePattern,
        boxShadow: "0 4px 18px rgba(26, 20, 16, 0.14)",
      }}
    >
      <p className="font-lora text-xs sm:text-sm leading-snug m-0 max-w-lg">
        You need to request to join this club in order to view this information.
      </p>
    </div>
  );
}
