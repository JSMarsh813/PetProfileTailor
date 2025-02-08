import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LikesButtonAndLikesLogic({
  data,
  signedInUsersId,
  apiLink,
  HeartIconStyling,
  HeartIconTextStyling,
}) {
  let [likesCount, setLikesCount] = useState(
    data.likedby == [] ? 0 : data.likedby.length,
  );

  const [dataLiked, setdataLiked] = useState(false);
  let likesColor = dataLiked ? "red" : "#87ceeb";
  let currentTargetedId = data._id;
  let userId = "";

  useEffect(() => {
    if (signedInUsersId) {
      userId = signedInUsersId;
    }
    data.likedby.includes(userId) ? setdataLiked(true) : setdataLiked(false);
  }, [userId]);

  const handlelikes = (e) => {
    {
      !signedInUsersId &&
        toast.error("Please sign in to like", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
    }

    const putLikes = async () => {
      try {
        const response = await axios.put(apiLink, {
          currentTargetedId,
          signedInUsersId,
        });

        dataLiked == true
          ? setLikesCount((likesCount -= 1))
          : setLikesCount((likesCount += 1));
        setdataLiked(!dataLiked);
      } catch (err) {
        console.log("something went wrong :(", err);
      }
    };
    putLikes();
  };

  return (
    <span>
      <label id="likesbutton">
        <input
          type="button"
          onClick={handlelikes}
          htmlFor="likesbutton"
        />

        <FontAwesomeIcon
          icon={faHeart}
          className={`${HeartIconStyling}`}
          color={likesColor}
        />

        <span className={`${HeartIconTextStyling}`}>{likesCount}</span>
      </label>
    </span>
  );
}
