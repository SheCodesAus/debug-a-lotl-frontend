// Makes a POST request to your backend login endpoint and
// returns either the parsed JSON response or throws a helpful error.
async function postLogin(username, password) {
  // Build the full API URL using the base URL from Vite environment variables
  const url = `${import.meta.env.VITE_API_URL}/api-token-auth/`;

  // Send the username and password to the server as JSON using the Fetch API
  const response = await fetch(url, {
    method: "POST",
    headers: {
      // Tell the server that the request body contains JSON
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  });

  // If the HTTP status code is not in the 200–299 range, handle it as an error
  if (!response.ok) {
    const fallbackError = `Error trying to login`;

    // Try to read the error details from the response body.
    // If parsing fails (e.g. the body is empty or not JSON), throw a generic error instead.
    const data = await response.json().catch(() => {
      throw new Error(fallbackError);
    });

    // Prefer an error message from the backend (`detail`), otherwise use the generic one.
    const errorMessage = data?.detail ?? fallbackError;
    throw new Error(errorMessage);
  }

  // For successful responses, parse and return the JSON data (e.g. auth token)
  return await response.json();
}

// Export the function so other parts of the app can call the login API
export default postLogin;
