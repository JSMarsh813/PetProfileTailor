import { serverAuthOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import AddNameCategory from "@/components/AddingNewData/AddNameCategory";

export default async function AddNameCategoryPage() {
  const session = await getServerSession(serverAuthOptions);

  const isAdmin = session?.user?.id === process.env.admin_id;

  return <AddNameCategory isAdmin={isAdmin} />;
}
