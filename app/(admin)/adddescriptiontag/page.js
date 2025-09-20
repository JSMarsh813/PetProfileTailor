"use client";

import React, { useState } from "react";
import axios from "axios";
import Select from "react-select";
import GeneralButton from "@components/ReusableSmallComponents/buttons/GeneralButton";
import DisabledButton from "@components/ReusableSmallComponents/buttons/DisabledButton";
import { useSession } from "next-auth/react";
import { useCategoriesForDataType } from "@/hooks/useCategoriesForDataType";
import { useAdmin } from "@/context/AdminContext";
import StyledInput from "@components/FormComponents/StyledInput";
import StyledSelect from "@/components/FormComponents/StyledSelect";

export default function AddDescriptionTag() {
  const { isAdmin } = useAdmin();
  const { categoriesWithTags, tagList } =
    useCategoriesForDataType("descriptions");
  const { data: session } = useSession();
  const [newDescriptionTag, setNewDescriptionTag] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [categoriesChosen, setCategoriesChosen] = useState([]);

  function handleDescriptionTagSubmission(e) {
    e.preventDefault();

    if (!session) return null;

    const descriptionTagSubmission = {
      tag: newDescriptionTag,
      createdby: session.user.id,
    };
    console.log(descriptionTagSubmission);
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
      categoriesToUpdate: categoriesChosen.map((option) => option._id),
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
    <div className=" mx-auto flex justify-center text-center">
      <form onSubmit={handleDescriptionTagSubmission}>
        <StyledInput
          type="text"
          id="categoryInput"
          className="text-secondary"
          label="enter a description tag"
          onChange={(e) => setNewDescriptionTag(e.target.value.toLowerCase())}
        />

        {/* TAG AREA */}
        <label
          className="font-bold block mt-4 text-white"
          htmlFor="descriptionTags"
        >
          Categories
        </label>

        <StyledSelect
          className="text-secondary mb-4"
          id="descriptionTags"
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
