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

export default function AddDescriptionTag({ sessionFromServer }) {
  const [newDescriptionTag, setNewDescriptionTag] = useState("");
  function handleDescriptionTagSubmission(e) {
    e.preventDefault();
    //prevent buttons default behavior

    const descriptionTagSubmission = {
      descriptiontag: newDescriptionTag,
    };

    axios
      .post(
        "http://localhost:3000/api/descriptiontag",
        descriptionTagSubmission
      )
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log("this is error", error);
      });
  }

  return (
    <div>
      <form onSubmit={handleDescriptionTagSubmission}>
        <input
          type="text"
          id="categoryInput"
          className="text-darkPurple"
          // className={`${(!sessionFromServer)&&"bg-slate-400"}`}
          placeholder="enter a description tag to add"
          onChange={(e) => setNewDescriptionTag(e.target.value.toLowerCase())}
        />

        <button
          type="submit"
          onClick={handleDescriptionTagSubmission}
        >
          Submit category
        </button>
      </form>
    </div>
  );
}
