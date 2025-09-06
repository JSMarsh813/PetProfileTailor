import React, { useState } from "react";
import { authOptions } from "./api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import axios from "axios";
import Select from "react-select";
import NavLayoutwithSettingsMenu from "../components/NavBar/NavLayoutwithSettingsMenu";
import GeneralButton from "../components/ReusableSmallComponents/buttons/GeneralButton";
import DisabledButton from "../components/ReusableSmallComponents/buttons/DisabledButton";
import Layout from "../components/NavBar/NavLayoutwithSettingsMenu";

export const getServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions,
  );

  let categoryList = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_FETCH_URL}/api/descriptioncategory`,
  );
  let categoryData = await categoryList.json();

  return {
    props: {
      sessionFromServer: session,
      categoryData: categoryData,
      isAdmin: session.user.id === process.env.admin_id,
    },
  };
};

export default function AddDescriptionTag({
  sessionFromServer,
  categoryData,
  isAdmin,
}) {
  const [newDescriptionTag, setNewDescriptionTag] = useState("");
  const [categoryList, setCategoryList] = useState(
    categoryData.map((listing) => listing.category),
  );

  console.log(
    "categoryData",
    categoryData.map((listing) => listing),
  );

  //for Nav menu profile name and image
  let userName = "";
  let profileImage = "";

  if (sessionFromServer) {
    userName = sessionFromServer.user.name;
    profileImage = sessionFromServer.user.profileimage;
  }
  //end of section for nav menu

  function handleDescriptionTagSubmission(e) {
    e.preventDefault();

    const descriptionTagSubmission = {
      tag: newDescriptionTag,
      createdby: sessionFromServer.user._id,
    };

    axios
      .post("/api/descriptiontag", descriptionTagSubmission)
      .then((response) => {
        let newDescriptionTagId = response.data._id;
        addTagToCategories(newDescriptionTagId);
      })
      .catch((error) => {
        console.log("this is error", error);
      });
  }

  function addTagToCategories(newDescriptionTagId) {
    const addTagsToCategorySubmission = {
      newtagid: newDescriptionTagId,
      categoriesToUpdate: categoryList,
    };

    try {
      axios.put("/api/descriptioncategory/edittags", {
        addTagsToCategorySubmission,
      });
    } catch (err) {
      console.log("tag not added to categories :(", err);
    }
  }
  return (
    <div>
      <NavLayoutwithSettingsMenu
        profileImage={profileImage}
        userName={userName}
        sessionFromServer={sessionFromServer}
      />
      <div className="max-w-7xl mx-auto flex justify-center text-center">
        <form onSubmit={handleDescriptionTagSubmission}>
          <input
            type="text"
            id="categoryInput"
            className="text-secondary"
            placeholder="enter a description tag"
            onChange={(e) => setNewDescriptionTag(e.target.value.toLowerCase())}
          />

          {/* TAG AREA */}
          <label
            className="font-bold block mt-4 text-white"
            htmlFor="nameTags"
          >
            Categories
          </label>
          <Select
            className="text-secondary mb-4"
            id="nameTags"
            options={categoryData.map((opt) => ({
              label: opt.category,
              value: opt._id,
            }))}
            isMulti
            isSearchable
            placeholder="If you type in the tags field, it will filter the categories"
            onChange={(opt) =>
              setCategoryList(opt.map((category) => category.value))
            }
          />

          {sessionFromServer && isAdmin ? (
            <GeneralButton
              text="Submit tag"
              type="submit"
              className="ml-2"
              onClick={handleDescriptionTagSubmission}
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
