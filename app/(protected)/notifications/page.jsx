import dbConnect from "@utils/db";

import User from "@/models/User";
import Name from "@/models/Name";
import Description from "@/models/Description";

import Thank from "@/models/Thank";
import { serverAuthOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { leanWithStrings } from "@/utils/mongoDataCleanup";
import ToggleOneNotificationPage from "@/components/ShowingListOfContent/ToggleOneNotificationPage";
import PageTitleWithImages from "@/components/ReusableSmallComponents/TitlesOrHeadings/PageTitleWithImages";
import MarkThanksRead from "@/components/Thanks/markThanksRead";

export default async function Notifications() {
  const session = await getServerSession(serverAuthOptions);

  if (!session?.user) {
    return redirect("/login");
  }
  const userId = await session.user.id;

  await dbConnect.connect();

  const thankDocs = await leanWithStrings(
    Thank.find({
      contentCreator: userId,
    })
      .populate({
        path: "thanksBy",
        select: ["profileName", "profileImage", "name"],
      })
      .populate({
        path: "nameId",
        select: ["content", "createdBy", "tags"], // include what fields you need
      })
      .populate({
        path: "descriptionId",
        select: ["content", "createdBy", "tags"],
      })
      .sort({ createdAt: -1 }), //  newest first
  );

  console.log("thanks docs", thankDocs);

  const contentList = [
    {
      text: "Thanks",
      className: "mb-2",
      value: "thanks",
      type: "thanks",
    },
    {
      text: "Description Likes",
      className: "mb-2",
      value: "descriptions",
      type: "descriptions",
    },
    {
      text: "Name Likes",
      className: "mb-2",
      value: "names",
      type: "names",
    },
  ];

  return (
    <div>
      <PageTitleWithImages title="Notifications" />
      <section className="text-subtleWhite flex justify-center items-center h-full">
        <ToggleOneNotificationPage
          contentList={contentList}
          thankDocsFromServer={thankDocs}
        />
        {/* <MarkThanksRead /> */}
      </section>
    </div>
  );
}

// thanks , names , descriptions
