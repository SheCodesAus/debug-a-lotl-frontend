/**
 * Updates a meeting (title, description, date, time, type, location). Owner only.
 * Uses backend endpoint PATCH /clubs/:clubId/meetings/:meetingId/
 * @param {string} token - Auth token (required).
 * @param {number|string} clubId - Club id.
 * @param {number|string} meetingId - Meeting id.
 * @param {Object} payload - Fields to update.
 * @returns {Promise<Object>} Updated meeting object.
 */
async function patchClubMeeting(token, clubId, meetingId, payload) {
    const baseUrl = import.meta.env.VITE_API_URL ?? "";
    const url = `${baseUrl}/clubs/${clubId}/meetings/${meetingId}/`;

    const response = await fetch(url, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const fallbackError = "Could not update meeting.";
        const data = await response.json().catch(() => {
            throw new Error(fallbackError);
        });
        throw new Error(data?.detail ?? fallbackError);
    }

    return await response.json();
}

export default patchClubMeeting;
