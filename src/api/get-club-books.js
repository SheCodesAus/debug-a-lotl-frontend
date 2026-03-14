/**
 * Fetches the list of books for a club.
 * Uses backend endpoint GET /clubs/{id}/books/
 * @param {string|number} clubId - Club id from the URL.
 * @param {string|null} token - Optional auth token (required for private clubs).
 * @returns {Promise<Array>} List of club book objects.
 */
async function getClubBooks(clubId, token = null) {
  const baseUrl = import.meta.env.VITE_API_URL ?? "";
  const url = `${baseUrl}/clubs/${clubId}/books/`;

  const headers = {};
  if (token) {
    headers.Authorization = `Token ${token}`;
  }

  const response = await fetch(url, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    throw new Error("Failed to load club books.");
  }

  return await response.json();
}

export default getClubBooks;
