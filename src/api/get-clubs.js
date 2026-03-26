/**
 * Fetches the list of book clubs from the API.
 * - With token: returns public clubs plus clubs the user owns or is a member of.
 * - Without token: returns only public clubs.
 * @param {string|null} token - Optional auth token (e.g. from useAuth).
 * @param {Object} params - Optional query params for filtering.
 * @param {string=} params.q - Search query (name/description).
 * @param {string=} params.visibility - all|public|private.
 * @param {string[]=} params.genres - Repeated genres filter (OR match).
 * @returns {Promise<Array>} List of club objects.
 */
async function getClubs(token = null, params = null) {
  const baseUrl = import.meta.env.VITE_API_URL ?? "";
  const url = new URL(`${baseUrl}/clubs/`);

  if (params && typeof params === "object") {
    const q = typeof params.q === "string" ? params.q.trim() : "";
    if (q) url.searchParams.set("q", q);

    const visibility =
      typeof params.visibility === "string" ? params.visibility.trim() : "";
    if (visibility) url.searchParams.set("visibility", visibility);

    const genres = Array.isArray(params.genres) ? params.genres : [];
    for (const g of genres) {
      if (typeof g === "string" && g.trim()) {
        url.searchParams.append("genres", g.trim());
      }
    }
  }

  // Send Authorization header only when logged in, so the backend can filter accordingly
  const headers = {};
  if (token) {
    headers.Authorization = `Token ${token}`;
  }

  const response = await fetch(url.toString(), {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    throw new Error("Failed to load clubs");
  }

  return await response.json();
}

export default getClubs;
