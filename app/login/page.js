import { serverAuthOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Login from "@components/login";

export default async function LoginScreen() {
  const session = await getServerSession(serverAuthOptions);
  //useSession needed in order to grab session after the page is loaded, aka so we can grab session once we login

  if (session?.user) {
    redirect("/dashboard");
  }

  //if the session exists, then the user is already signed in. So if this is true, push back to the homepage
  //we need to use router (line 8) to redirect user

  return <Login />;
}
