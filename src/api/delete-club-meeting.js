/**
 * Deletes a meeting. Owner only.
 * Uses backend endpoint DELETE /clubs/:clubId/meetings/:meetingId/
 * @param {string} token - Auth token (required).
 * @param {number|string} clubId - Club id.
 * @param {number|string} meetingId - Meeting id.
 * @returns {Promise<void>}
 */
async function deleteClubMeeting(token, clubId, meetingId) {
    const baseUrl = import.meta.env.VITE_API_URL ?? "";
    const url = `${baseUrl}/clubs/${clubId}/meetings/${meetingId}/`;

    const response = await fetch(url, {
        method: "DELETE",
        headers: {
            Authorization: `Token ${token}`,
        },
    });

    if (!response.ok) {
        const fallbackError = "Could not delete meeting.";
        const data = await response.json().catch(() => {
            throw new Error(fallbackError);
        });
        throw new Error(data?.detail ?? fallbackError);
    }
}

export default deleteClubMeeting;
