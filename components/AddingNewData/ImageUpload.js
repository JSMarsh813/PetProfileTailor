import React, { useContext, createContext, useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GeneralButton from "../ReusableSmallComponents/buttons/GeneralButton";
import DisabledButton from "../ReusableSmallComponents/buttons//DisabledButton";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faCommentDots,
  faImage,
  faShareFromSquare,
  faFaceGrinWink,
  faUserTie,
  faCircleChevronDown,
  faTrashCan,
  faX,
  faCircleXmark,
  faTowerBroadcast,
} from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";

function imageUpload({ sessionFromServer }) {
  const [selectedImage, setSelectedImage] = useState();
  const [newProfileImage, setNewProfileImage] = useState("");
  const [imagePreview, setImagePreview] = useState();

  const handleImageAttachment = (e) => {
    e.preventDefault();
    setSelectedImage(e.target.files[0]);

    setImagePreview(URL.createObjectURL(e.target.files[0]));

    console.log(selectedImage);
  };

  // ########## upload image to cloudinary #############

  const handleImageUpload = async () => {
    if (!selectedImage) return;

    const formData = new FormData();

    formData.append("file", selectedImage);
    formData.append("userId", sessionFromServer.user._id);
    formData.append("upload_preset", "noyhrbxs");
    console.log(formData);

    const data = await fetch(
      "https://api.cloudinary.com/v1_1/dujellms1/image/upload",
      {
        method: "POST",
        body: formData,
      }
    ).then((r) => r.json());

    let profileImage = data.secure_url;

    setNewProfileImage(profileImage);

    // toast('Image uploaded Successfully!', { type: 'success' });
    updateUserProfileImage(profileImage);
  };
  console.log(`This is ${newProfileImage}`);
  //Works! Result: This is https://res.cloudinary.com/dujellms1/image/upload/v1673928335/profileimage/acpzgzskf3vaxjhpcesj.jpg

  // ########## upload image to current users mongoDB user document  #############

  const updateUserProfileImage = async (newProfileImage) => {
    console.log(`in function
       ${newProfileImage}`);
    //Result in functionhttps://res.cloudinary.com/dujellms1/image/upload/v1673929130/profileimage/ormkjpffjkhhv6rjm53b.jpg
    //so its getting the right data/parameter

    try {
      let res = await axios.put("/api/user/uploadprofileimage", {
        newProfileImage: newProfileImage.toString(),
      });
      //api path is correct...
      //XHR error message ==>Json in request newProfileImage	"https://res.cloudinary.com/dujellms1/image/upload/v1673930174/profileimage/b2xuq8gosdpoqifsm06x.jpg". So the request itself is correct....

      if (res.status == 200) {
        toast.success(
          "Avatar updated! Please sign back in to finish updating your avatar"
        );
        setSelectedImage("");
        setImagePreview("");
      } else if (res.error) {
        toast.error(res.error);
        console.log(res.error);
      } else {
        console.log("????");
      }
    } catch (err) {
      toast.error(err);
      console.log(err);
    }
  };

  //only run updateUserProfileImage if the state value, newProfileImage, has updated.

  // useEffect(()=>{
  //   console.log(`in useEffect ${newProfileImage}`)
  //   //when page loads
  //           //Result: in useEffect
  //   //Result after submitting image: in useEffect https://res.cloudinary.com/dujellms1/image/upload/v1673928814/profileimage/wdxjcabyzqgzp0zyx5i5.jpg

  //   if (newProfileImage!=""){
  //     updateUserProfileImage("")
  //   }
  // },[newProfileImage])

  return (
    <div className="mx-auto max-w-screen-md text-white ">
      <h1 className="mb-4 text-xl text-center border-y-2 py-2 bg-violet-700 font-semibold">
        Change Your Avatar{" "}
      </h1>

      <p className="mb-4  text-center">
        {" "}
        Choose an image. Accepted formats are .jpg, jpeg, .png and .gif.{" "}
      </p>

      <input
        onChange={handleImageAttachment}
        accept=".jpg, .png, .jpeg, .gif"
        className="fileInput mb-4"
        type="file"
      ></input>

      {/* <ToastContainer 
          position="top-center"
           limit={1} /> */}

      <div>
        <p className="mb-4">
          {" "}
          Please choose an image to make the upload button clickable
        </p>

        {selectedImage ? (
          <GeneralButton
            onClick={handleImageUpload}
            className=""
            text="Upload"
          />
        ) : (
          <DisabledButton
            onClick={handleImageUpload}
            disabled={!selectedImage}
            className="bg-blue"
            text="Upload"
          />
        )}

        {/* ##### IMAGE PREVIEW AREA  ######*/}
        {imagePreview && (
          <div className="flex justify-center">
            <div className="relative w-content">
              <img
                className="max-h-96 object-scale-down mx-auto block"
                src={imagePreview}
              />
              <FontAwesomeIcon
                icon={faCircleXmark}
                onClick={() => {
                  setSelectedImage("");
                  setImagePreview("");
                }}
                className="text-3xl text-yellow-300 mr-2 absolute top-1 right-1 justify-center drop-shadow-md"
              />
            </div>
          </div>
        )}

        <p className="mt-4">
          After uploading the new image, to finish updating your avatar please
          log out and log back in{" "}
        </p>
      </div>
    </div>
  );
}

export default imageUpload;
