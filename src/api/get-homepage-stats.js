/**
 * Fetches homepage stats from the API (book clubs, active readers, books read, curated genres).
 * No auth required.
 * @returns {Promise<{ book_clubs: number, active_readers: number, books_read_together: number, curated_genres: number }>}
 */
async function getHomepageStats() {
  const baseUrl = import.meta.env.VITE_API_URL ?? "";
  const url = `${baseUrl}/stats/`;

  const response = await fetch(url, { method: "GET" });

  if (!response.ok) {
    throw new Error("Failed to load stats");
  }

  return await response.json();
}

export default getHomepageStats;
