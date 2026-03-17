/**
 * Updates a club (name, description, banner_image, etc.). Owner only.
 * Uses backend endpoint PATCH /clubs/{id}/
 * @param {string} token - Auth token (required).
 * @param {number|string} clubId - Club id.
 * @param {Object} payload - Fields to update.
 * @returns {Promise<Object>} Updated club object.
 */
async function patchClub(token, clubId, payload) {
  const baseUrl = import.meta.env.VITE_API_URL ?? "";
  const url = `${baseUrl}/clubs/${clubId}/`;

  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const fallbackError = "Could not update club.";
    const data = await response.json().catch(() => {
      throw new Error(fallbackError);
    });
    throw new Error(data?.detail ?? fallbackError);
  }

  return await response.json();
}

export default patchClub;

