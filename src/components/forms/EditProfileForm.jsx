import { useState } from "react";
import patchCurrentUser from "../../api/patch-current-user.js";

const MUTED_COLOR = "#8A7E74";
const INPUT_BORDER = "#E8E0D8";
const INPUT_BG = "#FAF6F1";
const TEXT_COLOR = "#1A1410";
const ACCENT = "#e07a5f";

function EditProfileForm({ profile, token, onSuccess, onCancel }) {
  const [profilePicture, setProfilePicture] = useState(
    profile?.profile_picture ?? "",
  );
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const labelStyle = {
    fontSize: 13,
    color: MUTED_COLOR,
    letterSpacing: "0.5px",
    marginBottom: 8,
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

  async function handleSubmit(event) {
    event.preventDefault();
    if (!token) return;

    setIsSaving(true);
    setError(null);

    try {
      const updated = await patchCurrentUser(token, {
        profile_picture: profilePicture.trim() || undefined,
        bio: bio.trim() || undefined,
      });
      if (onSuccess) onSuccess(updated);
    } catch (err) {
      setError(err.message ?? "Failed to save");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {error && (
        <div className="px-3 py-2.5 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label
          className="block uppercase font-semibold w-full"
          style={labelStyle}
          htmlFor="edit_profile_picture"
        >
          Profile picture URL
        </label>
        <input
          id="edit_profile_picture"
          type="url"
          className={inputClassName}
          style={inputStyle}
          value={profilePicture}
          onChange={(e) => {
            setProfilePicture(e.target.value);
            setError(null);
          }}
          placeholder="https://..."
        />
      </div>

      <div>
        <label
          className="block uppercase font-semibold w-full"
          style={labelStyle}
          htmlFor="edit_profile_bio"
        >
          Bio
        </label>
        <textarea
          id="edit_profile_bio"
          className={inputClassName}
          style={{ ...inputStyle, minHeight: 100, resize: "vertical" }}
          rows={4}
          value={bio}
          onChange={(e) => {
            setBio(e.target.value);
            setError(null);
          }}
          placeholder="Tell us a bit about yourself here..."
        />
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

export default EditProfileForm;
