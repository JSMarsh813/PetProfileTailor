import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "react-toastify/dist/ReactToastify.css";
import { useLikeState } from "@hooks/useLikeState";
import ContainerForLikeShareFlag from "./ContainerForLikeShareFlag";

export default function LikesButtonAndLikesLogic({
  data,
  signedInUsersId,
  apiBaseLink,
  HeartIconStyling,
  HeartIconTextStyling,
  likedSetRef,
  recentLikesRef,
}) {
  console.log("signedInUsersId in likes button", signedInUsersId);
  const { liked, likeCount, isProcessing, toggleLike } = useLikeState({
    data,
    userId: signedInUsersId,
    likedSetRef,
    apiBaseLink,
    recentLikesRef,
  });

  return (
    <ContainerForLikeShareFlag>
      <button
        className="w-full"
        disabled={isProcessing}
        onClick={toggleLike}
        style={{ background: "transparent", border: "none", cursor: "pointer" }}
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
