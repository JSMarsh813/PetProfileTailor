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

export const metadata = {
  title:
    "Improve Adoption Rates by Creating Impactful, Fun, and Tailor-Fitted Pet Adoption Profiles!",
  description:
    "Tailored Pet Names is a community powered assistant which helps you find the perfect pet name or create pet profiles which are impactful, fun, and tailor fitted. Animal welfare professionals can use the community submitted names or descriptions to create engaging pet profiles to improve adoption rates!",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(serverAuthOptions);
  console.log("session in root", session);

  // connect to MongoDB + fetch categories
  await db.connect();
  const nameCategories = await NameCategory.find()
    .populate("tags")
    .sort({ order: 1 })
    .lean();
  const descCategories = await DescriptionCategory.find()
    .populate("tags")
    .sort({ order: 1 })
    .lean();

  // serialize for client hydration
  const nameCategoryJSON = JSON.parse(JSON.stringify(nameCategories));
  const descCategoryJSON = JSON.parse(JSON.stringify(descCategories));

  return (
    <html lang="en">
      <body>
        <SessionProviderWrapper session={session}>
          <CategTagsWrapper
            descrCateg={descCategoryJSON}
            nameCateg={nameCategoryJSON}
          >
            <NavLayoutwithSettingsMenu session={session} />
            <main>{children}</main>
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
                    Default user icons created by freepik, Kawaii Flat family
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
          </CategTagsWrapper>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
