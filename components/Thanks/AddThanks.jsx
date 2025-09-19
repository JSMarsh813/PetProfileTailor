"use client";

import { useState } from "react";
import GeneralButton from "@components/ReusableSmallComponents/buttons/GeneralButton";
import { toast } from "react-toastify";
import axios from "axios";
import { Field } from "@headlessui/react";
import StyledTextarea from "@components/FormComponents/StyledTextarea";
import StyledCheckbox from "@components/FormComponents/StyledCheckbox";
import ClosingXButton from "@components/ReusableSmallComponents/buttons/ClosingXButton";
import ThanksOptions from "@/data/ThanksOptions";

export default function AddThank({
  dataType,
  thanksBy,
  contentInfo,
  apiThanksSubmission,
  onClose,
}) {
  const [selectedThanks, setSelectedThanks] = useState([]);

  const handleSubmitThanks = async (e) => {
    e.preventDefault();

    if (!thanksBy) {
      toast.error(`Ruh Roh! You must be signed in to thank content`);
      return;
    }

    let contentCreatedByUserId = contentInfo.createdby._id;

    if (contentCreatedByUserId === thanksBy) {
      toast.warn(
        `Ruh Roh! Nice try but you can't send thanks to your own content silly goose :)`,
      );
      return;
    }

    const thanksSubmission = {
      contentType: dataType,
      contentId: contentInfo._id,
      contentCreator: contentCreatedByUserId,
      thanksBy: thanksBy,
      selectedThanks,
    };
    console.log(thanksSubmission);

    try {
      const response = await axios.post(apiThanksSubmission, thanksSubmission);

      toast.success(`Thank you! Your thank your note was successfully sent`);

      onClose?.();
    } catch (error) {
      console.log("this is an error", error);

      toast.error(
        `Ruh Roh! ${error.message} ${JSON.stringify(
          error?.response?.data?.message,
        )}`,
      );
    }
  };

  function cancelThanks() {
    onClose?.(); // <-- close the dialog
  }

  return (
    <form
      className=" mx-auto bg-primary rounded-lg w-[94vw] border border-subtleWhite"
      onSubmit={handleSubmitThanks}
    >
      <div className="flex items-center justify-end py-2   bg-secondary ">
        <ClosingXButton
          onClick={() => cancelThanks()}
          className="mr-5"
        />
      </div>

      <div className={` mb-4`}>
        <div className=" mb-2 text-subtleWhite px-4 ">
          <section className="my-6">
            <h2 className="text-center  text-2xl ">Send Thanks</h2>

            <p className="text-center mb-3">
              ❗ Note: <strong> one or more checkboxes must be selected</strong>{" "}
              to submit this form
            </p>
          </section>

          <section className="flex flex-col mx-5 my-8">
            <div className=" bg-secondary  rounded-sm flex">
              <h3 className=" mb-2 text-xl mx-auto py-3 ">Incorrect Tags </h3>
            </div>

            <div className="flex flex-col gap-4 mt-4">
              <div className="flex justify-center flex-wrap">
                {ThanksOptions.map((option) => (
                  <StyledCheckbox
                    key={option.tag}
                    label={option.tag}
                    checked={selectedThanks.includes(option.tag)}
                    onChange={(e) => setSelectedThanks(e.target.value)}
                    value={option.tag}
                  />
                ))}
              </div>
            </div>
          </section>

          <Field className="flex gap-24 justify-center">
            <GeneralButton
              text="Cancel"
              warning
              className="mx-2"
              onClick={() => cancelThanks()}
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
