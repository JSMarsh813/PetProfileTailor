import React, { useState } from "react";
import Select from "react-select";
import { authOptions } from "./api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import axios from "axios";
import GeneralButton from "@components/ReusableSmallComponents/buttons/GeneralButton";
import DisabledButton from "@components/ReusableSmallComponents/buttons/DisabledButton";
import Layout from "@components/NavBar/NavLayoutwithSettingsMenu";
import StyledInput from "@components/FormComponents/StyledInput";
import StyledSelect from "@components/FormComponents/StyledSelect";
import dbConnect from "@utils/db";
import Category from "@models/NameCategory";

export const getServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions,
  );

  await dbConnect.connect();

  const categoryData = await Category.find().sort({ order: 1, _id: 1 });

  console.log("categoryData", categoryData);
  return {
    props: {
      sessionFromServer: session,
      categoryData: JSON.parse(JSON.stringify(categoryData)),
      isAdmin: session.user.id === process.env.admin_id,
    },
  };
};

export default function AddNameTag({
  sessionFromServer,
  categoryData,
  isAdmin,
}) {
  const [newNameTag, setNewNameTag] = useState("");
  const [categoriesChosen, setCategoriesChosen] = useState();

  const categoryList = categoryData.map((listing) => ({
    category: listing.category,
    _id: listing._id,
  }));

  console.log("categoryList", categoryList);

  console.log(
    categoryList.map((opt) => ({
      label: opt.category,
      value: opt._id,
    })),
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
      createdby: sessionFromServer.user.id,
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
      categoriesToUpdate: categoriesChosen,
    };

    try {
      axios.put("/api/namecategories/edittags", {
        addTagsToCategorySubmission,
      });
    } catch (err) {
      console.log("tag not added to categories :(", err);
    }
  }
  return (
    <div>
      <Layout
        profileImage={profileImage}
        userName={userName}
        sessionFromServer={sessionFromServer}
      />

      <div className="max-w-7xl mx-auto flex justify-center text-center">
        <form
          className="mx-2"
          onSubmit={handleNameTagSubmission}
        >
          <StyledInput
            type="text"
            id="categoryInput"
            className="text-secondary"
            onChange={(e) => setNewNameTag(e.target.value)}
            label="Enter a name tag to add"
          />

          {/* TAG AREA */}
          <label
            className="font-bold block mt-4 text-white"
            htmlFor="nameTags"
          >
            Categories
          </label>

          <StyledSelect
            id="nameTags"
            options={categoryData}
            value={categoriesChosen}
            onChange={(selected) => setCategoriesChosen(selected)}
            labelProperty="category"
            valueProperty="_id"
          />

          {sessionFromServer && isAdmin ? (
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
    </div>
  );
}
