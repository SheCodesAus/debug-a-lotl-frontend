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
    const fallbackError = `Error trying to login`;
    const data = await response.json().catch(() => {
      throw new Error(fallbackError);
    });
    const errorMessage = data?.detail ?? fallbackError;
    throw new Error(errorMessage);
  }

  return await response.json();
}

// Export the function so other parts of the app can call the login API
export default postLogin;
