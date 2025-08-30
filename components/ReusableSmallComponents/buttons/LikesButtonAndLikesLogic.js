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
  likedSetRef,
  toggleLike,
}) {
  const [liked, setLiked] = useState(likedSetRef.current.has(data._id));
  const [likedCount, setLikedCount] = useState(data.likedbycount);

  const handleClick = () => {
    if (liked) {
      likedSetRef.current.delete(data._id);
      // updating the ref since if they went back a page, we'd have to remember which names they freshly liked/unliked when that page of 50 names is rendered again
      setLikedCount((prev) => prev - 1);
    } else {
      likedSetRef.current.add(data._id);
      setLikedCount((prev) => prev + 1);
    }
    setLiked(!liked);
    // call API
    toggleLike(data._id);
  };

  return (
    <span>
      <span> Liked: {liked ? "true" : "false"}</span>
      <button
        onClick={handleClick}
        style={{ background: "transparent", border: "none", cursor: "pointer" }}
      >
        <FontAwesomeIcon
          icon={faHeart}
          className={`${HeartIconStyling}`}
          color={liked ? "red" : "#87ceeb"}
        />

        <span className={`${HeartIconTextStyling}`}>{likedCount}</span>
      </button>
    </span>
  );
}
