/**
 * Fetches a single club by id using the clubs list API (no backend detail endpoint).
 * Same visibility as list: public clubs, or owner/member when authenticated.
 * @param {string} clubId - Club id from the URL.
 * @param {string|null} token - Optional auth token (e.g. from useAuth).
 * @returns {Promise<Object>} Club object.
 */
import getClubs from "./get-clubs";

async function getClub(clubId, token = null) {
  const clubs = await getClubs(token);
  const id = Number(clubId);
  const club = Array.isArray(clubs)
    ? clubs.find((c) => c.id === id)
    : null;
  if (!club) {
    throw new Error("Club not found.");
  }
  return club;
}

export default getClub;
