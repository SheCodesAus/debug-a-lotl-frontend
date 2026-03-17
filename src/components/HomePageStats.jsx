/*
 * Stats section ready for future backend: Book Clubs uses data from parent (clubs list).
 * Active Readers and Books Read Together need a stats API – they show 0 until wired up.
 */
const statConfig = [
  { key: "books_read_together", label: "Books Read Together", color: "#6d8396" },
  { key: "active_readers", label: "Active Readers", color: "#7aaba1" },
  { key: "book_clubs", label: "Book Clubs", color: "#e3bd74", fromProp: true },
];

function HomePageStats({ bookClubsCount = 0 }) {
  const getValue = (item) => (item.fromProp ? bookClubsCount : 0);

  return (
    <section className="pt-0 pb-16 sm:pb-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 bg-[rgb(253,252,250)]">
      {/* Divider: section-above colour, one pointy dip in the middle (deep V) */}
      <div className="relative -mx-4 sm:-mx-6 lg:-mx-8" aria-hidden>
        <svg
          viewBox="0 0 1440 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-20 sm:h-28 md:h-36 block"
          preserveAspectRatio="none"
        >
          <path
            d="M0 0 L1440 0 L1440 80 L720 170 L0 80 Z"
            fill="rgb(247,244,240)"
          />
        </svg>
      </div>
      <div className="pt-8 sm:pt-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 text-center">
            {statConfig.map((item) => (
              <div key={item.key}>
                <p
                  className="font-lora text-3xl sm:text-4xl md:text-5xl font-bold"
                  style={{ color: item.color }}
                >
                  {getValue(item)}
                </p>
                <p className="font-nunito mt-1 text-sm sm:text-base text-[#606060]">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomePageStats;
