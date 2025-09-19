// utils/validateContentType.js
export const validContentTypes = ["names", "description"];

/**
 * Validates that the given contentType is allowed.
 * Throws an error if invalid.
 * @param {string} contentType
 * @param {string} [paramName] - optional name for error message
 */
export function checkIfValidContentType(contentType) {
  if (!validContentTypes.includes(contentType)) {
    const error = new Error(`Invalid contentType: ${contentType}`);
    error.status = 400; // optional, can be used in API
    throw error;
  }
  return true;
}
