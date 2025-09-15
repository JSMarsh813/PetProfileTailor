"use client";

import React, { useState } from "react";
import axios from "axios";
import Select from "react-select";
import GeneralButton from "@components/ReusableSmallComponents/buttons/GeneralButton";
import DisabledButton from "@components/ReusableSmallComponents/buttons/DisabledButton";
import { useSession } from "next-auth/react";
import { useCategoriesForDataType } from "@/hooks/useCategoriesForDataType";
import dynamic from "next/dynamic";

export default function AddDescriptionTag({ isAdmin }) {
  const { categoriesWithTags, tagList } =
    useCategoriesForDataType("description");
  const { data: session } = useSession();
  const [newDescriptionTag, setNewDescriptionTag] = useState("");
  const [categoryList, setCategoryList] = useState([]);

  // disable SSR completely to take care of this hydration Warning: Prop id did not match. Server: "react-select-2-live-region" Client: "react-select-3-live-region" Component Stack:

  // even though its "use client", a "use client" component just means “hydrate me on the client too”, not “skip rendering on the server”

  // so its still prerendered on the server to HTML, When hydration runs, React tries to match that HTML with what the client generates

  // That warning is because react-select generates random IDs (react-select-2-live-region, react-select-3-live-region, etc.) which don’t match between server-render and client-render, thus the hydration warning

  const Select = dynamic(() => import("react-select"), { ssr: false });

  function handleDescriptionTagSubmission(e) {
    e.preventDefault();

    if (!session) return;

    const descriptionTagSubmission = {
      tag: newDescriptionTag,
      createdby: session.user.id,
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
    <div className=" mx-auto flex justify-center text-center">
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
          inputId="nameTags" // react-select uses inputId instead of id
          options={categoriesWithTags.map((opt) => ({
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
