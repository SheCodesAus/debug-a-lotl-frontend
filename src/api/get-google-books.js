// Search books via backend proxy (Google Books API). No API key needed in frontend.
// Use same base URL as other API calls; fallback to local backend when unset (e.g. dev).
async function getGoogleBooks(query) {
  const trimmedQuery = query?.trim();
  if (!trimmedQuery) return [];

  const baseUrl =
    (import.meta.env.VITE_API_URL ?? "").trim() ||
    "http://127.0.0.1:8000";
  const encodedQuery = encodeURIComponent(trimmedQuery);
  const url = `${baseUrl.replace(/\/$/, "")}/books/search/?q=${encodedQuery}`;

  const response = await fetch(url, { method: "GET" });

  if (!response.ok) {
    const fallbackError = "Error searching books.";
    const data = await response.json().catch(() => ({ error: fallbackError }));
    const message = data?.error ?? data?.detail ?? fallbackError;
    throw new Error(typeof message === "string" ? message : fallbackError);
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

export default getGoogleBooks;
