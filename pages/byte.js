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
    <section className="min-h-screen bg-darkPurple">
      <NavBar
        title="Login"
        profileImage={profileImage}
        userName={userName}
        sessionFromServer={sessionFromServer}
      />
      <PageTitleWithImages
        title="Byte's"
        title2="Dogpark"
      />
      <section className="text-center text-white py-4">
        <section className="flex flex-wrap md:flex-nowrap justify-center mx-2 gap-6 ">
          <div>
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
          <div>
            <p>Don't let his name fool you, Byte doesn't actually bite 😉</p>
            <p className="pb-2">
              Wow, look at that tail go, Byte's so doggone happy to help you!
            </p>
            <h3 className="pt-4 font-bold text-lg  bg-violet-800 border-white border-x-2">
              {" "}
              The (Dog) House Rules:{" "}
            </h3>
            <ul className=" bg-violet-800 p-2  border-white border-x-2 ">
              <li>
                {" "}
                🐶 Questions must be related to pet names or descriptions
              </li>
              <li> 🐶 1 to 15 names at a time </li>
              <li> 🐶 1 or 2 descriptions at a time</li>
              <li>
                🐶 If Byte does not respond, the free limit of OpenAi may of
                been reached for the day
              </li>
            </ul>
          </div>
        </section>
      </section>

      <Card className="bg-gradient-to-r from-blue-900 via-indigo-800 to-violet-950">
        <CardContent>
          <AiChatSection />
        </CardContent>
      </Card>
    </section>
  );
}
