// Derive a short, friendly first name from the signup "name" field.
// - Uses only profile.name.
// - Trims whitespace and returns the first word (e.g. "Alex" from "Alex Smith").
// - Returns null if name is missing or empty.

export function getFirstNameFromProfile(profile) {
  if (!profile?.name) return null;

  const trimmed = String(profile.name).trim();
  if (!trimmed) return null;

  const [firstWord] = trimmed.split(/\s+/);
  return firstWord || null;
}
