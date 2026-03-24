/**
 * Leave a club as a member only
 * Uses backend endpoint DELETE /clubs/:id/join/
 * @param {string} token - Auth token (required).
 * @param {number|string} clubId - Club id.
 * @returns {Promise<void>}
 */
async function leaveClub(token, clubId) {
    const baseUrl = import.meta.env.VITE_API_URL ?? "";
    const url = `${baseUrl}/clubs/${clubId}/join/`;

    const response = await fetch(url, {
        method: "DELETE",
        headers: {
            Authorization: `Token ${token}`,
        },
    });

    if (!response.ok) {
        const fallbackError = "You could not leave this club.";
        const data = await response.json().catch(() => {
            throw new Error(fallbackError);
        });
        throw new Error(data?.detail ?? fallbackError);
    }
}

export default leaveClub;
