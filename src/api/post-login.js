// Makes a POST request to your backend login endpoint and
// returns either the parsed JSON response or throws a helpful error.
async function postLogin(username, password) {
  // Build the full API URL using the base URL from Vite environment variables
  const baseUrl = import.meta.env.VITE_API_URL ?? "";
  const url = `${baseUrl}/api-token-auth/`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  });

  if (!response.ok) {
    const fallbackError = `Error trying to login`;

    const data = await response.json().catch(() => {
      throw new Error(fallbackError);
    });

    const errorMessage = data?.detail ?? fallbackError;
    throw new Error(errorMessage);
  }

  return await response.json();
}

export default postLogin;
