import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "react-toastify/dist/ReactToastify.css";
import { useLikeState } from "../../../hooks/useLlikeState";

export default function LikesButtonAndLikesLogic({
  data,
  signedInUsersId,
  apiBaseLink,
  HeartIconStyling,
  HeartIconTextStyling,
  likedSetRef,
  recentLikesRef,
}) {
  const { liked, likeCount, isProcessing, toggleLike } = useLikeState({
    data,
    userId: signedInUsersId,
    likedSetRef,
    apiBaseLink,
    recentLikesRef,
  });

  return (
    <span>
      <button
        disabled={isProcessing}
        onClick={toggleLike}
        style={{ background: "transparent", border: "none", cursor: "pointer" }}
      >
        <FontAwesomeIcon
          icon={faHeart}
          className={`${HeartIconStyling}`}
          color={liked ? "red" : "#87ceeb"}
        />

        <span className={`${HeartIconTextStyling}`}>{likeCount}</span>
      </button>
    </span>
  );
}
