// utils/getSessionForApis.js
import { getServerSession } from "next-auth/next";
import { serverAuthOptions } from "@/lib/auth";

export async function getSessionForApis() {
  const session = await getServerSession(serverAuthOptions);

  if (!session) {
    return { ok: false };
  }

  return { ok: true, session };
}
