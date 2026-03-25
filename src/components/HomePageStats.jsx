/*
 * Stats section ready for future backend: Book Clubs uses data from parent (clubs list).
 * Active Readers and Books Read Together need a stats API – they show 0 until wired up.
 */
import { useEffect, useState } from "react";
import getHomepageStats from "../api/get-homepage-stats";
import { SkeletonBlock } from "./ui/Skeleton.jsx";

const statConfig = [
  { key: "books_read_together", label: "Books Read Together", color: "#6d8396" },
  { key: "active_readers", label: "Active Readers", color: "#7aaba1" },
  { key: "book_clubs", label: "Book Clubs", color: "#e3bd74", fromProp: true },
];

function HomeStatsCard({ value, label, color, valuePending = false }) {
  return (
    <div className="rounded-3xl border border-[#efe6dc] bg-[#fcfaf7] px-6 py-8 shadow-sm">
      {valuePending ? (
        <SkeletonBlock
          className="h-12 sm:h-16 md:h-20 w-24 sm:w-28 mx-auto sm:mx-0 rounded-xl"
          aria-hidden
        />
      ) : (
        <p
          className="font-lora text-4xl sm:text-5xl md:text-6xl font-bold m-0"
          style={{ color }}
        >
          {value}
        </p>
      )}
      <p className="font-nunito mt-3 mb-0 text-base sm:text-lg font-semibold text-[#4f4a45]">
        {label}
      </p>
    </div>
  );
}

function HomePageStats({ bookClubsCount = 0, embedded = false }) {
  const [stats, setStats] = useState({
    active_readers: null,
    total_books_read: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getHomepageStats()
      .then((data) => {
        if (cancelled) return;
        setStats({
          active_readers:
            typeof data?.active_readers === "number" ? data.active_readers : 0,
          total_books_read:
            typeof data?.total_books_read === "number" ? data.total_books_read : 0,
        });
      })
      .catch(() => {
        if (cancelled) return;
        setStats({ active_readers: 0, total_books_read: 0 });
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const getValue = (item) => {
    if (item.fromProp) return bookClubsCount;
    if (item.key === "active_readers") return stats.active_readers ?? 0;
    if (item.key === "books_read_together") return stats.total_books_read ?? 0;
    return 0;
  };

  return (
    <section
      className={
        embedded
          ? "pt-0 pb-0"
          : "pt-0 pb-16 sm:pb-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 bg-[rgb(253,252,250)]"
      }
    >
      {!embedded && (
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
      )}
      <div className={embedded ? "pt-0" : "pt-8 sm:pt-12"}>
        <div className={embedded ? "max-w-4xl mx-auto" : "max-w-4xl mx-auto"}>
          {embedded && (
            <div className="text-center mb-8">
              <p
                className="text-xs font-semibold uppercase tracking-[0.2em] mb-2"
                style={{ color: "#C45D3E" }}
              >
                Community Snapshot
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 text-center items-stretch">
            {statConfig.map((item) => (
              <HomeStatsCard
                key={item.key}
                value={getValue(item)}
                label={item.label}
                color={item.color}
                valuePending={!item.fromProp && loading}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomePageStats;
