// Search books via backend proxy (Google Books API). No API key needed in frontend.
// Use same base URL as other API calls; fallback to local backend when unset (e.g. dev).
// Backend requires auth; pass token so the request is authorized.
async function getGoogleBooks(query, token = null) {
  const trimmedQuery = query?.trim();
  if (!trimmedQuery) return [];

  const baseUrl =
    (import.meta.env.VITE_API_URL ?? "").trim() || "https://openbookapp.netlify.app";
  const encodedQuery = encodeURIComponent(trimmedQuery);
  const url = `${baseUrl.replace(/\/$/, "")}/books/search/?q=${encodedQuery}`;

  const headers = {};
  if (token) headers.Authorization = `Token ${token}`;
  const response = await fetch(url, { method: "GET", headers });

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
