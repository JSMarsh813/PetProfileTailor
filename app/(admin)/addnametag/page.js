"use client";

import React, { useState } from "react";
import axios from "axios";
import GeneralButton from "@components/ReusableSmallComponents/buttons/GeneralButton";
import DisabledButton from "@components/ReusableSmallComponents/buttons/DisabledButton";
import StyledInput from "@components/FormComponents/StyledInput";
import StyledSelect from "@components/FormComponents/StyledSelect";
import { useCategoriesForDataType } from "@/hooks/useCategoriesForDataType";
import { useSession } from "next-auth/react";
import { useAdmin } from "@/context/AdminContext";

export default function AddNameTag() {
  const { isAdmin } = useAdmin();
  const { data: session } = useSession();
  const { categoriesWithTags, tagList } = useCategoriesForDataType("names");
  const [newNameTag, setNewNameTag] = useState("");
  const [categoriesChosen, setCategoriesChosen] = useState([]);

  //for Nav menu profile name and image
  let userName = "";
  let profileImage = "";

  if (session?.user) {
    userName = session.user.name;
    profileImage = session.user.profileimage;
  }
  //end of section for nav menu

  function handleNameTagSubmission(e) {
    e.preventDefault();

    const nameTagSubmission = {
      tag: newNameTag,
      createdby: session.user.id,
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
    console.log(add);

    try {
      axios.put("/api/namecategories/edittags", {
        addTagsToCategorySubmission,
      });
    } catch (err) {
      console.log("tag not added to categories :(", err);
    }
  }
  return (
    <div className=" mx-auto flex justify-center text-center">
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
          htmlFor="categoryTags"
        >
          Categories
        </label>

        <StyledSelect
          id="categoryTags"
          options={categoriesWithTags}
          value={categoriesChosen}
          onChange={setCategoriesChosen}
          labelProperty="category"
          valueProperty="_id"
        />

        {session && isAdmin ? (
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
