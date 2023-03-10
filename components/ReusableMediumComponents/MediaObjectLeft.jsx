import GeneralButton from "../ReusableSmallComponents/buttons/GeneralButton";
import ListWithPawPrintIcon from "../ReusableSmallComponents/ListWithPawPrintIcon";
const MediaObject = ({
  image,
  listOfText,
  buttonTextLeft,
  buttonTextRight,
  buttonTextLeftLink,
  buttonTextRightLink,
}) => {
  return (
    <div className="flex justify-center w-screen my-6 flex-col md:flex-row">
      <div className="self-center">
        <img
          className="max-h-96 mx-auto mr-12 
            shadow-lg shadow-slate-900/70
            border-t-8  border-l-8 border-amber-300"
          src={image}
          alt=""
        />
      </div>

      <div
        className="max-w-1/2  mr-8 self-center 
  "
      >
        <ul className="text-lg text-white pb-8 pl-4">
          {listOfText.map((sentence) => (
            <ListWithPawPrintIcon text={sentence} />
          ))}
        </ul>

        <div className="flex items-center max-w-2xl ml-4">
          {buttonTextLeft && (
            <a href={buttonTextLeftLink}>
              <GeneralButton
                text={buttonTextLeft}
                className="shadow-lg"
              />
            </a>
          )}
          {buttonTextRight && (
            <a href={buttonTextRightLink}>
              <GeneralButton
                text={buttonTextRight}
                className="shadow-lg"
              />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
export default MediaObject;
