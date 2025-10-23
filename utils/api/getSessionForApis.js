// utils/getSessionForApis.js
import { getServerSession } from "next-auth/next";
import { serverAuthOptions } from "@/lib/auth";

export async function getSessionForApis({ req, res }) {
  const session = await getServerSession(req, res, serverAuthOptions);

  if (!session) {
    return { ok: false };
  }

  return { ok: true, session };
}
