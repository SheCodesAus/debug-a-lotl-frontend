import { useState } from "react";
import { useAuth } from "../../hooks/use-auth";
import postJoinClub from "../../api/post-join-club";
import InlineSpinner from "../ui/InlineSpinner.jsx";

const MUTED_COLOR = "#8A7E74";
const INPUT_BORDER = "#E8E0D8";
const INPUT_BG = "#FAF6F1";

function JoinClubForm({ clubId, isPrivate, onSuccess, buttonColor = "#C45D3E" }) {
    const { auth } = useAuth();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleJoin = async () => {
        setError(null);
        setSuccessMessage(null);
        setLoading(true);
        try {
            const response = await postJoinClub(clubId, auth.token);

            if (response.status === "pending") {
                setSuccessMessage("Your join request has been sent and is waiting for approval.");
            } else if (response.status === "approved") {
                setSuccessMessage("You have successfully joined the club!");
            } else {
                setSuccessMessage("Your membership has been updated.");
            }

            if (onSuccess) onSuccess(response);
        } catch (err) {
            setError(err.message || "Could not join club. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Once we have a success message, show it instead of the button
    if (successMessage) {
        return (
            <div
                className="px-3 py-2.5 rounded-lg text-sm"
                style={{
                    backgroundColor: "#f0f7f0",
                    border: "1.5px solid #b6d9b6",
                    color: "#3a6b3a",
                }}
            >
                {successMessage}
            </div>
        );
    }

    return (
        <div className="w-full font-source-sans text-left">
            <div className="flex flex-col w-full" style={{ gap: 16 }}>
                {error && (
                    <div className="px-3 py-2.5 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700 mb-2">
                        {error}
                    </div>
                )}
                {isPrivate && (
                    <p
                        className="m-0 px-3 py-2.5 rounded-lg"
                        style={{
                            fontSize: 13,
                            color: MUTED_COLOR,
                            backgroundColor: INPUT_BG,
                            border: `1.5px solid ${INPUT_BORDER}`,
                        }}
                    >
                        This is a private club. Your request will be reviewed by the owner before you can join.
                    </p>
                )}
                <button
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg text-white font-semibold cursor-pointer transition hover:opacity-90 min-h-[46px]"
                    style={{
                        padding: 12,
                        borderRadius: 8,
                        backgroundColor: loading ? MUTED_COLOR : buttonColor,
                        fontSize: 15,
                        marginTop: 8,
                    }}
                    onClick={handleJoin}
                    disabled={loading}
                    aria-busy={loading}
                >
                    {loading ? <InlineSpinner size={18} /> : null}
                    {isPrivate ? "Request to join" : "Join club"}
                </button>
            </div>
        </div>
    );
}

export default JoinClubForm;
