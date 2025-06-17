import React from "react";
import NavBar from "../components/NavBar/NavLayoutwithSettingsMenu";
// import dbConnect from "../utils/db";
import { useSession } from "next-auth/react";

import PageTitleWithImages from "../components/ReusableSmallComponents/TitlesOrHeadings/PageTitleWithImages";
import { AiChatSection } from "../components/AiChatSection";

import { Card, CardContent } from "@/components/ui/card";

export default function Custom404() {
  //grab data from Session and rename data to session
  const { data: sessionFromServer, status } = useSession();

  let userName = "";
  let profileImage = "";

  if (sessionFromServer) {
    userName = sessionFromServer.user.name;
    profileImage = sessionFromServer.user.profileimage;
  }
  //end of section for nav menu

  return (
    <section className="min-h-screen bg-violet-950">
      <NavBar
        title="Login"
        profileImage={profileImage}
        userName={userName}
        sessionFromServer={sessionFromServer}
      />
      <PageTitleWithImages
        title="Byte's"
        title2="Dog House"
      />
      <section className="text-center text-white py-4">
        <section className="flex flex-wrap md:flex-nowrap justify-center mx-2 gap-6 ">
          <div className="my-auto">
            <img
              src="/robot-dog-catalyststuff-freepik.png"
              alt="a friendly looking cartoon blue robot dog with its tongue sticking out"
            />
            <a
              className="text-[10px]"
              href="https://www.freepik.com/free-vector/cute-dog-robot-cartoon-character-animal-technology-isolated_14869431.htm#fromView=search&page=1&position=0&uuid=370ba615-ae30-443b-8d10-1904c20c8479&query=robot+dog"
            >
              {" "}
              Created by Catalyststuff on FreePik{" "}
            </a>
          </div>
          <div className=" bg-darkPurple  shadow-blue-500 shadow-lg px-4">
            <h2 className="font-bold text-2xl pb-6 pt-4 ">
              {" "}
              Say hi to{" "}
              <span className="underline-offset-4 underline decoration-blue-500">
                Byte
              </span>{" "}
              the AI dog! 🐕‍🦺{" "}
            </h2>
            <p className="pb-2">
              Don't let his name fool you, Byte doesn't actually bite 😉
            </p>
            <p className="pb-6">
              If you couldn't find the perfect pet name or description in our
              community database, Byte's here to help!
            </p>

            <div className="flex justify-center  bg-violet-950 py-2 mx-8  border-white border-t-2 border-x-2 rounded-lg">
              <h3 className="py-auto font-bold text-lg mx-10 ">
                {" "}
                The (Dog) House Rules:{" "}
              </h3>
            </div>
            <ul className=" p-2 space-y-2 my-4">
              <li>
                {" "}
                🦴 Questions must be related to pet names or descriptions
              </li>
              <li> 🦴 1 to 15 names at a time </li>
              <li> 🦴 1 or 2 descriptions at a time</li>
              <li>
                🦴 If Byte does not respond, the free limit of OpenAi may of
                been reached for the day
              </li>
            </ul>
          </div>
        </section>
      </section>

      <Card className="bg-gradient-to-b from-violet-950  via-indigo-800 to-blue-900">
        <CardContent>
          <AiChatSection />
        </CardContent>
      </Card>
    </section>
  );
}
