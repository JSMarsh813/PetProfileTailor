import React from "react";
import NavBar from "../components/NavBar/NavLayoutwithSettingsMenu";
// import dbConnect from "../utils/db";
import { useSession } from "next-auth/react";
import FormFlagReport from "../components/AddingNewData/FormFlagReport";

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
    <>
      <NavBar
        title="Login"
        profileImage={profileImage}
        userName={userName}
        sessionFromServer={sessionFromServer}
      />

      <FormFlagReport />
    </>
  );
}
