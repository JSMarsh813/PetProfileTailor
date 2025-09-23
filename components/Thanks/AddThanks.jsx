"use client";

import { useState } from "react";
import GeneralButton from "@components/ReusableSmallComponents/buttons/GeneralButton";
import { toast } from "react-toastify";
import axios from "axios";
import { Field } from "@headlessui/react";
import StyledCheckbox from "@components/FormComponents/StyledCheckbox";
import ClosingXButton from "@components/ReusableSmallComponents/buttons/ClosingXButton";
import ThanksOptions from "@/data/ThanksOptions";
import { useSession } from "next-auth/react";

export default function AddThank({
  dataType,
  contentInfo,
  apiThanksSubmission,
  onClose,
}) {
  const [selectedThanks, setSelectedThanks] = useState([]);
  const { data: session } = useSession();
  const thanksBy = session?.user?.id;

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
      messages: selectedThanks,
    };
    console.log(thanksSubmission);

    try {
      const response = await axios.post(apiThanksSubmission, thanksSubmission);

      toast.success(`Thank you! Your thank your note was successfully sent`);
      console.log("thanks response in add thanks", response);

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
      className=" mx-auto bg-primary rounded-lg max-w-7xl w-[94vw] border border-subtleWhite"
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
              <h3 className=" mb-2 text-xl mx-auto py-3 ">Thanks Options </h3>
            </div>

            <div className="flex flex-col gap-4 mt-4">
              <p className="text-center">
                {" "}
                Choose as many options as you like. You can send an entire
                litter worth of thanks if you&apos;re feeling it 🐶🐱!
              </p>
              <p className="text-center">
                However to avoid spam, you can only thank a single piece of
                content 10 times.
              </p>
              <p className="text-center">
                Thanks can not be edited or deleted.
              </p>
              <div className="flex-col md:flex-row flex justify-center align-items-center md:flex-wrap gap-x-3 gap-y-8 mx-auto my-6">
                {ThanksOptions.map((option) => (
                  <StyledCheckbox
                    key={option.tag}
                    label={option.tag}
                    checked={selectedThanks.includes(option.tag)}
                    onChange={(e) =>
                      setSelectedThanks((prev) =>
                        prev.includes(e.target.value)
                          ? prev.filter((tag) => tag !== e.target.value)
                          : [...prev, e.target.value],
                      )
                    }
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
