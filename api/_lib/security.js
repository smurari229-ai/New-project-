const MAX_CUSTOM_API_KEY_LENGTH = 256;

const CONTROL_CHAR_PATTERN = /[\u0000-\u001F\u007F]/;

export function sanitizeCustomApiKey(value) {
  if (value === undefined || value === null) return null;
  if (typeof value !== "string") return null;

  const key = value.trim();
  if (!key || key.length > MAX_CUSTOM_API_KEY_LENGTH) return null;
  if (CONTROL_CHAR_PATTERN.test(key)) return null;

  return key;
}

export function validateBoundedString(value, maxLength, label) {
  if (typeof value !== "string" || !value.trim()) {
    return `${label} is required`;
  }
  if (value.length > maxLength) {
    return `${label} exceeds the ${maxLength.toLocaleString()} character limit`;
  }
  return null;
}

export { MAX_CUSTOM_API_KEY_LENGTH };
