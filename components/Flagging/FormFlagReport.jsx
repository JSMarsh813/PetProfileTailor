import { useState } from "react";
import GeneralButton from "@components/ReusableSmallComponents/buttons/GeneralButton";
import { toast } from "react-toastify";
import axios from "axios";
import { Field } from "@headlessui/react";
import StyledTextarea from "../FormComponents/StyledTextarea";
import StyledCheckbox from "../FormComponents/StyledCheckbox";
import ClosingXButton from "@components/ReusableSmallComponents/buttons/ClosingXButton";

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
    if (!flaggedByUser) {
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
      contentcreatedby: contentCreatedByUserId,
      reportedby: flaggedByUser,
      reportcategories: flagCategoriesState,
      comments: additionalCommentsState,
    };
    console.log(reportSubmission);

    // const userAndNameId = {
    //   contentid: contentInfo._id,
    //   flaggedbyuser: flaggedByUser,
    // };

    await axios
      .post(apiflagReportSubmission, reportSubmission)
      .then((response) => {
        toast.success(
          `Thank you for your report! Report for ${response.data.message} successfully sent`,
        );
      })
      // .then(() => callApiToaddUserToNamesArray(userAndNameId))
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

  // function callApiToaddUserToNamesArray(userAndNameId) {
  //   axios
  //     .put(apiaddUserToFlaggedByArray, userAndNameId)
  //     .then(toast.success(`your name has been added to the reported array`));
  // }

  function cancelFlagFormAndRevertFlagState() {
    setFlagIconClickedByNewUser(false);
    onClose?.(); // <-- close the dialog
  }

  return (
    <form
      className=" mx-auto bg-primary rounded-lg max-w-7xl border border-subtleWhite "
      onSubmit={handleSubmitReport}
    >
      <div className="flex items-center justify-end py-2   bg-secondary ">
        <ClosingXButton
          onClick={cancelFlagFormAndRevertFlagState}
          className="mr-5"
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

          <div className=" bg-secondary border-white border-y-2 flex">
            <h3 className=" mb-2 text-xl mx-auto py-3">
              Report Inappropriate Content
            </h3>
          </div>

          <div className="flex flex-col gap-4 my-4">
            <StyledCheckbox
              label="Hate"
              description="Slurs, racist or sexist stereotypes, Incitement of fear or discrimination..."
              checked={flagCategoriesState.includes("Hate")}
              onChange={handleFlagCategoriesState}
              className="ml-4"
              value="Hate"
            />

            <StyledCheckbox
              label="Violent Speech"
              description="Violent Threats, Wish of Harm, Coded Incitement of Violence"
              checked={flagCategoriesState.includes("Violent Speech")}
              onChange={handleFlagCategoriesState}
              className="ml-4"
              value="Violent Speech"
            />

            <StyledCheckbox
              label="Abuse and Harassment"
              description="Insults, unwanted advances, targeted harassment and inciting harassment"
              checked={flagCategoriesState.includes("Abuse and Harassment")}
              onChange={handleFlagCategoriesState}
              className="ml-4"
              value="Abuse and Harassment"
            />

            <StyledCheckbox
              label="Privacy"
              description="Sharing private information of others, threatening to share or expose private information"
              checked={flagCategoriesState.includes("Privacy")}
              onChange={handleFlagCategoriesState}
              className="ml-4"
              value="Privacy"
            />

            <StyledCheckbox
              label="Spam"
              description="Fake engagement, scams, malicious links"
              checked={flagCategoriesState.includes("Spam")}
              onChange={handleFlagCategoriesState}
              className="ml-4"
              value="Spam"
            />

            <StyledCheckbox
              label="Sensitive or disturbing content"
              description="Gratuitous gore or violence, nudity & sexual behavior"
              checked={flagCategoriesState.includes(
                "Sensitive or disturbing content",
              )}
              onChange={handleFlagCategoriesState}
              className="ml-4"
              value="Sensitive or disturbing content"
            />

            <StyledCheckbox
              label="None of these"
              description="Please give us more information in the comments textbox below"
              checked={flagCategoriesState.includes("None of these")}
              onChange={handleFlagCategoriesState}
              className="ml-4"
              value="None of these"
            />
          </div>

          <div className=" bg-secondary border-white border-y-2 flex">
            <h3 className=" mb-2 text-xl mx-auto py-3">Additional Comments</h3>
          </div>
          <Field className="mt-4 mx-4 py-2">
            <StyledTextarea
              ariaLabel="type-comments"
              onChange={(e) => setAdditionalCommentsState(e.target.value)}
              name="body"
              maxLength="500"
              placeholder="Optional"
            />
            <span className="text-subtleWhite mt-4 block ml-1">
              {`${500 - additionalCommentsState.length}/500 characters left`}
            </span>
          </Field>

          <Field className="flex gap-24 justify-center">
            <GeneralButton
              subtle
              text="Cancel"
              onClick={cancelFlagFormAndRevertFlagState}
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
