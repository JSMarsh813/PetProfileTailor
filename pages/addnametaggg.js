import React, { useState } from "react";
import Select from "react-select";
import { authOptions } from "./api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import axios from "axios";
import Navbar from "../components/NavBar/NavLayoutwithSettingsMenu";
import GeneralButton from "../components/ReusableSmallComponents/buttons/GeneralButton";

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
      <Navbar
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

        <GeneralButton
          text="Submit tag"
          type="submit"
          className="ml-2"
          onClick={handleNameTagSubmission}
        />

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
