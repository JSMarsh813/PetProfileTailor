"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "react-toastify/dist/ReactToastify.css";
import { useLikeState } from "@hooks/useLikeState";
import ContainerForLikeShareFlag from "./ContainerForLikeShareFlag";
import { useSession } from "next-auth/react";

export default function LikesButtonAndLikesLogic({
  data,
  signedInUsersId,
  apiBaseLink,
  HeartIconStyling,
  HeartIconTextStyling,
  setShowLikesSignInMessage,
  dataType,
}) {
  const { data: session } = useSession();
  // console.log("session in likes button", session);

  // console.log("signedInUsersId in likes button", signedInUsersId);
  // console.log("datatype in likesbutton", dataType);
  const { liked, likeCount, isProcessing, toggleLike } = useLikeState({
    data,
    dataType,
    userId: signedInUsersId,
    apiBaseLink,
  });

  const toggleLikeIfSignedIn = function () {
    if (!session) {
      setShowLikesSignInMessage("you must be signed in to like content");
      return;
    }

    toggleLike();
  };

  return (
    <ContainerForLikeShareFlag>
      <button
        className="w-full"
        disabled={isProcessing}
        onClick={() => toggleLikeIfSignedIn()}
        style={{ background: "transparent", border: "none", cursor: "pointer" }}
        aria-label={liked ? "Unlike" : "Like"}
      >
        <FontAwesomeIcon
          icon={faHeart}
          className={`${HeartIconStyling}`}
          color={liked ? "red" : "white"}
        />

        <span className={`${HeartIconTextStyling}`}>{likeCount}</span>
      </button>
    </ContainerForLikeShareFlag>
  );
}
