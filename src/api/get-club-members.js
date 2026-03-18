//Get request to fetch club members (/clubs/:clubId/members/).
//Return array of members of throws with helpful error.

async function getClubMembers(clubId, token) {
    const baseUrl = import.meta.env.VITE_API_URL ?? "";
    const url = `${baseUrl}/clubs/${clubId}/members/`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "applicacion/jason",
            Authorization: `Token ${token}`,
        },
    });

    if (!response.ok) {
        const fallbackError = "Error fetching club members";
        const data = await response.json().catch(() => {
            throw new Error(fallbackError);
        });
        throw new Error(data?.detail ?? fallbackError);
    }
    return await response.json();
}

export default getClubMembers;