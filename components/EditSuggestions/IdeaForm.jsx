"use client";

import React, { useState } from "react";
import GeneralButton from "@components/ReusableSmallComponents/buttons/GeneralButton";
import { toast } from "react-toastify";
import axios from "axios";
import CheckboxWithLabelAndDescription from "@components/FormComponents/CheckboxWithLabelAndDescription";
import { Field } from "@headlessui/react";
import StyledTextarea from "@components/FormComponents/StyledTextarea";
import StyledCheckbox from "@components/FormComponents/StyledCheckbox";
import ClosingXButton from "@components/ReusableSmallComponents/buttons/ClosingXButton";
import TagsSelectAndCheatSheet from "@components/FormComponents/TagsSelectAndCheatSheet";
import { useTags } from "@hooks/useTags";

function AddFlagReport({
  contentType,
  ideaByUser,
  contentInfo,
  copyOfContentForReport,
  apiIdeaSubmission,
  apiaddUserToIdea,
  setIdeaFormToggled,
  ideaFormToggled,
  setIdeaIconClickedByNewUser,
  setUserAlreadySentIdea,
  categoriesWithTags,
}) {
  const [flagCategoriesState, setFlagCategoriesState] = useState([]);
  const [additionalCommentsState, setAdditionalCommentsState] = useState([]);

  const { tagsToSubmit, handleSelectChange, handleCheckboxChange } = useTags();

  const handleFlagCategoriesState = (e) => {
    const { value, checked } = e.target;

    checked
      ? setFlagCategoriesState([...flagCategoriesState, value])
      : setFlagCategoriesState(
          flagCategoriesState.filter((flagTitle) => flagTitle != value),
        );
  };

  const handleSubmitIdea = async (e) => {
    e.preventDefault();

    if (flagCategoriesState.length === 0) {
      toast.error(
        `Ruh Roh! You must click 1 or more of the checkboxes for flag type`,
      );
      return;
    }
    if (ideaByUser == "") {
      toast.error(`Ruh Roh! You must be signed in to flag content`);
      return;
    }

    //dealing with the edge case because of profile pages, profile pages won't have a createdby property
    let profileIsLoggedInUserCheck = contentInfo._id;

    let contentCreatedByUserId =
      contentInfo.createdby != undefined
        ? contentInfo.createdby._id
        : profileIsLoggedInUserCheck;

    if (
      contentCreatedByUserId === ideaByUser ||
      profileIsLoggedInUserCheck === ideaByUser
    ) {
      toast.warn(
        `Ruh Roh! Nice try but you can't flag your own content silly goose :)`,
      );
      return;
    }

    const reportSubmission = {
      contenttype: contentType,
      contentid: contentInfo._id,
      contentcopy: copyOfContentForReport,
      contentcreatedby: contentCreatedByUserId,
      ideaByUser: ideaByUser,
      // tagcategories: flagCategoriesState,
      comments: additionalCommentsState,
      descriptionedits: descriptionCommentsState,
    };
    console.log(reportSubmission);

    const userAndNameId = {
      contentid: contentInfo._id,
      ideaByUser: ideaByUser,
    };

    await axios
      .post(apiIdeaSubmission, reportSubmission)
      .then((response) => {
        toast.success(
          `Thank you for your report! Report for ${response.data.message} successfully sent`,
        );
      })
      .then(() => callApiToaddUserToNamesArray(userAndNameId))
      .then(() => setIdeaFormToggled(false))
      .then(() => setUserAlreadySentIdea(true))

      .catch((error) => {
        console.log("this is an error", error);

        toast.error(
          `Ruh Roh! ${error.message} ${JSON.stringify(
            error.response.data.message,
          )}`,
        );
      });
  };

  function callApiToaddUserToNamesArray(userAndNameId) {
    axios
      .put(apiaddUserToIdea, userAndNameId)
      .then(toast.success(`your name has been added to the flaggedby array`));
  }

  function cancelFlagFormAndRevertFlagState() {
    setIdeaIconClickedByNewUser(false);
    setIdeaFormToggled(!ideaFormToggled);
  }
  console.log("contentInfo", contentInfo);

  return (
    <form
      className=" mx-auto bg-primary rounded-lg w-[94vw] border border-subtleWhite"
      onSubmit={handleSubmitIdea}
    >
      <div className="flex items-center justify-end py-2   bg-secondary ">
        <ClosingXButton
          onClick={() => cancelFlagFormAndRevertFlagState()}
          className="mr-5"
        />
      </div>

      <div className={` mb-4`}>
        <div className=" mb-2 text-subtleWhite px-4 ">
          <section className="my-6">
            <h2 className="text-center  text-2xl ">Suggestions</h2>
            <p className="text-center mt-3">
              Thank you for taking the time to help improve our community
              powered database! 🙏🙇
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
          </section>

          <section className="flex flex-col mx-5 my-8">
            <div className=" bg-secondary border-white border-y rounded-sm flex">
              <h3 className=" mb-2 text-xl mx-auto py-3 ">Incorrect Tags </h3>
            </div>

            <div className="flex flex-col gap-4 mt-4">
              <p className="mx-auto">
                Select the incorrect tags and then please comment why the tags
                are incorrect in the textbox at the bottom. Thank you!
              </p>
              {contentInfo.tags.map((tag) => (
                <StyledCheckbox
                  label={tag.tag}
                  checked={flagCategoriesState.includes(tag._id)}
                  onChange={handleFlagCategoriesState}
                  value={tag._id}
                />
              ))}
            </div>
          </section>

          <div className=" bg-secondary border-white border-y rounded-sm flex my-6">
            <h3 className=" mb-2 text-xl mx-auto py-3 ">Add Tags </h3>
          </div>

          <TagsSelectAndCheatSheet
            categoriesWithTags={categoriesWithTags}
            tagsToSubmit={tagsToSubmit}
            handleSelectChange={handleSelectChange}
            handleCheckboxChange={handleCheckboxChange}
          />

          <div className=" bg-secondary border-white border-y rounded-sm flex mt-6">
            <h3 className=" mb-2 text-xl mx-auto py-3 ">
              Suggest Changes to Description{" "}
            </h3>
          </div>

          <Field className="mt-6 mx-4">
            <p className="text-center my-4">
              {" "}
              {`"${
                contentInfo.description[0] === ""
                  ? "no description given"
                  : contentInfo.description[0]
              }"`}
            </p>
            <StyledTextarea
              onChange={(e) => setAdditionalCommentsState(e.target.value)}
              maxLength="500"
              placeholder=""
              ariaLabel="type-comments"
              name="body"
            />
          </Field>

          <section>
            <div className=" bg-secondary border-white border-y rounded-sm mx-5 mb-10 flex mt-6">
              <h3 className=" my-2 text-xl mx-auto py-3 ">
                Additional Comments
              </h3>
            </div>
            <p className="text-center">
              Please give us more information in the comments textbox below
            </p>

            <Field className="mt-6 mx-4">
              <StyledTextarea
                onChange={(e) => setAdditionalCommentsState(e.target.value)}
                maxLength="500"
                placeholder="Optional"
                ariaLabel="type-comments"
                name="body"
              />
            </Field>
          </section>

          <Field className="flex gap-24 justify-center">
            <GeneralButton
              text="Cancel"
              warning
              className="mx-2"
              onClick={() => cancelFlagFormAndRevertFlagState()}
            />

            <GeneralButton
              type="submit"
              text="Submit"
              default
            />
          </Field>
        </div>
      </div>
    </form>
  );
}

export default AddFlagReport;
