import ForgotPassword from "@/components/forgotpassword";
import { serverAuthOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function ForgotPasswordPage() {
  const session = await getServerSession(serverAuthOptions);

  if (session) {
    redirect("/dashboard");
  }

  return <ForgotPassword />;
}
