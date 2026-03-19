/**
 * Fetches homepage stats from the API.
 * No auth required.
 * @returns {Promise<{ active_readers: number, total_books_read: number }>}
 */
async function getHomepageStats() {
  const baseUrl = import.meta.env.VITE_API_URL ?? "";
  const url = `${baseUrl}/stats/home/`;

  const response = await fetch(url, { method: "GET" });

  if (!response.ok) {
    throw new Error("Failed to load stats");
  }

  return await response.json();
}

export default getHomepageStats;
