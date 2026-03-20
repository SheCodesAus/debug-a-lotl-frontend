/**
 * GET /meetings/booked/ — upcoming meetings the current user has booked.
 * @param {string} token - Auth token (required).
 * @returns {Promise<Array>} List of meeting objects with nested `club: { id, name }`.
 */
async function getMyBookedMeetings(token) {
  const baseUrl = import.meta.env.VITE_API_URL ?? "";
  const url = `${baseUrl}/meetings/booked/`;

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
    const fallbackError = "Failed to load your booked meetings";
    const data = await response.json().catch(() => null);
    throw new Error(data?.detail ?? fallbackError);
  }

  return await response.json();
}

export default getMyBookedMeetings;
