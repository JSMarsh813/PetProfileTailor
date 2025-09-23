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

import Report from "@models/Report";
import NameLikes from "@/models/NameLikes";
import DescriptionLikes from "@/models/DescriptionLikes";
import Suggestion from "@/models/Suggestions";

import mongoose from "mongoose";
import LikesWrapper from "@/wrappers/LikesWrapper";
import SuggestionsWrapper from "@/wrappers/SuggestionsWrapper";

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
  let nameSuggestions = [];
  let descriptionSugggestions = [];

  // ########## Logged in user specific info ################

  if (session?.user) {
    const userId = mongoose.Types.ObjectId(session.user.id);

    // ############# Reports ###################

    // Fetch both reports in parallel, so its faster
    // ensures both are fetched before rendering the report wrapper

    [nameReports, descriptionReports] = await Promise.all([
      leanWithStrings(
        Report.find(
          {
            reportedby: userId,
            status: { $nin: ["dismissed", "deleted", "resolved"] },
            contenttype: "names",
          },
          { contentid: 1, status: 1, _id: 1 },
        ),
      ),
      leanWithStrings(
        Report.find(
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

    // ############# Suggestions ###################

    [nameSuggestions, descriptionSugggestions] = await Promise.all([
      leanWithStrings(
        Suggestion.find(
          {
            suggestionBy: userId,
            status: { $nin: ["dismissed", "deleted", "resolved"] },
            contenttype: "names",
          },
          { contentId: 1, status: 1, _id: 1 },
        ),
      ),
      leanWithStrings(
        Suggestion.find(
          {
            suggestionBy: userId,
            status: "pending", // only get pending suggestions
            contenttype: "descriptions",
          },
          { contentId: 1, status: 1, _id: 0 },
        ),
      ),
    ]);

    // console.log("userId in layout", userId);
  } // ############# End of user specific content ######

  // console.log("name reports in layout", nameReports);

  const initialReports = {
    names: nameReports,
    descriptions: descriptionReports,
  };

  const initialSuggestions = {
    names: nameSuggestions,
    descriptions: descriptionSugggestions,
  };

  const initialLikes = {
    names: nameLikes,
    descriptions: descriptionLikes,
  };

  return (
    <html
      lang="en"
      className="h-full bg-primary w-full"
    >
      <body className="h-full flex flex-col w-full">
        <SessionProviderWrapper session={safeSession}>
          <CategTagsWrapper
            descrCateg={descCategoryJSON}
            nameCateg={nameCategoryJSON}
          >
            <LikesWrapper initialLikes={initialLikes}>
              <ReportsWrapper initialReports={initialReports}>
                <SuggestionsWrapper initialSuggestions={initialSuggestions}>
                  <NavLayoutwithSettingsMenu />
                  <Suspense fallback={<LoadingSkeleton />}>
                    <main className="flex-1   sm:px-6 lg:px-8 mx-auto w-full max-w-[1280px] min-w-[300px] md:w-[clamp(300px,90vw,1280px)]">
                      {children}
                    </main>
                    {/*flex-1  in flex column means: main takes up the remaining flex space, so footer stays at the bottom */}
                  </Suspense>
                  <Analytics />
                  <ToastProvider />

                  <footer className="text-white text-sm py-4 px-4 bg-secondary border-t-2 border-violet-400 flex">
                    <div className="flex flex-col gap-2">
                      <h6 className="font-semibold">Credits:</h6>
                      <small>
                        <a
                          className="text-xs block"
                          href="https://www.freepik.com/author/freepik/icons/kawaii-flat_45#from_element=resource_detail"
                        >
                          Default user icons created by freepik, Kawaii Flat
                          family
                        </a>
                      </small>
                      <small>
                        <a
                          className="text-xs block"
                          href="https://thenounproject.com/browse/icons/term/thank-you/"
                        >
                          Thank you icon by Arfan Haq from Noun Project
                        </a>
                      </small>
                    </div>
                  </footer>
                </SuggestionsWrapper>
              </ReportsWrapper>
            </LikesWrapper>
          </CategTagsWrapper>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
