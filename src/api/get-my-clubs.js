/**
 * Fetches the list of book clubs owned by the current user (active + inactive).
 * Uses backend endpoint GET /clubs/mine/
 * @param {string} token - Auth token (required).
 * @returns {Promise<Array>} List of club objects.
 */
async function getMyClubs(token) {
  const baseUrl = import.meta.env.VITE_API_URL ?? "";
  const url = `${baseUrl}/clubs/mine/`;

  if (!token) {
    throw new Error("Auth token required");
  }

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Token ${token}`,
    },
  });

  if (!response.ok) {
    const fallbackError = "Failed to load your clubs";
    const data = await response.json().catch(() => null);
    throw new Error(data?.detail ?? fallbackError);
  }

  return await response.json();
}

export default getMyClubs;

