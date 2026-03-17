/**
 * Creates a new announcement for a club. Owner only.
 * @param {string|number} clubId - Club id.
 * @param {{ title: string, message: string }} payload - Title and message.
 * @param {string} token - Auth token.
 * @returns {Promise<Object>} Created announcement { id, club, title, message, sent_at }.
 */
async function postClubAnnouncement(clubId, payload, token) {
  const baseUrl = import.meta.env.VITE_API_URL ?? "";
  const url = `${baseUrl}/clubs/${clubId}/announcements/`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify({
      title: payload.title ?? "",
      message: payload.message ?? "",
    }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data?.detail ?? "Failed to post announcement.");
  }

  return await response.json();
}

export default postClubAnnouncement;
