/**
 * Fetches a single club by id using the backend detail endpoint.
 * Visibility rules are enforced by the backend.
 * @param {string} clubId - Club id from the URL.
 * @param {string|null} token - Optional auth token (e.g. from useAuth).
 * @returns {Promise<Object>} Club object.
 */
async function getClub(clubId, token = null) {
  const baseUrl = import.meta.env.VITE_API_URL ?? "";
  const id = Number(clubId);
  const url = `${baseUrl}/clubs/${id}/`;

  const headers = {};
  if (token) headers.Authorization = `Token ${token}`;

  const response = await fetch(url, { method: "GET", headers });

  if (!response.ok) {
    const fallbackError = "Club not found.";
    const data = await response.json().catch(() => null);
    throw new Error(data?.detail ?? fallbackError);
  }

  return await response.json();
}

export default getClub;
