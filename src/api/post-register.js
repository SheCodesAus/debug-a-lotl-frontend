// POST request to backend user registration endpoint (/users/).
// Returns the created user data or throws with a helpful error (including validation messages).
async function postRegister({ username, email, password }) {
  const baseUrl = import.meta.env.VITE_API_URL ?? "";
  const url = `${baseUrl}/users/`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      email: email || "",
      password,
    }),
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
