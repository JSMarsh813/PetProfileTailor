import React, { useState } from "react";
import GeneralButton from "../ReusableSmallComponents/buttons/GeneralButton";
import { toast } from "react-toastify";
import axios from "axios";
import CheckboxWithLabelAndDescription from "../FormComponents/CheckboxWithLabelAndDescription";
import { Field } from "@headlessui/react";
import StyledTextarea from "../FormComponents/StyledTextarea";

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
}) {
  const [flagCategoriesState, setFlagCategoriesState] = useState([]);
  const [additionalCommentsState, setAdditionalCommentsState] = useState([]);

  const handleFlagCategoriesState = (e) => {
    const { value, checked } = e.target;

    checked
      ? setFlagCategoriesState([...flagCategoriesState, value])
      : setFlagCategoriesState(
          flagCategoriesState.filter((flagTitle) => flagTitle != value),
        );
  };

  const handleSubmitReport = async (e) => {
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
      createdbyuser: contentCreatedByUserId,
      ideaByUser: ideaByUser,
      flagcategories: flagCategoriesState,
      comments: additionalCommentsState,
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

  return (
    <form className=" mx-auto bg-primary rounded-lg w-[94vw] border border-subtleWhite">
      <div className="flex items-center justify-center py-6   bg-darkPurple">
        <GeneralButton
          text="Cancel"
          warning
          className="mx-2"
          onClick={() => cancelFlagFormAndRevertFlagState()}
        />
      </div>

      <div className={`-mx-3 mb-6`}>
        {/* Area to Type a comment  */}
        <span className="bg-yellow-300 mx-auto w-64 block">
          {" "}
          This feature is in development
        </span>

        <div className=" mb-2 text-subtleWhite px-4 pt-2">
          <h2 className="text-center text-xl ">Suggestions</h2>
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
          <div className="ml-2">
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

            <CheckboxWithLabelAndDescription
              handleFlagCategoriesState={handleFlagCategoriesState}
              title="None of these"
              description="Please give us more information in the comments textbox below"
            />
          </div>

          <div className=" bg-darkPurple border-white border-2 flex">
            <h3 className=" mb-2 text-xl mx-auto py-3">Additional Comments</h3>
          </div>

          <Field className="border-t-2 border-white py-2">
            <StyledTextarea
              onChange={(e) => setAdditionalCommentsState(e.target.value)}
              required
              maxLength="500"
              placeholder="Optional"
              ariaLabel="type-comments"
              name="body"
            />
          </Field>
        </div>
      </div>
    </form>
  );
}

export default AddFlagReport;
