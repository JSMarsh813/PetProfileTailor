import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import {
  faBullseye,
  faFaceGrinWink,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";
import Image from "next/image";
const HeroTop = ({
  updateImpactfulState,
  updateFunState,
  updateTailorState,
}) => {
  const [hover, setHover] = useState(false);
  const handleMouseEnterForImage = () => {
    setHover(true);
  };

  const handleMouseLeaveForImage = () => {
    setHover(false);
  };

  return (
    <div
      className="hero min-h-fit font-serif 
border-y-4 border-darkPurple bg-black"
      // style={{
      //   backgroundImage: `url(${hover ? "/pugStillImage.png" : "/pugs.webp"})`,
      //   fontFamily: "Comfortaa",
      // }  }

      onMouseEnter={handleMouseEnterForImage}
      onMouseLeave={handleMouseLeaveForImage}
    >
      <div className="hero-overlay relative w-screen z-10 opacity-20">
        {hover ? (
          <Image
            priority
            src="/pugStillImage.png"
            fill
            className="opacity-80"
            objectFit="cover"
            objectPosition="center"
            alt=""
          />
        ) : (
          <Image
            priority
            src="/pugs.webp"
            fill
            objectFit="cover"
            objectPosition="center"
            alt=""
          />
        )}
      </div>
      <div className="hero-content text-center text-neutral-content mb-10 z-20">
        <div className="max-w-xl text-white">
          <h1 className="mb-5 text-3xl md:text-5xl text-yellow-300 font-black">
            Welcome to <br /> Tailored Pet Names!
          </h1>
          <p className="mb-5 text-xl">
            Naming your new pet or creating engaging profiles for adoptable pets
            can feel ruff! We&apos;ve been there! And we&apos;re here to help.
          </p>
          <p className="mb-5 text-xl">
            Tailored Pet Names is a community powered assistant which helps you
            find that perfect name or create pet profiles which are:
          </p>

          <section className="flex justify-center gap-3 flex-wrap">
            <div className="flex-1">
              <FontAwesomeIcon
                icon={faBullseye}
                className="text-2xl"
                color="yellow"
              />

              <button
                className="btn btn-primary w-full mt-2 bg-yellow-300 text-violet-900 font-black text-base h-16
                           
                           hover:text-yellow-300"
                onClick={updateImpactfulState}
              >
                Impactful
              </button>
            </div>

            <div className="flex-1">
              <FontAwesomeIcon
                icon={faFaceGrinWink}
                className="text-2xl fa-bounce"
                color="yellow"
              />

              <button
                className="btn btn-primary w-full mt-2 bg-yellow-300 text-violet-900 text-base h-16
                            
                            hover:text-yellow-300"
                onClick={updateFunState}
              >
                Fun
              </button>
            </div>

            <div className="flex-1">
              <FontAwesomeIcon
                icon={faUserTie}
                className="text-2xl"
                color="yellow"
              />
              <button
                className="btn btn-primary w-full mt-2 bg-yellow-300  text-violet-900 text-base h-16
                               
                               hover:text-yellow-300"
                onClick={updateTailorState}
              >
                Tailor Fitted
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default HeroTop;
