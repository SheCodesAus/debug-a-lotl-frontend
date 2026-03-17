// POST request to schedule a meeting (/api/clubs/:clubId/meetings/).
// Returns the meeting data or throws with a helpful error.
async function postScheduleMeeting(clubId, meetingData, token) {
    const baseUrl = import.meta.env.VITE_API_URL ?? "";
    const url = `${baseUrl}/api/clubs/${clubId}/meetings/`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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