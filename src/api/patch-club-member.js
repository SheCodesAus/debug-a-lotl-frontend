//PATCH request to approve or reject a member (/clubs/:clubId/members/:memberId/).
//status must be 'approved' or 'rejected'.

async function patchClubMember(clubId, memberId, status, token) {
    const baseUrl = import.meta.env.VITE_API_URL ?? "";
    const url = `${baseUrl}/clubs/${clubId}/members/${memberId}/`;

    const response = await fetch(url, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ status }),
    });

    if (!response.ok) {
        const fallbackError = "Error updating member status";
        const data = await response.json().catch(() => {
            throw new Error(fallbackError);
        });
        throw new Error(data?.detail ?? fallbackError);
    }
    
    return await response.json();
}

export default patchClubMember;