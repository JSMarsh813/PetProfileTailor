import React from "react";
import NavBar from "../components/NavBar/NavLayoutwithSettingsMenu";
// import dbConnect from "../utils/db";
import { useSession } from "next-auth/react";
import AiChat from "../components/AiChatbot/AIChat";
import PageTitleWithImages from "../components/ReusableSmallComponents/TitlesOrHeadings/PageTitleWithImages";
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
    <section className="min-h-screen">
      <NavBar
        title="Login"
        profileImage={profileImage}
        userName={userName}
        sessionFromServer={sessionFromServer}
      />
      <PageTitleWithImages title="Byte's Corner" />
      <section className="text-center">
        <p>
          Sometimes the community submitted names or descriptions might not have
          quite what you are looking for, and thats why byte is here 🐶.
        </p>

        <p>
          {" "}
          Just the idea of helping you already has byte&apos;s tail wagging with
          excitement!
        </p>
        <h3> Rules: </h3>
        <ul>
          <li>
            Byte will politely reject any submissions that are not related to
            pet names or descriptions{" "}
          </li>
          <li>You can only ask for up to 15 names at a time </li>
          <li>You can only ask for up to 2 descriptions at a time</li>
          <li> Byte is limited to short descriptions</li>
          <li>
            If Byte does not respond, the free limit of OpenAi may of been
            reached for the day
          </li>
        </ul>
      </section>

      <AiChat />
    </section>
  );
}
