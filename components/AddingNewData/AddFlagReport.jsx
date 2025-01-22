import React, { useState, useEffect } from "react";
import GeneralButton from "../ReusableSmallComponents/buttons/GeneralButton";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import CheckboxWithLabelAndDescription from "../FormComponents/CheckboxWithLabelAndDescription";
import { Checkbox, Label, Description, Field } from "@headlessui/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Heading } from "@react-email/components";

function AddFlagReport({
  contentType,
  contentId,
  flaggedby,
  replyingtothiscontent,
  sessionFromServer,
  apiLink,
}) {
  const [showFlagForm, setShowFlagForm] = useState(false);
  const [description, setDescription] = useState("");
  const [createdby, setCreatedBy] = useState();
  const [enabled, setEnabled] = useState(false);
  const [flagCategoriesState, setFlagCategoriesState] = useState([]);
  const [additionalCommentsState, setAdditionalCommentsState] = useState([]);

  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => console.log(data);

  const handleFlagCategoriesState = (e) => {
    const { value, checked } = e.target;

    checked
      ? setFlagCategoriesState([...flagCategoriesState, value])
      : setFlagCategoriesState(
          flagCategoriesState.filter((flagTitle) => flagTitle != value),
          { ...register("flagCategories") },
        );
  };

  useEffect(() => {
    setCreatedBy(sessionFromServer ? sessionFromServer.user.id : "");
  }, [sessionFromServer]);

  const flagSubmission = async (e) => {
    e.preventDefault();

    if (!flagCategoriesState) {
      toast.error(
        `Ruh Roh! You must click 1 or more of the checkboxes for flag type`,
      );
      return;
    }
    if (createdby == "") {
      toast.error(`Ruh Roh! You must be signed in to flag content`);
      return;
    }

    const flagSubmission = {
      contentType: "name",
      contentId: "",
      flagCategories: flagCategoriesState,
      comments: additionalCommentsState,
      createdby: createdby.toString(),
      flaggedby: "blank",
    };
    console.log(`this is flagSubmission ${JSON.stringify(flagSubmission)}`);
    await axios
      .post(apiLink, flagSubmission)
      .then((response) => {
        toast.success(
          `Thank you for your report! Report for BLANK successfully sent`,
        );
      })
      .catch((error) => {
        console.log("this is an error", error);

        toast.error(`Ruh Roh! flag not added`);
      });
  };

  return (
    <form
      className="w-full bg-violet-900 rounded-lg px-4 pt-2 mb-4 pb-2"
      onSubmit={handleSubmit(onSubmit)}
    >
      <GeneralButton
        text={` ${!showFlagForm ? "Add a new flag" : "Cancel"}`}
        onClick={() => setShowFlagForm(!showFlagForm)}
        className=""
      />

      <div className={`-mx-3 mb-6 ${showFlagForm ? "" : "hidden"}`}>
        {/* Area to Type a comment  */}

        <div className="w-full px-3 mb-2 text-white">
          <h2 className="text-center text-xl ">
            Flag NAME for edits or inappropriate content
          </h2>
          <p className="text-center mt-3">
            Thank you for taking the time to help improve our community powered
            database! 🙏🙇
          </p>
          <p className="text-center ">
            Your input is the secret sauce we need to make this site the best
            resource possible.
          </p>
          <p className="text-center mb-3">
            You&apos;re paw~esome, we couldn&apos;t do it without you! 😉
          </p>

          <p className="text-center mb-3">
            ❗ Note: <strong> one or more checkboxes must be selected</strong>{" "}
            to submit this form
          </p>

          <div className=" bg-darkPurple border-white border-2 flex">
            <h3 className=" mb-2 text-xl mx-auto py-3"> Suggest Changes </h3>
          </div>
          <CheckboxWithLabelAndDescription
            handleFlagCategoriesState={handleFlagCategoriesState}
            title="Add flags for controversial or vulgar content"
            description="For content that isn't hate speech or gratious violence but could still be considered edgy. This allows users to opt in or out of seeing this content."
          />

          <CheckboxWithLabelAndDescription
            handleFlagCategoriesState={handleFlagCategoriesState}
            title="Add other tags"
            description="Please write the suggested tags in the textbox below. Thank you!"
          />

          <CheckboxWithLabelAndDescription
            handleFlagCategoriesState={handleFlagCategoriesState}
            title="Typos or wrong tags"
            description="Please describe the typos or incorrect tags in the textbox below. Thank you!"
          />

          <div className=" bg-darkPurple border-white border-2 flex">
            <h3 className=" mb-2 text-xl mx-auto py-3">
              Flag Inappropriate Content
            </h3>
          </div>

          <CheckboxWithLabelAndDescription
            handleFlagCategoriesState={handleFlagCategoriesState}
            title="Hate"
            description="Slurs, racist or sexist stereotypes, Incitement of fear or discrimination, Violent 	extremism and terrorism, hate groups & networks"
          />
          <CheckboxWithLabelAndDescription
            handleFlagCategoriesState={handleFlagCategoriesState}
            title="Violent Speech"
            description="Violent Threats, Wish of Harm, Coded Incitement of Violence"
          />
          <CheckboxWithLabelAndDescription
            handleFlagCategoriesState={handleFlagCategoriesState}
            title="Abuse and Harassment"
            description="Insults, unwanted advances, targeted harassment and inciting harassment"
          />
          <CheckboxWithLabelAndDescription
            handleFlagCategoriesState={handleFlagCategoriesState}
            title="Privacy"
            description="Sharing private information of others, threatening to share or expose private information"
          />
          <CheckboxWithLabelAndDescription
            handleFlagCategoriesState={handleFlagCategoriesState}
            title="Spam"
            description="Fake engagement, scams, malicious links"
          />
          <CheckboxWithLabelAndDescription
            handleFlagCategoriesState={handleFlagCategoriesState}
            title="Sensitive or disturbing content"
            description="Gratuitous gore or violence, nudity & sexual behavior"
          />
          <CheckboxWithLabelAndDescription
            handleFlagCategoriesState={handleFlagCategoriesState}
            title="None of these"
            description="Please give us more information in the comments textbox below"
          />

          <div className=" bg-darkPurple border-white border-2 flex">
            <h3 className=" mb-2 text-xl mx-auto py-3">Additional Comments</h3>
          </div>
          <Field className="border-t-2 border-white py-2">
            <textarea
              aria-label="type-comments"
              onChange={(e) => setAdditionalCommentsState(e.target.value)}
              className="bg-violet-100 rounded border  border-gray-400 leading-normal text-black w-full h-20 py-2 px-3 font-medium placeholder-gray-700 focus:outline-none focus:bg-white mt-2"
              name="body"
              required
              maxLength="700"
              placeholder="Optional"
            ></textarea>
          </Field>
          <span className="text-white">
            {`${500 - description.length}/500 characters left`}
          </span>

          <Field>
            <input
              type="submit"
              className="bg-white text-gray-700 font-medium py-1 px-4 border border-gray-400 rounded-lg tracking-wide mr-1 hover:bg-gray-100"
              value="Submit Report"
              onClick={flagSubmission}
            ></input>
          </Field>
        </div>
      </div>
    </form>
  );
}

export default AddFlagReport;
