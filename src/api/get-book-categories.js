// Curated book categories from backend (aligned with Google Books-style labels).
async function getBookCategories() {
  const baseUrl = (import.meta.env.VITE_API_URL ?? "").trim();
  const url = `${baseUrl.replace(/\/$/, "")}/books/categories/`;

  const response = await fetch(url, { method: "GET" });

  if (!response.ok) {
    const fallbackError = "Could not load genres.";
    const data = await response.json().catch(() => ({}));
    const message = data?.error ?? data?.detail ?? fallbackError;
    throw new Error(typeof message === "string" ? message : fallbackError);
  }

  const data = await response.json();
  const categories = Array.isArray(data?.categories) ? data.categories : [];
  const maxSelect =
    typeof data?.max_select === "number" && data.max_select > 0
      ? data.max_select
      : 10;

  return { categories, maxSelect };
}

export default getBookCategories;
