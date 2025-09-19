import ContainerForLikeShareFlag from "../ReusableSmallComponents/buttons/ContainerForLikeShareFlag";
import Thanks from "@components/ReusableSmallComponents/iconsOrSvgImages/svgImages/thanks";
export default function ThanksButton({ onClick }) {
  return (
    <ContainerForLikeShareFlag>
      <button
        className="w-full flex justify-center"
        // onClick={toggleLike}
        style={{ background: "transparent", border: "none", cursor: "pointer" }}
        onClick={onClick}
      >
        <Thanks fill="rgb(221 214 254)" />
      </button>
    </ContainerForLikeShareFlag>
  );
}
