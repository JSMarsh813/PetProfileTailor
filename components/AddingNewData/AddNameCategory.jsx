"use client";

import React, { useState } from "react";
import axios from "axios";
import GeneralButton from "@components/ReusableSmallComponents/buttons/GeneralButton";
import DisabledButton from "@components/ReusableSmallComponents/buttons/DisabledButton";

export default function AddNameCategory({ isAdmin }) {
  const [newCategory, setNewCategory] = useState("");

  function handleCategorySubmission(e) {
    e.preventDefault();

    const categorySubmission = {
      category: newCategory,
    };

    axios
      .post("/api/namecategories", categorySubmission)
      .then((response) => {})
      .catch((error) => {
        console.log("this is error", error);
      });
  }

  return (
    <div className=" mx-auto flex justify-center text-center">
      <form onSubmit={handleCategorySubmission}>
        <input
          type="text"
          id="categoryInput"
          className="text-secondary"
          placeholder="enter a category to add"
          onChange={(e) => setNewCategory(e.target.value.toLowerCase())}
        />

        {isAdmin ? (
          <GeneralButton
            text="Submit name category"
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
  );
}
