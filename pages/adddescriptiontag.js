import React, { useState } from "react";
import { authOptions } from "./api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import axios from "axios";
import Select from "react-select";
import NavLayoutwithSettingsMenu from "../components/NavBar/NavLayoutwithSettingsMenu";

export const getServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  let categoryList = await fetch(
    `${process.env.BASE_FETCH_URL}/api/descriptioncategory`
  );
  let categoryData = await categoryList.json();
  console.log(categoryData);
  return {
    props: {
      sessionFromServer: session,
      categoryData: categoryData,
    },
  };
};

export default function AddDescriptionTag({ sessionFromServer, categoryData }) {
  const [newDescriptionTag, setNewDescriptionTag] = useState("");
  const [categoryList, setCategoryList] = useState(
    categoryData.map((listing) => listing.category)
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
    console.log(addTagsToCategorySubmission);
    try {
      axios.put("/api/descriptioncategory/edittags", {
        addTagsToCategorySubmission,
      });
      console.log(`tag ${newDescriptionTagId} added to categories! :) `);
    } catch (err) {
      console.log("tag not added to categories :(", err);
    }
  }
  return (
    <div>
      <NavLayoutwithSettingsMenu
        profileImage={profileImage}
        userName={userName}
      />
      <form onSubmit={handleDescriptionTagSubmission}>
        <input
          type="text"
          id="categoryInput"
          className="text-darkPurple"
          placeholder="enter a description tag to add"
          onChange={(e) => setNewDescriptionTag(e.target.value.toLowerCase())}
        />

        <button
          type="submit"
          onClick={handleDescriptionTagSubmission}
        >
          Submit category
        </button>

        {/* TAG AREA */}
        <label
          className="font-bold block mt-4 text-white"
          htmlFor="nameTags"
        >
          Tags
        </label>
        <Select
          className="text-darkPurple mb-4"
          id="nameTags"
          options={categoryData.map((opt) => ({
            label: opt.category,
            value: opt._id,
          }))}
          isMulti
          isSearchable
          placeholder="If you type in the tags field, it will filter the tags"
          onChange={(opt) =>
            setCategoryList(opt.map((category) => category.value))
          }
        />
      </form>
    </div>
  );
}
