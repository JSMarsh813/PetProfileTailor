import { serverAuthOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import AddNameTag from "@/components/AddingNewData/AddNameTag";

export default async function AddNameTagPage() {
  const session = await getServerSession(serverAuthOptions);

  const isAdmin = session?.user?.id === process.env.admin_id;
  return <AddNameTag isAdmin={isAdmin} />;
}
