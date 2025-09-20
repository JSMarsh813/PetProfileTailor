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
export async function checkIfAdmin({ req, res }) {
  const { ok, session } = await getSessionForApis({ req, res });

  if (!session) {
    res.status(401).json({ message: "Not authenticated" });
    return { ok: false };
  }

  console.log("session in checkAdmin", session);
  const { role, status } = session.user || {};

  const isAdmin = role === "admin" && status === "active";

  console.log("isAdmin", isAdmin, "role", role, "status", status);

  if (isAdmin) {
    res.status(403).json({
      message: `Unauthorized, you must be an admin to complete this action"`,
    });
    return { ok: false };
  }

  return { ok: true, session };
}
