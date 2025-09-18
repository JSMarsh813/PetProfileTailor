// utils/authorizeUser.js
import { getSessionForApis } from "./getSessionForApis";
/**
 * Checks if the current session exists and matches the resource owner
 * @param {Object} params
 * @param {Object} params.req - Next.js request
 * @param {Object} params.res - Next.js response
 * @param {string|Object} params.resourceCreatorId - ID of the resource owner
 * @param {string} [params.resourceName] - Optional, used for error messages
 * @returns {Promise<Object|null>} session object if authorized, or null if unauthorized
 */
export async function checkOwnership({ req, res, resourceCreatorId }) {
  const session = await getSessionForApis({ req, res });

  if (!session) {
    return null;
  }

  if (resourceCreatorId.toString() !== session.user.id) {
    res.status(403).json({
      message: `Only the creator of this content is authorized to change it`,
    });
    return null;
  }

  return session;
}
