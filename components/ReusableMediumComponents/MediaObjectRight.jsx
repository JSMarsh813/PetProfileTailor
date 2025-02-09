import GeneralButton from "../ReusableSmallComponents/buttons/GeneralButton";
import ListWithPawPrintIcon from "../ReusableSmallComponents/ListWithPawPrintIcon";
import Image from "next/image";

const MediaObjectRight = ({
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
        className="max-w-md ml-4 mr-8 self-center 
    "
      >
        <ul className="text-base md:text-lg text-white pb-8 ">
          {listOfText.map((sentence) => (
            <ListWithPawPrintIcon
              text={sentence}
              key={sentence}
            />
          ))}
        </ul>

        <div className="flex items-center mb-4">
          {buttonTextLeft && (
            <a href={buttonTextLeftLink}>
              <GeneralButton text={buttonTextLeft} />
            </a>
          )}

          {buttonTextRight && (
            <a
              className="ml-2"
              href={buttonTextRightLink}
            >
              <GeneralButton text={buttonTextRight} />
            </a>
          )}
        </div>
      </div>
      <div
        className="self-center w-80  shadow-xl shadow-slate-900/70
        border-b-8  border-r-8 border-amber-300 "
      >
        <Image
          className=""
          width={imgwidth}
          height={imgheight}
          src={image}
          alt={alttext}
          sizes="100vw"
          style={{
            width: "100%",
            height: "auto",
          }}
        />
      </div>
    </div>
  );
};
export default MediaObjectRight;
