import { useEffect, useRef, useState } from "react";
import getClubBooks from "../api/get-club-books";

function normalizeIds(clubIds) {
  if (!Array.isArray(clubIds)) return [];
  const ids = clubIds
    .map((id) => (typeof id === "string" ? Number(id) : id))
    .filter((id) => Number.isFinite(id) && id > 0);
  return Array.from(new Set(ids));
}

/**
 * Fetches each club's current reading book (status === "reading").
 * Returns a map keyed by clubId: { [id]: book|null }
 */
export default function useClubsCurrentBooks(clubIds, token = null) {
  const ids = normalizeIds(clubIds);
  const idsKey = ids.join(",");
  const [currentBooksByClubId, setCurrentBooksByClubId] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorByClubId, setErrorByClubId] = useState({});

  // Cache: clubId -> { book, fetchedAt }
  const cacheRef = useRef(new Map());
  const inFlightRef = useRef(new Map()); // clubId -> Promise

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const idsFromKey =
        typeof idsKey === "string" && idsKey.length > 0
          ? idsKey
              .split(",")
              .map((x) => Number(x))
              .filter((n) => Number.isFinite(n) && n > 0)
          : [];

      if (idsFromKey.length === 0) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      const tasks = idsFromKey.map(async (clubId) => {
        // Use cache if available
        if (cacheRef.current.has(clubId)) {
          const cached = cacheRef.current.get(clubId);
          return { clubId, book: cached.book, error: null, fromCache: true };
        }

        // De-dupe in-flight fetches
        if (inFlightRef.current.has(clubId)) {
          try {
            const book = await inFlightRef.current.get(clubId);
            return { clubId, book, error: null, fromCache: false };
          } catch (e) {
            return { clubId, book: null, error: e, fromCache: false };
          }
        }

        const p = (async () => {
          const books = await getClubBooks(clubId, token);
          const list = Array.isArray(books) ? books : [];
          const reading = list.find((b) => b?.status === "reading") ?? null;
          return reading;
        })();

        inFlightRef.current.set(clubId, p);
        try {
          const book = await p;
          cacheRef.current.set(clubId, { book, fetchedAt: Date.now() });
          return { clubId, book, error: null, fromCache: false };
        } catch (e) {
          return { clubId, book: null, error: e, fromCache: false };
        } finally {
          inFlightRef.current.delete(clubId);
        }
      });

      const results = await Promise.all(tasks);
      if (cancelled) return;

      setCurrentBooksByClubId((prev) => {
        const next = { ...prev };
        for (const r of results) next[r.clubId] = r.book ?? null;
        return next;
      });

      setErrorByClubId((prev) => {
        const next = { ...prev };
        for (const r of results) {
          if (r.error)
            next[r.clubId] = r.error?.message || "Failed to load club books.";
          else delete next[r.clubId];
        }
        return next;
      });

      setIsLoading(false);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [idsKey, token]);

  return {
    currentBooksByClubId,
    isLoadingCurrentBooks: isLoading,
    currentBooksErrorByClubId: errorByClubId,
  };
}
