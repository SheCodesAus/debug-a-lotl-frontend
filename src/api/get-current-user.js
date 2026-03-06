// GET the current user (requires token). Used when we have a token but no username in state.
async function getCurrentUser(token) {
  const baseUrl = import.meta.env.VITE_API_URL ?? "";
  const url = `${baseUrl}/users/me/`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Token ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to load user");
  }

  return await response.json();
}

export default getCurrentUser;
