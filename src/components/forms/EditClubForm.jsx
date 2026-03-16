import { useState } from "react";
import patchClub from "../../api/patch-club";

const MUTED_COLOR = "#8A7E74";
const INPUT_BORDER = "#E8E0D8";
const INPUT_BG = "#FAF6F1";
const TEXT_COLOR = "#1A1410";
const ACCENT = "#C45D3E";

function EditClubForm({ club, token, onSuccess, onCancel }) {
  const [fields, setFields] = useState({
    name: club?.name ?? "",
    description: club?.description ?? "",
    banner_image: club?.banner_image ?? "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    const { id, value } = event.target;
    setFields((prev) => ({ ...prev, [id]: value }));
    setError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!token || !club?.id) return;

    setIsSaving(true);
    setError(null);

    const payload = {
      name: fields.name.trim(),
      description: fields.description.trim(),
      banner_image: fields.banner_image.trim(),
    };

    try {
      const updated = await patchClub(token, club.id, payload);
      if (onSuccess) onSuccess(updated);
    } catch (err) {
      setError(err.message || "Could not update club.");
    } finally {
      setIsSaving(false);
    }
  };

  const labelStyle = {
    fontSize: 13,
    color: MUTED_COLOR,
    letterSpacing: "0.5px",
    marginBottom: 8,
  };

  const inputStyle = {
    padding: "10px 14px",
    borderRadius: 8,
    border: `1.5px solid ${INPUT_BORDER}`,
    backgroundColor: INPUT_BG,
    fontSize: 14,
    color: TEXT_COLOR,
  };

  const inputClassName =
    "w-full rounded-lg outline-none box-border transition focus:border-[#1A1410]/40 focus:ring-1 focus:ring-[#1A1410]/20 text-left";

  return (
    <form
      className="rounded-2xl bg-white p-6 shadow-sm space-y-4"
      style={{ boxShadow: "rgba(26, 20, 16, 0.06) 0px 4px 20px" }}
      onSubmit={handleSubmit}
    >
      <h2
        className="text-xs font-semibold uppercase tracking-wider m-0 mb-2"
        style={{ color: MUTED_COLOR, letterSpacing: "0.5px" }}
      >
        Edit club details
      </h2>

      {error && (
        <div className="px-3 py-2.5 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-3">
        <div>
          <label
            className="block uppercase font-semibold w-full"
            style={labelStyle}
            htmlFor="name"
          >
            Club name
          </label>
          <input
            id="name"
            type="text"
            className={inputClassName}
            style={inputStyle}
            value={fields.name}
            onChange={handleChange}
            placeholder="Bookworms of Bristol"
          />
        </div>

        <div>
          <label
            className="block uppercase font-semibold w-full"
            style={labelStyle}
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            id="description"
            className={inputClassName}
            style={{ ...inputStyle, minHeight: 80, resize: "vertical" }}
            value={fields.description}
            onChange={handleChange}
            placeholder="What this club is about, how often you meet..."
            rows={3}
          />
        </div>

        <div>
          <label
            className="block uppercase font-semibold w-full"
            style={labelStyle}
            htmlFor="banner_image"
          >
            Banner image URL
          </label>
          <input
            id="banner_image"
            type="url"
            className={inputClassName}
            style={inputStyle}
            value={fields.banner_image}
            onChange={handleChange}
            placeholder="https://example.com/your-banner.jpg"
          />
          <p className="text-xs mt-1" style={{ color: MUTED_COLOR }}>
            This image appears behind the club title at the top of the page.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 hover:bg-gray-50"
            style={{ color: MUTED_COLOR }}
            disabled={isSaving}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 rounded-lg text-sm font-semibold text-white cursor-pointer transition hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ backgroundColor: ACCENT }}
          disabled={isSaving}
        >
          {isSaving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}

export default EditClubForm;
