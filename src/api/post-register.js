// POST request to backend user registration endpoint (/users/).
// Returns the created user data or throws with a helpful error (including validation messages).
// profile_picture and bio are optional.
// Backend also requires a separate "name" field, so we pass that explicitly.
async function postRegister({ username, name, email, password, profile_picture, bio }) {
  const baseUrl = import.meta.env.VITE_API_URL ?? "";
  const url = `${baseUrl}/users/`;

  const body = {
    username,
    name,
    email: email || "",
    password,
  };
  if (profile_picture != null && profile_picture.trim() !== "") body.profile_picture = profile_picture.trim();
  if (bio != null && bio.trim() !== "") body.bio = bio.trim();

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const fallbackError = "Error trying to register";

    const data = await response.json().catch(() => {
      throw new Error(fallbackError);
    });

    // DRF validation errors are an object like { username: ["..."], email: ["..."] }
    if (data && typeof data === "object" && !Array.isArray(data)) {
      const messages = Object.entries(data)
        .flatMap(([field, list]) => (Array.isArray(list) ? list : [list]))
        .filter(Boolean);
      if (messages.length) {
        throw new Error(messages.join(" "));
      }
    }

    throw new Error(data?.detail ?? fallbackError);
  }

  return await response.json();
}

export default postRegister;
