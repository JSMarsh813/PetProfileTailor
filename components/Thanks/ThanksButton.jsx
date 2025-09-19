import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "react-toastify/dist/ReactToastify.css";
import ContainerForLikeShareFlag from "../ReusableSmallComponents/buttons/ContainerForLikeShareFlag";
import Thanks from "@components/ReusableSmallComponents/iconsOrSvgImages/svgImages/thanks";
export default function ThanksButton() {
  return (
    <ContainerForLikeShareFlag>
      <button
        className="w-full flex justify-center"
        // onClick={toggleLike}
        style={{ background: "transparent", border: "none", cursor: "pointer" }}
      >
        <Thanks fill="rgb(221 214 254)" />
      </button>
    </ContainerForLikeShareFlag>
  );
}
