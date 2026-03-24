import EditProfileForm from "../forms/EditProfileForm.jsx";

const MUTED_COLOR = "#8A7E74";

function EditProfileModal({ profile, token, onClose, onSuccess }) {
  function handleBackdrop(e) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(26, 20, 16, 0.5)" }}
      onClick={handleBackdrop}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-profile-modal-title"
    >
      <div
        className="relative w-full max-w-lg rounded-2xl bg-white shadow-xl overflow-y-auto"
        style={{ maxHeight: "90vh" }}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <h2
            id="edit-profile-modal-title"
            className="text-sm font-semibold uppercase tracking-wider"
            style={{ color: "#1A1410" }}
          >
            Edit profile
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors rounded-lg p-1 hover:bg-gray-100"
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M13.5 4.5L4.5 13.5M4.5 4.5l9 9"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5">
          <EditProfileForm
            profile={profile}
            token={token}
            onCancel={onClose}
            onSuccess={(updated) => {
              onSuccess(updated);
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default EditProfileModal;
