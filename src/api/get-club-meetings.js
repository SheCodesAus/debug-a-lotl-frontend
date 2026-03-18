// GET request to fetch club meetings (/clubs/:clubId/meetings/).
// Returns array of meetings or throws with a helpful error.
async function getClubMeetings(clubId, token) {
    const baseUrl = import.meta.env.VITE_API_URL ?? "";
    const url = `${baseUrl}/clubs/${clubId}/meetings/`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
        },
    });

    if (!response.ok) {
        const fallbackError = "Error fetching club meetings";
        const data = await response.json().catch(() => {
            throw new Error(fallbackError);
        });
        throw new Error(data?.detail ?? fallbackError);
    }

    return await response.json();
}

export default getClubMeetings;