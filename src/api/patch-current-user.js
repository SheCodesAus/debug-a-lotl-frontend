/**
 * PATCH the current user profile (e.g. profile_picture, bio).
 * Requires auth token. Returns the updated user object.
 */
async function patchCurrentUser(token, data) {
  const baseUrl = import.meta.env.VITE_API_URL ?? "";
  const url = `${baseUrl}/users/me/`;

  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({}));
    throw new Error(errBody.detail || errBody.profile_picture?.[0] || errBody.bio?.[0] || "Failed to update profile");
  }

  return await response.json();
}

export default patchCurrentUser;
