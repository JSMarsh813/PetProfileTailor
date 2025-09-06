import React, { useState } from "react";
import { authOptions } from "./api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import axios from "axios";
import GeneralButton from "../components/ReusableSmallComponents/buttons/GeneralButton";
import DisabledButton from "../components/ReusableSmallComponents/buttons/DisabledButton";
import Layout from "../components/NavBar/NavLayoutwithSettingsMenu";

export const getServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions,
  );

  return {
    props: {
      sessionFromServer: session,
      isAdmin: session.user.id === process.env.admin_id,
    },
  };
};

export default function AddCategory({ sessionFromServer, isAdmin }) {
  // #### Info for nav menu
  let userName = "";
  let profileImage = "";

  if (sessionFromServer) {
    userName = sessionFromServer.user.name;
    profileImage = sessionFromServer.user.profileimage;
  }
  // ##### end of section for nav menu

  const [newCategory, setNewCategory] = useState("");
  function handleCategorySubmission(e) {
    e.preventDefault();

    const categorySubmission = {
      category: newCategory,
    };

    axios
      .post("/api/descriptioncategory", categorySubmission)
      .then((response) => {})
      .catch((error) => {
        console.log("this is error", error);
      });
  }

  return (
    <div>
      <Layout
        profileImage={profileImage}
        userName={userName}
        sessionFromServer={sessionFromServer}
      />

      <div className="max-w-7xl mx-auto flex justify-center">
        <form onSubmit={handleCategorySubmission}>
          <input
            type="text"
            id="categoryInput"
            className="text-secondary "
            placeholder="enter a category to add"
            onChange={(e) => setNewCategory(e.target.value.toLowerCase())}
          />

          {sessionFromServer && isAdmin ? (
            <GeneralButton
              text="Submit description category"
              type="submit"
              className="ml-2"
              onClick={handleCategorySubmission}
            />
          ) : (
            <div>
              <DisabledButton text="Submit tag" />
              <p className="text-yellow-300 bg-red-800 pl-2 py-2 mx-auto border-2 border-yellow-300 mt-2">
                To protect data quality, only users with special permissions can
                submit tags
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
