"use client";

import React, { useState } from "react";
import axios from "axios";
import GeneralButton from "@components/ReusableSmallComponents/buttons/GeneralButton";
import DisabledButton from "@components/ReusableSmallComponents/buttons/DisabledButton";
import { useAdmin } from "@/context/AdminContext";
import StyledInput from "@/components/FormComponents/StyledInput";

export default function AddDescriptionCategory() {
  const { isAdmin } = useAdmin();

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
      <div className=" mx-auto flex justify-center ">
        <form onSubmit={handleCategorySubmission}>
          <StyledInput
            type="text"
            id="categoryInput"
            className="text-secondary w-full"
            label="enter a category to add"
            onChange={(e) => setNewCategory(e.target.value.toLowerCase())}
          />

          {isAdmin ? (
            <div className="">
              <GeneralButton
                text="Submit description category"
                type="submit"
                className="ml-2 text-center"
                onClick={handleCategorySubmission}
              />
            </div>
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
