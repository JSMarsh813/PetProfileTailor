import React, { useState } from "react";
import { authOptions } from "./api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import axios from "axios";

export const getServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  return {
    props: {
      sessionFromServer: session,
    },
  };
};

export default function AddCategory({ sessionFromServer }) {
  const [newCategory, setNewCategory] = useState("");
  function handleCategorySubmission(e) {
    e.preventDefault();

    const categorySubmission = {
      category: newCategory,
    };

    axios
      .post("/api/descriptioncategory", categorySubmission)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log("this is error", error);
      });
  }

  return (
    <div>
      <form onSubmit={handleCategorySubmission}>
        <input
          type="text"
          id="categoryInput"
          className="text-darkPurple"
          placeholder="enter a category to add"
          onChange={(e) => setNewCategory(e.target.value.toLowerCase())}
        />

        <button
          type="submit"
          onClick={handleCategorySubmission}
        >
          Submit category
        </button>
      </form>
    </div>
  );
}
