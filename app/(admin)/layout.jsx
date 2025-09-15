import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { serverAuthOptions } from "@/lib/auth";
import AdminWrapper from "@/wrappers/AdminWrapper";

export default async function ProtectedLayout({ children }) {
  const session = await getServerSession(serverAuthOptions);

  if (!session) redirect("/login");

  const userId = (session.user?.id ?? "").toString();

  const isAdmin = userId === process.env.admin_id;

  if (!isAdmin) redirect("/dashboard");

  return <AdminWrapper isAdmin={isAdmin}>{children}</AdminWrapper>;
}
