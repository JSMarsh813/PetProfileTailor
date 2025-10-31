"use client";

import { useState } from "react";

import NewNameWithTagsData from "@components/AddingNewData/addingName";
import PageTitleWithImages from "@components/ReusableSmallComponents/TitlesOrHeadings/PageTitleWithImages";
import { useSession } from "next-auth/react";
import CheckIfContentExists from "@/components/AddingNewData/CheckIfContentExists";

function AddNewNameWithTags() {
  const { data: session } = useSession();
  const [nameCheck, setNameCheck] = useState("");
  const [nameSubmissionMessage, setNameSubmissionMessage] = useState("");
  const [resetCheckContent, setResetCheckContent] = useState(false);
  const [checkIsProcessing, setCheckIsProcessing] = useState(false);

  const maxContentLength = 50;

  return (
    <div className="min-h-fit  overflow-hidden text-white w-full">
      <PageTitleWithImages
        imgSrc="bg-[url('https://arc-anglerfish-washpost-prod-washpost.s3.amazonaws.com/public/Z5QQMNJZGJDSVJFNHHR3QYNMCE.jpg')] "
        title="Find A"
        title2="Name"
      />

      <div className="mx-auto mt-4 flex justify-center text-center flex-col">
        <div>
          <input
            type="text"
            className={`bg-secondary border-subtleWhite rounded-2xl mr-2 ${
              checkIsProcessing &&
              "disabled:bg-errorBackgroundColor   disabled:text-errorTextColor disabled:border-errorBorderColor disabled:cursor-not-allowed"
            }`}
            value={nameCheck}
            id="checkExists"
            disabled={checkIsProcessing}
            maxLength="50"
            onChange={(e) => {
              setNameCheck(e.target.value.trimStart());
              if (nameSubmissionMessage !== "") {
                setNameSubmissionMessage("");
              }
              setResetCheckContent((prev) => !prev);
            }}
          />
          <span className="block mt-3">
            {`${
              maxContentLength - nameCheck.length
            }/${maxContentLength} characters left`}{" "}
          </span>
        </div>

        <CheckIfContentExists
          apiString="/api/names/check-if-content-exists/"
          disabled={false}
          contentType="names"
          showFullContent={true}
          resetTrigger={resetCheckContent}
          addNamesPage={true}
          value={nameCheck}
          checkIsProcessing={checkIsProcessing}
          setCheckIsProcessing={setCheckIsProcessing}
        />
      </div>
    </div>
  );
}

export default AddNewNameWithTags;
