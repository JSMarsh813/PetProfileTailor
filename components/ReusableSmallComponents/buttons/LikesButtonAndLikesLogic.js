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

  dataType,
}) {
  console.log("signedInUsersId in likes button", signedInUsersId);
  console.log("datatype in likesbutton", dataType);
  const { liked, likeCount, isProcessing, toggleLike } = useLikeState({
    data,
    dataType,
    userId: signedInUsersId,
    apiBaseLink,
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
