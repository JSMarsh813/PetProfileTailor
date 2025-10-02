import { getServerSession } from "next-auth";
import { serverAuthOptions } from "@/lib/auth";
import ResetPassword from "@/components/ResetPassword";

export default async function ResetPasswordPage({ params }) {
  //allows us to grab the dynamic value from the url
  const session = await getServerSession(serverAuthOptions);

  if (session?.user) {
    return redirect("/dashboard");
  }

  const { token } = await params;
  return <ResetPassword token={token} />;
}
