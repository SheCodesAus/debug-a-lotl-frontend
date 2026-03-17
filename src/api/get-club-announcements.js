/**
 * Fetches announcements for a club. Requires auth; only members/owner can view.
 * @param {string|number} clubId - Club id.
 * @param {string|null} token - Auth token (required for members-only content).
 * @returns {Promise<Array>} List of announcement objects { id, club, title, message, sent_at }.
 */
async function getClubAnnouncements(clubId, token = null) {
  const baseUrl = import.meta.env.VITE_API_URL ?? "";
  const url = `${baseUrl}/clubs/${clubId}/announcements/`;

  const headers = {};
  if (token) {
    headers.Authorization = `Token ${token}`;
  }

  const response = await fetch(url, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data?.detail ?? "Failed to load announcements.");
  }

  return await response.json();
}

export default getClubAnnouncements;
