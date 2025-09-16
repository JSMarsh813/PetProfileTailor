import "../styles/globals.css";
import { Analytics } from "@vercel/analytics/next";

import "@etchteam/next-pagination/dist/index.css";

import { getServerSession } from "next-auth";
import { serverAuthOptions } from "@/lib/auth";

import ToastProvider from "@/wrappers/ToastWrapper";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faMessage } from "@fortawesome/free-solid-svg-icons";

import db from "@utils/db";
import NameCategory from "@models/NameCategory";
import DescriptionCategory from "@/models/DescriptionCategory";
import { SessionProviderWrapper } from "@/wrappers/SessionProviderWrapper";
import NavLayoutwithSettingsMenu from "@/components/NavBar/NavLayoutwithSettingsMenu";
import CategTagsWrapper from "@/wrappers/CategTagsWrapper";
import { Suspense } from "react";
import LoadingSkeleton from "@/components/LoadingScreen";
import ReportsWrapper from "@/wrappers/ReportsWrapper";
import { leanWithStrings } from "@/utils/mongoDataCleanup";

import FlagReport from "@models/FlagReport";
import NameLikes from "@/models/NameLikes";
import DescriptionLikes from "@/models/DescriptionLikes";

import mongoose from "mongoose";
import LikesWrapper from "@/wrappers/LikesWrapper";

export const metadata = {
  title:
    "Improve Adoption Rates by Creating Impactful, Fun, and Tailor-Fitted Pet Adoption Profiles!",
  description:
    "Homeward Tails is a community powered assistant which helps you find the perfect pet name or create pet profiles which are impactful, fun, and tailor fitted. Animal welfare professionals can use the community submitted names or descriptions to create engaging pet profiles to improve adoption rates!",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(serverAuthOptions);
  const safeSession = session ? { user: session.user || {} } : null;
  //Guarantees session.user exists (or is an empty object).

  // connect to MongoDB + fetch categories
  await db.connect();
  const nameCategories = await leanWithStrings(
    NameCategory.find().populate("tags").sort({ order: 1 }),
  );
  const descCategories = await leanWithStrings(
    DescriptionCategory.find().populate("tags").sort({ order: 1 }),
  );

  // serialize for client hydration
  const nameCategoryJSON = JSON.parse(JSON.stringify(nameCategories));
  const descCategoryJSON = JSON.parse(JSON.stringify(descCategories));

  let nameReports = [];
  let descriptionReports = [];
  let nameLikes = [];
  let descriptionLikes = [];

  // ########## Logged in user specific info ################

  if (session?.user) {
    const userId = mongoose.Types.ObjectId(session.user.id);

    // ############# Reports ###################

    // Fetch both reports in parallel, so its faster
    // ensures both are fetched before rendering the report wrapper

    [nameReports, descriptionReports] = await Promise.all([
      leanWithStrings(
        FlagReport.find(
          {
            reportedby: userId,
            status: { $nin: ["dismissed", "deleted", "resolved"] },
            contenttype: "names",
          },
          { contentid: 1, status: 1, _id: 1 },
        ),
      ),
      leanWithStrings(
        FlagReport.find(
          {
            reportedby: userId,
            status: "pending", // only get pending reports
            contenttype: "descriptions",
          },
          { contentid: 1, status: 1, _id: 0 },
        ),
      ),
    ]);

    // ############# Likes ###################

    [nameLikes, descriptionLikes] = await Promise.all([
      leanWithStrings(NameLikes.find({ userId }, { nameId: 1, _id: 1 })).then(
        (docs) => docs.map((d) => ({ id: d._id, contentId: d.nameId })),
      ),
      leanWithStrings(
        DescriptionLikes.find(
          { userId },
          { descriptionId: 1, userId: 1, _id: 1 },
        ),
      ).then((docs) =>
        docs.map((d) => ({
          id: d._id,
          contentId: d.descriptionId,
        })),
      ),
    ]);

    console.log("userId in layout", userId);
  } // ############# End of user specific content ######

  console.log("name reports in layout", nameReports);

  const initialReports = {
    names: nameReports,
    descriptions: descriptionReports,
  };

  const initialLikes = {
    names: nameLikes,
    descriptions: descriptionLikes,
  };

  return (
    <html
      lang="en"
      className="h-full bg-primary"
    >
      <body className="h-full flex flex-col w-full">
        <SessionProviderWrapper session={safeSession}>
          <CategTagsWrapper
            descrCateg={descCategoryJSON}
            nameCateg={nameCategoryJSON}
          >
            <LikesWrapper initialLikes={initialLikes}>
              <ReportsWrapper initialReports={initialReports}>
                <NavLayoutwithSettingsMenu />
                <Suspense fallback={<LoadingSkeleton />}>
                  <main className="flex-1  px-4 sm:px-6 lg:px-8">
                    {/* width behavior is controlled by globals.css since tailwind wasn't working correctly despite significant debugging, w-max-7xl wouldn't work with any other width value (w-full, w-90vw) ect*/}
                    {children}
                  </main>
                  {/*flex-1  in flex column means: main takes up the remaining flex space, so footer stays at the bottom */}
                </Suspense>
                <Analytics />
                <ToastProvider />

                <footer className="text-white py-4 px-4 bg-secondary border-t-2 border-violet-400 flex">
                  <div className="flex-1">
                    <h6> Credits: </h6>
                    <a
                      className="text-xs block"
                      href="https://thenounproject.com/icon/bat-72023/"
                    >
                      <span>
                        {" "}
                        Bat icon by Megan Mitchell, from thenounproject.com.
                      </span>
                    </a>

                    <a
                      className="text-xs block"
                      href="https://www.freepik.com/author/freepik/icons/kawaii-flat_45#from_element=resource_detail"
                    >
                      <span className="text-xs inline-block">
                        Default user icons created by freepik, Kawaii Flat
                        family
                      </span>
                    </a>
                  </div>

                  <div className="flex-end">
                    <h4> Contact: </h4>

                    <span className="block">
                      <FontAwesomeIcon
                        icon={faEnvelope}
                        className="mr-2"
                      />

                      <button type="button">
                        <a
                          href="mailto:petprofiletailor@gmail.com"
                          className="block w-full h-full"
                        >
                          Email
                        </a>
                      </button>
                    </span>

                    <span className="block">
                      <a href="https://twitter.com/Janetthedev">
                        <FontAwesomeIcon
                          icon={faMessage}
                          className="mr-2"
                        />
                        Message On Twitter
                      </a>
                    </span>
                  </div>
                </footer>
              </ReportsWrapper>
            </LikesWrapper>
          </CategTagsWrapper>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
