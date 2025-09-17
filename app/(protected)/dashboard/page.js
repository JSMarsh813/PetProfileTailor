import dbConnect from "@utils/db";
import Names from "@models/Names";

import Description from "@/models/Description";

import Dashboard from "@/components/dashboard";
import { serverAuthOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { leanWithStrings } from "@/utils/mongoDataCleanup";

export default async function DashboardPage() {
  const session = await getServerSession(serverAuthOptions);

  if (!session?.user) {
    return redirect("/login");
  }
  const userId = await session.user.id;

  await dbConnect.connect();

  // const likedNames = likedNamesRaw.map((n) => ({
  //   ...n,
  //   _id: n._id.toString(),
  //   createdby: n.createdby
  //     ? {
  //         name: n.createdby.name,
  //         profilename: n.createdby.profilename,
  //         profileimage: n.createdby.profileimage,
  //       }
  //     : null,
  //   tags: n.tags?.map((t) => ({ _id: t._id.toString(), tag: t.tag })) || [],
  // }));

  // ---- NAMES created by user ----
  const namesCreated = await leanWithStrings(
    Names.find({ createdby: userId })
      .populate({
        path: "createdby",
        select: ["name", "profilename", "profileimage"],
      })
      .populate({ path: "tags" }),
  );

  // const namesCreated = namesCreatedRaw.map((n) => ({
  //   ...n,
  //   _id: n._id.toString(),
  //   createdby: n.createdby
  //     ? {
  //         name: n.createdby.name,
  //         profilename: n.createdby.profilename,
  //         profileimage: n.createdby.profileimage,
  //       }
  //     : null,
  //   tags: n.tags?.map((t) => ({ _id: t._id.toString(), tag: t.tag })) || [],
  // }));

  // ---- DESCRIPTIONS created by user ----
  const createdDescriptions = await leanWithStrings(
    Description.find({ createdby: userId })
      .populate({
        path: "createdby",
        select: ["name", "profilename", "profileimage"],
      })
      .populate({ path: "tags" }),
  );

  // const createdDescriptions = createdDescriptionsRaw.map((d) => ({
  //   ...d,
  //   _id: d._id.toString(),
  //   createdby: d.createdby
  //     ? {
  //         name: d.createdby.name,
  //         profilename: d.createdby.profilename,
  //         profileimage: d.createdby.profileimage,
  //       }
  //     : null,
  //   tags: d.tags?.map((t) => ({ _id: t._id.toString(), tag: t.tag })) || [],
  // }));

  // const likedDescriptions = likedDescriptionsRaw.map((d) => ({
  //   ...d,
  //   _id: d._id.toString(),
  //   createdby: d.createdby
  //     ? {
  //         name: d.createdby.name,
  //         profilename: d.createdby.profilename,
  //         profileimage: d.createdby.profileimage,
  //       }
  //     : null,
  //   tags: d.tags?.map((t) => ({ _id: t._id.toString(), tag: t.tag })) || [],
  // }));

  return (
    <Dashboard
      likedNames={[]}
      namesCreated={namesCreated}
      createdDescriptions={createdDescriptions}
      likedDescriptions={[]}
    />
  );
}
