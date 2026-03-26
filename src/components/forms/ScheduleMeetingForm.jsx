import { useState } from "react";
import { useAuth } from "../../hooks/use-auth";
import postScheduleMeeting from "../../api/post-schedule-meeting";
import InlineSpinner from "../ui/InlineSpinner.jsx";

const MUTED_COLOR = "#8A7E74";
const INPUT_BORDER = "#E8E0D8";
const INPUT_BG = "#FAF6F1";
const TEXT_COLOR = "#1A1410";

function ScheduleMeetingForm({ clubId, onSuccess, buttonColor = "#C45D3E" }) {
    const { auth } = useAuth();
    const [fields, setFields] = useState({
        title: "",
        description: "",
        meeting_date: "",
        start_time: "",
        end_time: "",
        meeting_type: "virtual",
        location: "",
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        const { id, value } = event.target;
        setFields((prev) => ({ ...prev, [id]: value }));
        setError(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);

        if (!fields.title || !fields.meeting_date || !fields.start_time || !fields.end_time) {
            setError("Title, date, start time and end time are required.");
            return;
        }

        if (fields.meeting_type === "in_person" && !fields.location.trim()) {
            setError("Location is required for in-person meetings.");
            return;
        }

        setLoading(true);
        try {
            const response = await postScheduleMeeting(clubId, fields, auth.token);
            if (onSuccess) onSuccess(response);
        } catch (err) {
            setError(err.message || "Could not schedule meeting. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const labelStyle = {
        fontSize: 13,
        color: MUTED_COLOR,
        letterSpacing: "0.5px",
        marginBottom: 20,
    };

    const inputStyle = {
        padding: "12px 16px",
        borderRadius: 8,
        border: `1.5px solid ${INPUT_BORDER}`,
        backgroundColor: INPUT_BG,
        fontSize: 14,
        color: TEXT_COLOR,
    };

    const inputClassName =
        "w-full rounded-lg outline-none box-border transition focus:border-[#1A1410]/40 focus:ring-1 focus:ring-[#1A1410]/20 text-left";

    return (
        <div className="w-full font-source-sans text-left">
            <form className="flex flex-col w-full" style={{ gap: 16 }} onSubmit={handleSubmit}>
                {error && (
                    <div className="px-3 py-2.5 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700 mb-2">
                        {error}
                    </div>
                )}

                <div className="w-full">
                    <label className="block uppercase font-semibold w-full" style={labelStyle} htmlFor="title">
                        Meeting title
                    </label>
                    <input
                        className={inputClassName}
                        style={inputStyle}
                        type="text"
                        id="title"
                        placeholder="e.g. Chapter 5 discussion"
                        value={fields.title}
                        onChange={handleChange}
                    />
                </div>

                <div className="w-full">
                    <label className="block uppercase font-semibold w-full" style={labelStyle} htmlFor="description">
                        Description (optional)
                    </label>
                    <textarea
                        className={inputClassName}
                        style={{ ...inputStyle, resize: "vertical", minHeight: 80 }}
                        id="description"
                        placeholder="What will you discuss?"
                        value={fields.description}
                        onChange={handleChange}
                    />
                </div>

                <div className="w-full">
                    <label className="block uppercase font-semibold w-full" style={labelStyle} htmlFor="meeting_date">
                        Date
                    </label>
                    <input
                        className={inputClassName}
                        style={inputStyle}
                        type="date"
                        id="meeting_date"
                        value={fields.meeting_date}
                        onChange={handleChange}
                    />
                </div>

                <div className="flex w-full" style={{ gap: 12 }}>
                    <div className="flex-1">
                        <label className="block uppercase font-semibold w-full" style={labelStyle} htmlFor="start_time">
                            Start time
                        </label>
                        <input
                            className={inputClassName}
                            style={inputStyle}
                            type="time"
                            id="start_time"
                            value={fields.start_time}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block uppercase font-semibold w-full" style={labelStyle} htmlFor="end_time">
                            End time
                        </label>
                        <input
                            className={inputClassName}
                            style={inputStyle}
                            type="time"
                            id="end_time"
                            value={fields.end_time}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="w-full">
                    <label className="block uppercase font-semibold w-full" style={labelStyle} htmlFor="meeting_type">
                        Meeting type
                    </label>
                    <select
                        className={inputClassName}
                        style={inputStyle}
                        id="meeting_type"
                        value={fields.meeting_type}
                        onChange={handleChange}
                    >
                        <option value="virtual">Virtual</option>
                        <option value="in_person">In person</option>
                    </select>
                </div>

                {fields.meeting_type === "in_person" && (
                    <div className="w-full">
                        <label className="block uppercase font-semibold w-full" style={labelStyle} htmlFor="location">
                            Location
                        </label>
                        <input
                            className={inputClassName}
                            style={inputStyle}
                            type="text"
                            id="location"
                            placeholder="e.g. Central Library, Room 2"
                            value={fields.location}
                            onChange={handleChange}
                        />
                    </div>
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
                    type="submit"
                    disabled={loading}
                    aria-busy={loading}
                >
                    {loading ? <InlineSpinner size={18} /> : null}
                    Schedule meeting
                </button>
            </form>
        </div>
    );
}

export default ScheduleMeetingForm;