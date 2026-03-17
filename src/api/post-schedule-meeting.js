// POST request to schedule a meeting (/api/clubs/:clubId/meetings/).
// Returns the meeting data or throws with a helpful error.
async function postScheduleMeeting(clubId, meetingData, token) {
    const baseUrl = import.meta.env.VITE_API_URL ?? "";
    // Backend meeting endpoints are mounted at `/clubs/<club_id>/meetings/`
    // (no `/api` prefix), matching the rest of the club APIs.
    const url = `${baseUrl}/clubs/${clubId}/meetings/`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            // DRF token auth expects this exact prefix, consistent with other calls.
            Authorization: `Token ${token}`,
        },
        body: JSON.stringify(meetingData),
    });

    if (!response.ok) {
        const fallbackError = "Error trying to schedule meeting";

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

export default postScheduleMeeting;