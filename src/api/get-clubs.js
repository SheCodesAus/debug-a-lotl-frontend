/**
 * Fetches the list of book clubs from the API.
 * - With token: returns public clubs plus clubs the user owns or is a member of.
 * - Without token: returns only public clubs.
 * @param {string|null} token - Optional auth token (e.g. from useAuth).
 * @returns {Promise<Array>} List of club objects.
 */
async function getClubs(token = null) {
  const baseUrl = import.meta.env.VITE_API_URL ?? "";
  const url = `${baseUrl}/clubs/`;

  // Send Authorization header only when logged in, so the backend can filter accordingly
  const headers = {};
  if (token) {
    headers.Authorization = `Token ${token}`;
  }

  const response = await fetch(url, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    throw new Error("Failed to load clubs");
  }

  return await response.json();
}

export default getClubs;
