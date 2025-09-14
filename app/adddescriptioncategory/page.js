import { serverAuthOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import AddDescriptionCategory from "@/components/AddingNewData/AddDescriptionCategory";

export default async function AddCategory() {
  const session = await getServerSession(serverAuthOptions);

  const isAdmin = session?.user?.id === process.env.admin_id;

  return <AddDescriptionCategory isAdmin={isAdmin} />;
}
