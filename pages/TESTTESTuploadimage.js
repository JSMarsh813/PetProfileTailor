import { useState } from "react";
import CloudinaryUploadWidget from "../components/CloudinaryUploadWidget";
import { CldUploadWidget } from "next-cloudinary";
import React from "react";

function UploadImage() {
  const [profilePublicId, setProfilePublicId] = useState("");

  return (
    <div>
      <CldUploadWidget uploadPreset="noyhrbxs">
        {({ open }) => {
          function handleOnClick(e) {
            e.preventDefault();
            open();
          }
          return <button onClick={handleOnClick}>Upload an Image</button>;
        }}
      </CldUploadWidget>
    </div>
  );
}

export default UploadImage;
