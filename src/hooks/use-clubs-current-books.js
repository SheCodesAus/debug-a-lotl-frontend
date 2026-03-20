import { useEffect, useRef, useState } from "react";
import getClubBooks from "../api/get-club-books";

function normalizeIds(clubIds) {
  if (!Array.isArray(clubIds)) return [];
  const ids = clubIds
    .map((id) => (typeof id === "string" ? Number(id) : id))
    .filter((id) => Number.isFinite(id) && id > 0);
  // De-dupe so we don't fetch the same club twice.
  return Array.from(new Set(ids));
}

/**
 * Fetches each club's books once per club; exposes the current reading book
 * (status === "reading") per club and the total count of historic books
 * (status === "read", same as ClubPage "Historic reading") across those clubs.
 */
export default function useClubsCurrentBooks(clubIds, token = null) {
  // NOTE:
  // `clubIds` is often created inline in a render (e.g. `clubs.map(c => c.id)`),
  // which means its array identity changes every render.
  //
  // We normalize + convert to a stable primitive dependency (`idsKey`) so this
  // hook doesn't refetch + setState on every render (which can cause
  // "Maximum update depth exceeded").
  const ids = normalizeIds(clubIds);
  const idsKey = ids.join(",");
  const [currentBooksByClubId, setCurrentBooksByClubId] = useState({});
  const [totalHistoricReadCount, setTotalHistoricReadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorByClubId, setErrorByClubId] = useState({});

  // Cache:
  // Store the selected "current reading" book per club so pagination/filtering
  // doesn't trigger refetches for clubs we've already loaded.
  //
  // clubId -> { book, historicReadCount, fetchedAt }
  const cacheRef = useRef(new Map());

  // In-flight de-dupe:
  // If multiple renders ask for the same club's books while the request is
  // still pending, reuse the same Promise rather than issuing multiple calls.
  //
  // clubId -> Promise<{ book, historicReadCount }>
  const inFlightRef = useRef(new Map());

  useEffect(() => {
    let cancelled = false;

    async function load() {
      // Reconstruct IDs from `idsKey` so the effect is driven by the actual set
      // of IDs, not by the reference identity of the array passed in.
      const idsFromKey =
        typeof idsKey === "string" && idsKey.length > 0
          ? idsKey
              .split(",")
              .map((x) => Number(x))
              .filter((n) => Number.isFinite(n) && n > 0)
          : [];

      if (idsFromKey.length === 0) {
        setIsLoading(false);
        setTotalHistoricReadCount(0);
        return;
      }

      setIsLoading(true);

      const tasks = idsFromKey.map(async (clubId) => {
        // Use cache if available
        if (cacheRef.current.has(clubId)) {
          const cached = cacheRef.current.get(clubId);
          return {
            clubId,
            book: cached.book,
            historicReadCount: cached.historicReadCount ?? 0,
            error: null,
            fromCache: true,
          };
        }

        // De-dupe in-flight fetches
        if (inFlightRef.current.has(clubId)) {
          try {
            const data = await inFlightRef.current.get(clubId);
            return {
              clubId,
              book: data.book,
              historicReadCount: data.historicReadCount,
              error: null,
              fromCache: false,
            };
          } catch (e) {
            return { clubId, book: null, historicReadCount: 0, error: e, fromCache: false };
          }
        }

        // Fetch the club's books then select the current reading one.
        // This matches the logic already used on `ClubPage`.
        const p = (async () => {
          const books = await getClubBooks(clubId, token);
          const list = Array.isArray(books) ? books : [];
          const book = list.find((b) => b?.status === "reading") ?? null;
          const historicReadCount = list.filter((b) => b?.status === "read").length;
          return { book, historicReadCount };
        })();

        inFlightRef.current.set(clubId, p);
        try {
          const { book, historicReadCount } = await p;
          cacheRef.current.set(clubId, {
            book,
            historicReadCount,
            fetchedAt: Date.now(),
          });
          return { clubId, book, historicReadCount, error: null, fromCache: false };
        } catch (e) {
          return { clubId, book: null, historicReadCount: 0, error: e, fromCache: false };
        } finally {
          inFlightRef.current.delete(clubId);
        }
      });

      const results = await Promise.all(tasks);
      if (cancelled) return;

      // Merge into state instead of replacing:
      // pages may incrementally show more clubs (pagination), and we don't want
      // to lose already-fetched entries.
      setCurrentBooksByClubId((prev) => {
        const next = { ...prev };
        for (const r of results) next[r.clubId] = r.book ?? null;
        return next;
      });

      // Best-effort errors:
      // keep track of per-club failures without breaking the whole page.
      setErrorByClubId((prev) => {
        const next = { ...prev };
        for (const r of results) {
          if (r.error)
            next[r.clubId] = r.error?.message || "Failed to load club books.";
          else delete next[r.clubId];
        }
        return next;
      });

      setTotalHistoricReadCount(
        results.reduce((sum, r) => sum + (r.error ? 0 : (r.historicReadCount ?? 0)), 0),
      );

      setIsLoading(false);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [idsKey, token]);

  return {
    currentBooksByClubId,
    totalHistoricReadCount,
    isLoadingCurrentBooks: isLoading,
    currentBooksErrorByClubId: errorByClubId,
  };
}
