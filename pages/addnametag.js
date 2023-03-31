import React, { useState } from "react";
import Select from "react-select";
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
    authOptions
  );

  let categoryList = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_FETCH_URL}/api/namecategories`
  );
  let categoryData = await categoryList.json();

  return {
    props: {
      sessionFromServer: session,
      categoryData: categoryData,
    },
  };
};

export default function AddNameTag({ sessionFromServer, categoryData }) {
  const [newNameTag, setNewNameTag] = useState("");
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

  function handleNameTagSubmission(e) {
    e.preventDefault();

    const nameTagSubmission = {
      tag: newNameTag,
      createdby: sessionFromServer.user._id,
    };

    axios
      .post("/api/nametag", nameTagSubmission)
      .then((response) => {
        let newNameTagId = response.data._id;
        addTagToCategories(newNameTagId);
      })
      .catch((error) => {
        console.log("this is error", error);
      });
  }

  function addTagToCategories(newNameTagId) {
    const addTagsToCategorySubmission = {
      newtagid: newNameTagId,
      categoriesToUpdate: categoryList,
    };
    console.log(addTagsToCategorySubmission);
    try {
      axios.put("/api/namecategories/edittags", {
        addTagsToCategorySubmission,
      });
      console.log(`tag ${newNameTagId} added to categories! :) `);
    } catch (err) {
      console.log("tag not added to categories :(", err);
    }
  }
  return (
    <div>
      <Layout
        profileImage={profileImage}
        userName={userName}
      />
      <form
        className="mx-2"
        onSubmit={handleNameTagSubmission}
      >
        <input
          type="text"
          id="categoryInput"
          className="text-darkPurple"
          placeholder="enter a name tag to add"
          onChange={(e) => setNewNameTag(e.target.value.toLowerCase())}
        />

        {/* TAG AREA */}
        <label
          className="font-bold block mt-4 text-white"
          htmlFor="nameTags"
        >
          Categories
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

        {sessionFromServer &&
        sessionFromServer.user._id == "640178e6d9f774e804cb323d" ? (
          <GeneralButton
            text="Submit tag"
            type="submit"
            className="ml-2"
            onClick={handleNameTagSubmission}
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
  );
}
