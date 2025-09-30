import "../styles/globals.css";
import { Analytics } from "@vercel/analytics/next";

import "@etchteam/next-pagination/dist/index.css";

import { getServerSession } from "next-auth";
import { serverAuthOptions } from "@/lib/auth";

import ToastProvider from "@/wrappers/ToastWrapper";

import { SessionProviderWrapper } from "@/wrappers/SessionProviderWrapper";
import NavLayoutwithSettingsMenu from "@/components/NavBar/NavLayoutwithSettingsMenu";
import CategTagsWrapper from "@/wrappers/CategTagsWrapper";
import { Suspense } from "react";
import LoadingSkeleton from "@/components/LoadingScreen";
import ReportsWrapper from "@/wrappers/ReportsWrapper";

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
  const safeSession = session
    ? {
        ...session,
        user: session.user || {},
      }
    : null;
  //Guarantees session.user exists (or is an empty object).

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_FETCH_URL}/api/categories-and-tags`,
  );
  const { names, descriptions } = await res.json();

  return (
    <html
      lang="en"
      className="h-full bg-primary w-full"
    >
      <body className="h-full flex flex-col w-full">
        <SessionProviderWrapper session={safeSession}>
          <CategTagsWrapper
            descrCateg={descriptions}
            nameCateg={names}
          >
            <LikesWrapper>
              <ReportsWrapper>
                <SuggestionsWrapper>
                  <NavLayoutwithSettingsMenu />
                  <Suspense fallback={<LoadingSkeleton />}>
                    <main
                      className="flex-1   sm:px-6 lg:px-8 mx-auto w-full" // w-full so it the element doesn't start off as collapsed
                      style={{ width: "clamp(300px, 90vw, 1280px)" }}
                    >
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
