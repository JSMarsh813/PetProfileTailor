import dbConnect from "@utils/db";
import Names from "@models/Name";

import Description from "@/models/Description";

import Dashboard from "@/components/dashboard";
import { serverAuthOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { leanWithStrings } from "@/utils/mongoDataCleanup";

export default async function Notifications() {
  const session = await getServerSession(serverAuthOptions);

  if (!session?.user) {
    return redirect("/login");
  }
  const userId = await session.user.id;

  await dbConnect.connect();

  return (
    <div className="text-subtleWhite flex justify-center items-center h-full">
      <p className="my-auto"> In the process of being built </p>
    </div>
  );
}
