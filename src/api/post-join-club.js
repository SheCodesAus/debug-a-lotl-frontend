// POST request to join a club (/api/clubs/:clubId/join/).
// Returns the membership data or throws with a helpful error.
async function postJoinClub(clubId, token) {
    const baseUrl = import.meta.env.VITE_API_URL ?? "";
    const url = `${baseUrl}/clubs/${clubId}/join/`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
        },
    });

    if (!response.ok) {
        const fallbackError = "Error trying to join club";

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

export default postJoinClub;