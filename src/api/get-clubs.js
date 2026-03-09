// GET list of clubs. Optional token: when provided, returns public clubs + clubs user owns/is member of.
async function getClubs(token = null) {
  const baseUrl = import.meta.env.VITE_API_URL ?? "";
  const url = `${baseUrl}/clubs/`;

  const headers = {};
  if (token) {
    headers.Authorization = `Token ${token}`;
  }

  const response = await fetch(url, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    throw new Error("Failed to load clubs");
  }

  return await response.json();
}

export default getClubs;
