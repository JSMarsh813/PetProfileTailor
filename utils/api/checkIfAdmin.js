// utils/api/checkIfAdmin.js
import { getSessionForApis } from "./getSessionForApis";

/**
 * Checks if the current session exists and matches the resource owner
 * Works with App Router request objects
 *
 * @param {Object} params
 * @param {Request} params.req - Next.js request (App Router)
 * @returns {Promise<{ ok: boolean, session?: Object, response?: Response }>}
 */
export async function checkIfAdmin({ req }) {
  const { ok, session } = await getSessionForApis();

  if (!session) {
    return {
      ok: false,
      response: Response.json(
        { message: "Not authenticated" },
        { status: 401 },
      ),
    };
  }

  // console.log("session in checkAdmin", session);
  const { role, status } = session.user || {};
  const isAdmin = role === "admin" && status === "active";

  // console.log("isAdmin", isAdmin, "role", role, "status", status);

  if (!isAdmin) {
    return {
      ok: false,
      response: Response.json(
        {
          message: "Unauthorized, you must be an admin to complete this action",
        },
        { status: 403 },
      ),
    };
  }

  return { ok: true, session };
}

// import { getSessionForApis } from "./getSessionForApis";

// /**
//  * Checks if the current session exists and matches the resource owner
//  * @param {Object} params
//  * @param {Object} params.req - Next.js request
//  * @param {Object} params.res - Next.js response
//  * @param {string|Object} params.resourceCreatorId - ID of the resource owner
//  * @param {string} [params.resourceName] - Optional, used for error messages
//  * @returns {Promise<Object|null>} session object if authorized, or null if unauthorized
//  */
// export async function checkIfAdmin({ req, res }) {
//   const { ok, session } = await getSessionForApis({ req, res });

//   if (!session) {
//     res.status(401).json({ message: "Not authenticated" });
//     return { ok: false };
//   }

//   console.log("session in checkAdmin", session);
//   const { role, status } = session.user || {};

//   const isAdmin = role === "admin" && status === "active";

//   console.log("isAdmin", isAdmin, "role", role, "status", status);

//   if (isAdmin) {
//     res.status(403).json({
//       message: `Unauthorized, you must be an admin to complete this action"`,
//     });
//     return { ok: false };
//   }

//   return { ok: true, session };
// }
