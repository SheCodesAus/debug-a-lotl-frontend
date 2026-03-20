// POST request to create a book club. Requires auth token.
async function postCreateClub(token, payload) {
  const baseUrl = import.meta.env.VITE_API_URL ?? "";
  const url = `${baseUrl}/clubs/`;

  // Build request body to match backend Club model (owner is set by backend from token)
  const body = {
    name: payload.name?.trim() ?? "",
    description: payload.description?.trim() ?? "",
    banner_image: payload.banner_image?.trim() ?? "",
    is_public: Boolean(payload.is_public),
    // Public clubs have no member cap (UI disables the field; enforce here too)
    max_members:
      payload.is_public
        ? null
        : payload.max_members !== "" && payload.max_members != null
          ? Number(payload.max_members)
          : null,
    // Backend expects "virtual" | "in_person" (underscore, not hyphen)
    club_meeting_mode:
      payload.club_meeting_mode === "in_person" ? "in_person" : "virtual",
    // Required by backend when club_meeting_mode is "in_person"; empty string otherwise
    club_location: payload.club_location?.trim() ?? "",
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const fallbackError = "Error creating book club";

    const data = await response.json().catch(() => {
      throw new Error(fallbackError);
    });

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

export default postCreateClub;
