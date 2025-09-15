import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { serverAuthOptions } from "@/lib/auth";

export default async function ProtectedLayout({ children }) {
  const session = await getServerSession(serverAuthOptions);

  if (!session) {
    redirect("/login");
  }

  return <>{children}</>;
}
