const FALLBACK_LOGIN_ERROR = "Error trying to login";

/**
 * Pull a human-readable message from DRF / API error JSON bodies.
 */
function messageFromErrorBody(data) {
  if (!data || typeof data !== "object") return null;

  const { detail, non_field_errors: nfe } = data;

  if (typeof detail === "string" && detail.trim()) return detail;
  if (Array.isArray(detail)) {
    const first = detail.find((x) => typeof x === "string" && x.trim());
    if (first) return first;
  }

  if (Array.isArray(nfe) && nfe.length) {
    const first = nfe.find((x) => typeof x === "string" && x.trim());
    if (first) return first;
  }

  for (const value of Object.values(data)) {
    if (Array.isArray(value) && value.length) {
      const first = value.find((x) => typeof x === "string" && x.trim());
      if (first) return first;
    }
  }

  return null;
}

// Makes a POST request to your backend login endpoint and
// returns either the parsed JSON response or throws a helpful error.
async function postLogin(username, password) {
  // Build the full API URL using the base URL from Vite environment variables
  const baseUrl = import.meta.env.VITE_API_URL ?? "";
  const url = `${baseUrl}/api-token-auth/`;

  let response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });
  } catch (err) {
    const baseUrl = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";
    throw new Error(
      `Could not connect to the server. Make sure the backend is running at ${baseUrl} (e.g. \`python manage.py runserver\` in the backend project).`
    );
  }

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    const errorMessage =
      messageFromErrorBody(data) ?? FALLBACK_LOGIN_ERROR;
    throw new Error(errorMessage);
  }

  return await response.json();
}

// Export the function so other parts of the app can call the login API
export default postLogin;
