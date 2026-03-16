const MUTED_COLOR = "#8A7E74";

function ClubAnnouncmentBoard() {
  return (
    <section
      className="rounded-2xl bg-white p-6 shadow-sm"
      style={{ boxShadow: "rgba(26, 20, 16, 0.06) 0px 4px 20px" }}
    >
      <h2
        className="text-xs font-semibold uppercase tracking-wider m-0 mb-4"
        style={{ color: MUTED_COLOR, letterSpacing: "0.5px" }}
      >
        Announcement&apos;s board
      </h2>
      <p className="text-sm m-0" style={{ color: MUTED_COLOR }}>
        No announcements yet. This space will show important updates from the
        organiser once announcements are connected to the backend.
      </p>
    </section>
  );
}

export default ClubAnnouncmentBoard;
