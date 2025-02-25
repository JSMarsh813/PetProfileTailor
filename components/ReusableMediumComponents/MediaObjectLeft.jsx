import GeneralButton from "../ReusableSmallComponents/buttons/GeneralButton";
import ListWithPawPrintIcon from "../ReusableSmallComponents/ListWithPawPrintIcon";
import Image from "next/image";

const MediaObject = ({
  image,
  listOfText,
  buttonTextLeft,
  buttonTextRight,
  buttonTextLeftLink,
  buttonTextRightLink,
  alttext,
  imgwidth,
  imgheight,
}) => {
  return (
    <div className="flex justify-center my-6 flex-col md:flex-row sm:ml-2">
      <div
        className="self-center 
            shadow-lg shadow-slate-900/70
            border-t-8  border-l-8 border-amber-300"
      >
        <Image
          className=""
          src={image}
          width={imgwidth}
          height={imgheight}
          alt={alttext}
          style={{
            maxWidth: "100%",
            height: "auto",
          }}
        />
      </div>
      <div
        className="max-w-1/2  mr-8 self-center 
  "
      >
        <ul className="text-base md:text-lg text-white pb-8 pl-4">
          {listOfText.map((sentence) => (
            <ListWithPawPrintIcon
              text={sentence}
              key={sentence}
            />
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
