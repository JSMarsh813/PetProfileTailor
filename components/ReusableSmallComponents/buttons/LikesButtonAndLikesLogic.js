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
  recentLikesRef, // 0 same as server, 1 liked, -1 unliked
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
      <span> Liked: {liked ? "true" : "false"}</span>
      <button
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
