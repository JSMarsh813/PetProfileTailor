import React, { useState } from "react";
import GeneralButton from "../ReusableSmallComponents/buttons/GeneralButton";
import { toast } from "react-toastify";
import axios from "axios";
import CheckboxWithLabelAndDescription from "../FormComponents/CheckboxWithLabelAndDescription";
import { Field } from "@headlessui/react";
import StyledTextarea from "../FormComponents/StyledTextarea";
import StyledInput from "../FormComponents/StyledInput";

function AddFlagReport({
  contentType,
  flaggedByUser,
  contentInfo,
  copyOfContentForReport,
  apiflagReportSubmission,
  apiaddUserToFlaggedByArray,
  flagFormIsToggled,
  setFlagFormIsToggled,
  setFlagIconClickedByNewUser,
  setUserHasAlreadyReportedThis,
  onClose,
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
        `Ruh Roh! You must click 1 or more of the checkboxes for report type`,
      );
      return;
    }
    if (flaggedByUser == "") {
      toast.error(`Ruh Roh! You must be signed in to report content`);
      return;
    }

    //dealing with the edge case because of profile pages, profile pages won't have a createdby property
    let profileIsLoggedInUserCheck = contentInfo._id;

    let contentCreatedByUserId =
      contentInfo.createdby != undefined
        ? contentInfo.createdby._id
        : profileIsLoggedInUserCheck;

    if (
      contentCreatedByUserId === flaggedByUser ||
      profileIsLoggedInUserCheck === flaggedByUser
    ) {
      toast.warn(
        `Ruh Roh! Nice try but you can't report your own content silly goose :)`,
      );
      return;
    }

    const reportSubmission = {
      contenttype: contentType,
      contentid: contentInfo._id,
      contentcopy: copyOfContentForReport,
      createdbyuser: contentCreatedByUserId,
      flaggedbyuser: flaggedByUser,
      flagcategories: flagCategoriesState,
      comments: additionalCommentsState,
    };
    console.log(reportSubmission);

    const userAndNameId = {
      contentid: contentInfo._id,
      flaggedbyuser: flaggedByUser,
    };

    await axios
      .post(apiflagReportSubmission, reportSubmission)
      .then((response) => {
        toast.success(
          `Thank you for your report! Report for ${response.data.message} successfully sent`,
        );
      })
      .then(() => callApiToaddUserToNamesArray(userAndNameId))
      .then(() => setFlagFormIsToggled(false))
      .then(() => setUserHasAlreadyReportedThis(true))

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
      .put(apiaddUserToFlaggedByArray, userAndNameId)
      .then(toast.success(`your name has been added to the reported array`));
  }

  function cancelFlagFormAndRevertFlagState() {
    setFlagIconClickedByNewUser(false);
    onClose?.(); // <-- close the dialog
  }

  return (
    <form className=" mx-auto bg-primary rounded-lg max-w-7xl border border-subtleWhite">
      <div className="flex items-center justify-center py-6   bg-darkPurple ">
        <GeneralButton
          subtle
          text="Cancel"
          onClick={cancelFlagFormAndRevertFlagState}
        />
      </div>

      <div className={`-mx-3 mb-6`}>
        {/* Area to Type a comment  */}

        <div className=" mb-2 text-subtleWhite px-4 pt-2">
          <h2 className="text-center text-xl ">Report Content</h2>
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

          <div className=" bg-darkPurple border-white border-y-2 flex">
            <h3 className=" mb-2 text-xl mx-auto py-3">
              Report Inappropriate Content
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

          <div className=" bg-darkPurple border-white border-y-2 flex">
            <h3 className=" mb-2 text-xl mx-auto py-3">Additional Comments</h3>
          </div>
          <Field className="mt-2 py-2">
            <StyledTextarea
              ariaLabel="type-comments"
              onChange={(e) => setAdditionalCommentsState(e.target.value)}
              name="body"
              maxLength="500"
              placeholder="Optional"
            />
          </Field>
          <span className="text-subtleWhite">
            {`${500 - additionalCommentsState.length}/500 characters left`}
          </span>

          <Field className="text-center">
            <StyledInput
              type="submit"
              value="Submit Report"
              onClick={handleSubmitReport}
            />
          </Field>
        </div>
      </div>
    </form>
  );
}

export default AddFlagReport;
