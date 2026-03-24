/**
 * Deletes a meeting, or soft-cancels when it has bookings. Owner only.
 * Uses backend endpoint DELETE /clubs/:clubId/meetings/:meetingId/
 * @param {string} token - Auth token (required).
 * @param {number|string} clubId - Club id.
 * @param {number|string} meetingId - Meeting id.
 * @returns {Promise<{ removed: true } | { removed: false, meeting: object }>}
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

    if (response.status === 204) {
        return { removed: true };
    }

    const fallbackError = "Could not delete meeting.";
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data?.detail ?? fallbackError);
    }

    // 200: meeting was cancelled (had bookings) — body includes `meeting`
    return { removed: false, meeting: data.meeting };
}

export default deleteClubMeeting;
