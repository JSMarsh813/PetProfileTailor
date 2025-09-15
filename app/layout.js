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
import mongoose from "mongoose";
import LikesWrapper from "@/wrappers/LikesWrapper";

export const metadata = {
  title:
    "Improve Adoption Rates by Creating Impactful, Fun, and Tailor-Fitted Pet Adoption Profiles!",
  description:
    "Tailored Pet Names is a community powered assistant which helps you find the perfect pet name or create pet profiles which are impactful, fun, and tailor fitted. Animal welfare professionals can use the community submitted names or descriptions to create engaging pet profiles to improve adoption rates!",
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
  const initialLikes = [];
  // ############## Reports ################
  if (session?.user) {
    const userId = mongoose.Types.ObjectId(session.user.id);

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
    const testReports = await FlagReport.find({}).limit(5);
    console.log("first 5 reports:", testReports);

    console.log("userId in layout", userId);
  }

  console.log("name reports in layout", nameReports);

  const initialReports = {
    names: nameReports,
    descriptions: descriptionReports,
  };

  return (
    <html
      lang="en"
      className="h-full bg-primary"
    >
      <body className="h-full flex flex-col ">
        <SessionProviderWrapper session={safeSession}>
          <CategTagsWrapper
            descrCateg={descCategoryJSON}
            nameCateg={nameCategoryJSON}
          >
            <LikesWrapper initialLikes={initialLikes}>
              <ReportsWrapper initialReports={initialReports}>
                <NavLayoutwithSettingsMenu />
                <Suspense fallback={<LoadingSkeleton />}>
                  <main className="flex-1 mx-auto max-w-7xl ">{children}</main>
                  {/* main takes up the remaining flex space, so footer stays at the bottom */}
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
