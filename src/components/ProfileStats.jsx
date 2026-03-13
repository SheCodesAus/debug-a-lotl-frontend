function ProfileStats({
  clubsCount,
  upcomingMeetingsCount,
  booksReadCount,
  cardBg,
  statNumberColor,
  descriptionColor,
}) {
  const stats = [
    { value: clubsCount, label: "Clubs" },
    { value: upcomingMeetingsCount, label: "Upcoming meetings" },
    { value: booksReadCount, label: "Books read" },
  ];

  return (
    <section className="grid grid-cols-3 gap-4 sm:gap-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl p-5 sm:p-6 text-center"
          style={{
            backgroundColor: cardBg,
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          <p
            className="text-2xl sm:text-3xl font-bold"
            style={{ color: statNumberColor }}
          >
            {stat.value}
          </p>
          <p className="text-sm mt-1" style={{ color: descriptionColor }}>
            {stat.label}
          </p>
        </div>
      ))}
    </section>
  );
}

export default ProfileStats;
