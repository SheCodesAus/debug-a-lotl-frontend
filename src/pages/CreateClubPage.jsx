import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";
import postCreateClub from "../api/post-create-club";

const ACCENT = "#C45D3E";
const MUTED_COLOR = "#8A7E74";
const INPUT_BORDER = "#E8E0D8";
const INPUT_BG = "#FAF6F1";
const TEXT_COLOR = "#1A1410";

function CreateClubPage() {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    banner_image: "",
    is_public: true,
    max_members: "",
    club_meeting_mode: "virtual",
    club_location: "",
  });
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    const { id, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [id]:
        type === "checkbox"
          ? checked
          : type === "radio"
            ? value
            : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(null);

    if (!formData.name?.trim()) {
      setError("Club name is required.");
      return;
    }

    if (!formData.description?.trim()) {
      setError("Description is required.");
      return;
    }

    if (
      formData.club_meeting_mode === "in_person" &&
      !formData.club_location?.trim()
    ) {
      setError("Location is required for in-person clubs.");
      return;
    }

    if (!auth?.token) {
      setError("You must be logged in to create a book club.");
      return;
    }

    postCreateClub(auth.token, formData)
      .then(() => {
        navigate("/clubs");
      })
      .catch((err) => {
        setError(err.message || "Failed to create book club. Please try again.");
      });
  };

  const isLoggedIn = Boolean(auth?.token);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/register", { replace: true });
    }
  }, [isLoggedIn, navigate]);

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

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div
      className="min-h-full flex flex-col items-center px-4 py-12 font-source-sans"
      style={{ backgroundColor: "#fffaf6" }}
    >
      <div className="w-full max-w-[520px] flex flex-col">
        <h1
          className="font-playfair font-bold text-[26px] text-left w-full m-0 mb-8"
          style={{ color: TEXT_COLOR }}
        >
          Create a New Club
        </h1>

        <div
          className="w-full rounded-2xl bg-white flex flex-col"
        style={{
          padding: 56,
          boxShadow: "rgba(26, 20, 16, 0.08) 0px 8px 32px",
        }}
      >
        <form
          className="flex flex-col w-full text-left"
          style={{ gap: 16 }}
          onSubmit={handleSubmit}
        >
          {error && (
            <div className="px-3 py-2.5 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="w-full">
            <label
              className="block uppercase font-semibold w-full"
              style={labelStyle}
              htmlFor="name"
            >
              Club name <span className="text-red-500">*</span>
            </label>
            <input
              className={inputClassName}
              style={inputStyle}
              type="text"
              id="name"
              placeholder="e.g. The Night Owls Book Club"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="w-full">
            <label
              className="block uppercase font-semibold w-full"
              style={labelStyle}
              htmlFor="description"
            >
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              className={`${inputClassName} min-h-[100px] resize-y`}
              style={inputStyle}
              id="description"
              placeholder="What is this club about?"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              required
            />
          </div>

          <div className="w-full">
            <label
              className="block uppercase font-semibold w-full"
              style={labelStyle}
              htmlFor="banner_image"
            >
              Banner image URL
            </label>
            <input
              className={inputClassName}
              style={inputStyle}
              type="url"
              id="banner_image"
              placeholder="https://..."
              value={formData.banner_image}
              onChange={handleChange}
            />
          </div>

          <fieldset className="w-full flex flex-col">
            <span
              className="block uppercase font-semibold w-full"
              style={labelStyle}
            >
              Visibility
            </span>
            <div className="flex gap-3 flex-wrap">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, is_public: false }))
                }
                className="flex-1 min-w-[140px] py-3 px-4 rounded-lg border-2 text-left font-medium text-sm transition"
                style={
                  formData.is_public === false
                    ? {
                        backgroundColor: INPUT_BG,
                        borderColor: ACCENT,
                        color: ACCENT,
                      }
                    : {
                        backgroundColor: "#fff",
                        borderColor: INPUT_BORDER,
                        color: TEXT_COLOR,
                      }
                }
              >
                Private (Request to Join)
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    is_public: true,
                    max_members: "",
                  }))
                }
                className="flex-1 min-w-[140px] py-3 px-4 rounded-lg border-2 text-left font-medium text-sm transition"
                style={
                  formData.is_public === true
                    ? {
                        backgroundColor: INPUT_BG,
                        borderColor: ACCENT,
                        color: ACCENT,
                      }
                    : {
                        backgroundColor: "#fff",
                        borderColor: INPUT_BORDER,
                        color: TEXT_COLOR,
                      }
                }
              >
                Public (Anyone Can Join)
              </button>
            </div>
          </fieldset>

          <fieldset className="w-full flex flex-col">
            <span
              className="block uppercase font-semibold w-full"
              style={labelStyle}
            >
              Attendance
            </span>
            <div className="flex gap-3 flex-wrap">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    club_meeting_mode: "virtual",
                    club_location: "",
                  }))
                }
                className="flex-1 min-w-[140px] py-3 px-4 rounded-lg border-2 text-left font-medium text-sm transition"
                style={
                  formData.club_meeting_mode !== "in_person"
                    ? {
                        backgroundColor: INPUT_BG,
                        borderColor: ACCENT,
                        color: ACCENT,
                      }
                    : {
                        backgroundColor: "#fff",
                        borderColor: INPUT_BORDER,
                        color: TEXT_COLOR,
                      }
                }
              >
                Virtual
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    club_meeting_mode: "in_person",
                  }))
                }
                className="flex-1 min-w-[140px] py-3 px-4 rounded-lg border-2 text-left font-medium text-sm transition"
                style={
                  formData.club_meeting_mode === "in_person"
                    ? {
                        backgroundColor: INPUT_BG,
                        borderColor: ACCENT,
                        color: ACCENT,
                      }
                    : {
                        backgroundColor: "#fff",
                        borderColor: INPUT_BORDER,
                        color: TEXT_COLOR,
                      }
                }
              >
                In person
              </button>
            </div>
          </fieldset>

          {formData.club_meeting_mode === "in_person" && (
            <div className="w-full">
              <label
                className="block uppercase font-semibold w-full"
                style={labelStyle}
                htmlFor="club_location"
              >
                Default meeting location <span className="text-red-500">*</span>
              </label>
              <input
                className={inputClassName}
                style={inputStyle}
                type="text"
                id="club_location"
                placeholder="e.g. Bristol Central Library"
                value={formData.club_location}
                onChange={handleChange}
              />
            </div>
          )}

          <div className="w-full">
            <label
              className="block uppercase font-semibold w-full"
              style={{
                ...labelStyle,
                color: formData.is_public ? "#b5aba3" : MUTED_COLOR,
              }}
              htmlFor="max_members"
            >
              Max members (optional)
            </label>
            <input
              className={inputClassName}
              style={{
                ...inputStyle,
                ...(formData.is_public
                  ? {
                      backgroundColor: "#EFEAE4",
                      borderColor: "#DDD5CC",
                      color: "#9A9088",
                      cursor: "not-allowed",
                    }
                  : {}),
              }}
              type="number"
              id="max_members"
              min={1}
              placeholder="No limit"
              value={formData.is_public ? "" : formData.max_members}
              onChange={handleChange}
              disabled={formData.is_public}
              aria-disabled={formData.is_public}
            />
            {formData.is_public && (
              <p className="text-xs mt-1.5 m-0" style={{ color: MUTED_COLOR }}>
                Public clubs don’t use a member cap—make the club private to set a
                limit.
              </p>
            )}
          </div>

          <button
            className="w-full rounded-lg text-white font-semibold cursor-pointer transition hover:opacity-90 mt-2"
            style={{
              padding: 12,
              borderRadius: 8,
              backgroundColor: ACCENT,
              fontSize: 15,
            }}
            type="submit"
          >
            Create Club
          </button>
        </form>
        </div>
      </div>
    </div>
  );
}

export default CreateClubPage;
