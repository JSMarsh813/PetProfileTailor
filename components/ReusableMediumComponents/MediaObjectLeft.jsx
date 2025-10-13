import GeneralButton from "@components/ReusableSmallComponents/buttons/GeneralButton";
import ListWithPawPrintIcon from "@components/ReusableSmallComponents/ListWithPawPrintIcon";
import Image from "next/image";
import LinkButton from "@components/ReusableSmallComponents/buttons/LinkButton";

const MediaObject = ({
  image,
  listOfText,
  buttonText,
  buttonTextLink,

  buttonStyle,
  alttext,
  imgwidth,
  imgheight,
}) => {
  return (
    <div className="flex justify-center my-6 flex-col md:flex-row sm:ml-2">
      <div
        className="self-center 
           
          "
      >
        <Image
          className=""
          src={image}
          width={imgwidth}
          height={imgheight}
          alt={alttext}
          style={{
            maxWidth: "100%",
            width: "auto",
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
          {buttonText && buttonStyle === "subtle" ? (
            <LinkButton
              href={buttonTextLink}
              text={buttonText}
              subtle
            />
          ) : (
            <LinkButton
              href={buttonTextLink}
              text={buttonText}
              defaultStyle
            />
          )}
        </div>
      </div>
    </div>
  );
};
export default MediaObject;
