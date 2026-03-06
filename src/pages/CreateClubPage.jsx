import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";
import postCreateClub from "../api/post-create-club";

function CreateClubPage() {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    banner_image: "",
    is_public: true,
    meeting_type: "virtual",
    location: "",
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

  const handleMeetingTypeChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      meeting_type: value,
      ...(value === "virtual" ? { location: "" } : {}),
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
      formData.meeting_type === "in-person" &&
      !formData.location?.trim()
    ) {
      setError("Location is required when the club meets in person.");
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
  const isInPerson = formData.meeting_type === "in-person";
  const inputClass =
    "px-3 py-2.5 rounded-[10px] border border-gray-200 bg-gray-50 text-sm outline-none transition focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30 placeholder:text-gray-400";
  const labelClass = "text-[13px] font-medium text-gray-500";

  return (
    <div className="text-center w-full">
      <h1 className="text-2xl font-semibold text-gray-700 mb-6">
        Create a book club
      </h1>

      {!isLoggedIn ? (
        <p className="text-gray-600">
          Please log in to create a book club.
        </p>
      ) : (
        <div className="w-[400px] max-w-[95vw] mx-auto my-[60px] px-12 pt-10 pb-12 bg-white rounded-3xl shadow-xl font-sans text-left">
          <h2 className="m-0 mb-6 text-xl font-bold text-gray-900">
            New book club
          </h2>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            {error && (
              <div className="px-3 py-2.5 rounded-[10px] bg-red-50 border border-red-200 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className={labelClass} htmlFor="name">
                Club name <span className="text-red-500">*</span>
              </label>
              <input
                className={inputClass}
                type="text"
                id="name"
                placeholder="e.g. Mystery Lovers"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass} htmlFor="description">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                className={`${inputClass} min-h-[80px] resize-y`}
                id="description"
                placeholder="What's your club about?"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass} htmlFor="banner_image">
                Banner image URL
              </label>
              <input
                className={inputClass}
                type="url"
                id="banner_image"
                placeholder="https://..."
                value={formData.banner_image}
                onChange={handleChange}
              />
            </div>

            <fieldset className="flex flex-col gap-2">
              <span className={labelClass}>Visibility</span>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="is_public"
                    checked={formData.is_public === true}
                    onChange={() =>
                      setFormData((prev) => ({ ...prev, is_public: true }))
                    }
                    className="text-blue-600"
                  />
                  <span className="text-sm">Public</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="is_public"
                    checked={formData.is_public === false}
                    onChange={() =>
                      setFormData((prev) => ({ ...prev, is_public: false }))
                    }
                    className="text-blue-600"
                  />
                  <span className="text-sm">Private</span>
                </label>
              </div>
            </fieldset>

            <fieldset className="flex flex-col gap-2">
              <span className={labelClass}>Meeting type</span>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="meeting_type"
                    value="in-person"
                    checked={formData.meeting_type === "in-person"}
                    onChange={(e) => handleMeetingTypeChange(e.target.value)}
                    className="text-blue-600"
                  />
                  <span className="text-sm">In person</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="meeting_type"
                    value="virtual"
                    checked={formData.meeting_type === "virtual"}
                    onChange={(e) => handleMeetingTypeChange(e.target.value)}
                    className="text-blue-600"
                  />
                  <span className="text-sm">Virtual</span>
                </label>
              </div>
            </fieldset>

            {isInPerson && (
              <div className="flex flex-col gap-1.5">
                <label className={labelClass} htmlFor="location">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  className={inputClass}
                  type="text"
                  id="location"
                  placeholder="e.g. Central Library, Meeting Room A"
                  value={formData.location}
                  onChange={handleChange}
                  required={isInPerson}
                />
              </div>
            )}

            <button
              className="mt-2.5 w-full py-3 px-4 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white text-[15px] font-semibold cursor-pointer shadow-lg shadow-blue-600/35 transition hover:-translate-y-px hover:shadow-xl hover:shadow-blue-600/45 active:translate-y-0 active:shadow-md"
              type="submit"
            >
              Create club
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default CreateClubPage;
