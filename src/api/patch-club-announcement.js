/**
 * Updates an existing announcement for a club. Owner only.
 * @param {string|number} clubId - Club id.
 * @param {string|number} announcementId - Announcement id.
 * @param {{ title?: string, message?: string }} payload - Fields to update.
 * @param {string} token - Auth token.
 * @returns {Promise<Object>} Updated announcement { id, club, title, message, sent_at }.
 */
async function patchClubAnnouncement(clubId, announcementId, payload, token) {
  const baseUrl = import.meta.env.VITE_API_URL ?? "";
  const url = `${baseUrl}/clubs/${clubId}/announcements/${announcementId}/`;

  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify({
      ...(payload?.title !== undefined ? { title: payload.title } : {}),
      ...(payload?.message !== undefined ? { message: payload.message } : {}),
    }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data?.detail ?? "Failed to update announcement.");
  }

  return await response.json();
}

export default patchClubAnnouncement;

