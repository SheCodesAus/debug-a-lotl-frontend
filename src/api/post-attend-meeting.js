// POST request to book a meeting (/meetings/:meetingId/attend/).
// Returns success message or throws with a helpful error.
async function postAttendMeeting(meetingId, token) {
    const baseUrl = import.meta.env.VITE_API_URL ?? "";
    const url = `${baseUrl}/meetings/${meetingId}/attend/`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
        },
    });

    if (!response.ok) {
        const fallbackError = "Could not book this meeting";
        const data = await response.json().catch(() => {
            throw new Error(fallbackError);
        });
        throw new Error(data?.detail ?? fallbackError);
    }

    return await response.json();
}

export default postAttendMeeting;
