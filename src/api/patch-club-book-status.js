/**
 * Updates a club book (e.g. status). Owner only.
 * Uses backend endpoint PATCH /clubs/{club_id}/books/{book_id}/
 * @param {string} token - Auth token (required).
 * @param {number|string} clubId - Club id.
 * @param {number|string} bookId - Club book id.
 * @param {Object} payload - Fields to update, e.g. { status: "read" }.
 * @returns {Promise<Object>} Updated club book object.
 */
async function patchClubBookStatus(token, clubId, bookId, payload) {
  const baseUrl = import.meta.env.VITE_API_URL ?? "";
  const url = `${baseUrl}/clubs/${clubId}/books/${bookId}/`;

  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const fallbackError = "Could not update book.";
    const data = await response.json().catch(() => {
      throw new Error(fallbackError);
    });
    throw new Error(data?.detail ?? fallbackError);
  }

  return await response.json();
}

export default patchClubBookStatus;
