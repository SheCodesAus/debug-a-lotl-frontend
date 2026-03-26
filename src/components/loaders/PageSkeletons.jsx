import { SkeletonBlock, SkeletonCircle, SkeletonLine } from "../ui/Skeleton.jsx";

const SR_ONLY = (
  <span className="sr-only">Content is loading</span>
);

/** Matches BookClubCard grid placement on home / discover. */
export function BookClubCardSkeleton({ count = 6 }) {
  return (
    <div aria-busy="true">
      {SR_ONLY}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-[#ece2d7] bg-white overflow-hidden shadow-sm flex flex-col min-h-[200px]"
        >
          <SkeletonBlock className="h-36 w-full rounded-none" />
          <div className="p-5 space-y-3 flex-1 flex flex-col">
            <SkeletonLine className="w-3/4" />
            <SkeletonLine className="w-1/2 h-2.5" />
            <SkeletonBlock className="h-8 w-full rounded-md mt-auto" />
          </div>
        </div>
      ))}
      </div>
    </div>
  );
}

export function ClubPageSkeleton({ pageBg = "#fffaf6" }) {
  const cardShadow = { boxShadow: "rgba(26, 20, 16, 0.06) 0px 4px 20px" };

  return (
    <main
      className="min-h-full flex flex-col font-nunito"
      style={{ backgroundColor: pageBg }}
      aria-busy="true"
    >
      {SR_ONLY}
      <SkeletonBlock className="w-full min-h-[220px] sm:min-h-[260px] rounded-none py-10" />

      <div className="flex-1 px-4 sm:px-6 py-8 max-w-6xl w-full mx-auto space-y-8">
        <div className="rounded-2xl bg-white p-8 shadow-sm space-y-4" style={cardShadow}>
          <SkeletonLine className="w-40 h-4" />
          <div className="flex flex-col sm:flex-row gap-3">
            <SkeletonBlock className="h-12 flex-1 rounded-lg" />
            <SkeletonBlock className="h-12 w-full sm:w-32 rounded-lg" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-6 gap-6">
          <section
            className="order-1 lg:col-span-2 rounded-2xl bg-white p-6 sm:p-8 shadow-sm space-y-4"
            style={cardShadow}
          >
            <SkeletonLine className="w-48 h-4" />
            <div className="flex items-start gap-4">
              <SkeletonCircle size={64} />
              <div className="flex-1 space-y-3 min-w-0 pt-1">
                <SkeletonLine className="w-2/3 h-4" />
                <SkeletonLine className="w-full" />
                <SkeletonLine className="w-5/6" />
                <div className="flex gap-2 pt-2">
                  <SkeletonBlock className="h-6 w-24 rounded-full" />
                  <SkeletonBlock className="h-6 w-20 rounded-full" />
                </div>
              </div>
            </div>
          </section>

          <section
            className="order-2 lg:col-span-1 lg:row-span-2 rounded-2xl bg-white p-8 shadow-sm space-y-4"
            style={cardShadow}
          >
            <SkeletonLine className="w-44 h-4" />
            <SkeletonBlock className="w-full max-w-[200px] mx-auto aspect-[2/3] rounded-lg" />
            <SkeletonLine className="w-4/5 mx-auto h-5" />
            <SkeletonLine className="w-3/5 mx-auto h-3" />
          </section>

          <section
            className="order-3 lg:col-span-2 rounded-2xl bg-white p-6 sm:p-8 shadow-sm space-y-4"
            style={cardShadow}
          >
            <SkeletonLine className="w-36 h-4" />
            <div className="space-y-4">
              <div className="space-y-2 pb-4 border-b border-stone-100">
                <SkeletonLine className="w-2/3 h-3" />
                <SkeletonLine className="w-3/4 h-4" />
                <SkeletonBlock className="h-8 w-20 rounded-lg ml-auto" />
              </div>
              <div className="space-y-2">
                <SkeletonLine className="w-2/3 h-3" />
                <SkeletonLine className="w-3/4 h-4" />
              </div>
            </div>
          </section>
        </div>

        <section
          className="rounded-2xl bg-white p-6 sm:p-8 shadow-sm space-y-4"
          style={cardShadow}
        >
          <SkeletonLine className="w-40 h-4" />
          <div className="flex flex-wrap gap-4">
            {[1, 2, 3, 4].map((k) => (
              <div key={k} className="flex flex-col items-center gap-2 w-24">
                <SkeletonBlock className="w-full aspect-[2/3] rounded-md" />
                <SkeletonLine className="w-full h-2" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export function ProfilePageSkeleton({ pageBg = "#fffaf6" }) {
  return (
    <div
      className="min-h-full font-nunito"
      style={{ backgroundColor: pageBg }}
      aria-busy="true"
    >
      {SR_ONLY}
      <div className="max-w-2xl mx-auto px-4 py-6 sm:px-8">
        <div className="rounded-2xl bg-white shadow-sm p-9 sm:p-10 space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <SkeletonCircle size={96} />
            <div className="flex-1 w-full space-y-3">
              <SkeletonLine className="w-48 h-5 mx-auto sm:mx-0" />
              <SkeletonLine className="w-full max-w-md mx-auto sm:mx-0" />
              <SkeletonLine className="w-4/5 max-w-sm mx-auto sm:mx-0" />
            </div>
          </div>
          <div className="space-y-3 pt-2">
            <SkeletonLine className="w-24 h-4" />
            <SkeletonBlock className="h-24 w-full rounded-xl" />
          </div>
          <div className="space-y-3">
            <SkeletonLine className="w-32 h-4" />
            <SkeletonLine className="w-full" />
            <SkeletonLine className="w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function AnnouncementBoardSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true">
      {SR_ONLY}
      <SkeletonLine className="w-52 h-4" />
      {[1, 2, 3].map((k) => (
        <div
          key={k}
          className="rounded-xl border border-stone-100 bg-stone-50/50 p-4 space-y-3"
        >
          <SkeletonLine className="w-full h-3" />
          <SkeletonLine className="w-11/12 h-3" />
          <SkeletonLine className="w-20 h-6 rounded-md" />
        </div>
      ))}
    </div>
  );
}
