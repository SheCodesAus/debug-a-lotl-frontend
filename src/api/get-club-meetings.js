/**
 * Fetches the list of meetings for a club.
 * Uses backend endpoint GET /clubs/{id}/meetings/
 * Requires auth for private clubs / member-only content.
 * @param {string|number} clubId - Club id from the URL.
 * @param {string|null} token - Auth token (required to view meetings as owner/member).
 * @returns {Promise<Array>} List of meeting objects.
 */
async function getClubMeetings(clubId, token = null) {
  const baseUrl = import.meta.env.VITE_API_URL ?? "";
  const url = `${baseUrl}/clubs/${clubId}/meetings/`;

  const headers = {};
  if (token) {
    headers.Authorization = `Token ${token}`;
  }

  const response = await fetch(url, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    throw new Error("Failed to load club meetings.");
  }

  return await response.json();
}

export default getClubMeetings;
