import AddDescriptionTag from "@/components/AddingNewData/AddDescriptionTag";
import { getServerSession } from "next-auth";
import { serverAuthOptions } from "@/lib/auth";

export default async function AddDescriptionTagPage() {
  const session = await getServerSession(serverAuthOptions);

  const isAdmin = session?.user?.id === process.env.admin_id;

  return <AddDescriptionTag isAdmin={isAdmin} />;
}
