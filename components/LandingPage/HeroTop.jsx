"use client";

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
  mx-auto overflow-hidden"
      onMouseEnter={handleMouseEnterForImage}
      onMouseLeave={handleMouseLeaveForImage}
    >
      <div className="hero-overlay  relative  z-10 opacity-20 ">
        {hover ? (
          <Image
            src="/pugStillImage.png"
            fill
            className="opacity-80"
            style={{ objectPosition: "center", objectFit: "cover" }}
            alt=""
          />
        ) : (
          <Image
            priority
            src="/pugs.webp"
            fill
            style={{ objectPosition: "center", objectFit: "cover" }}
            alt=""
          />
        )}
      </div>
      <div className="hero-content text-center text-neutral-content mb-10 z-20  ">
        {/* hero-content is from daisy ui */}
        <div className="max-w-xl text-subtleWhite">
          <h1 className="mb-5 text-3xl md:text-4xl text-yellow-300 font-black">
            Welcome to <br /> Tailored Pet Names!
          </h1>
          <p className="mb-5 text-base md:text-xl">
            Naming your new pet or creating engaging profiles for adoptable pets
            can feel ruff! We&apos;ve been there! And we&apos;re here to help.
          </p>
          <p className="mb-5 text-base md:text-xl">
            Tailored Pet Names is a community powered assistant which helps you
            find that perfect name or create pet profiles which are:
          </p>

          <section className="flex justify-center gap-3 flex-wrap">
            <div className="flex-1">
              <FontAwesomeIcon
                icon={faFaceGrinWink}
                className="text-2xl fa-bounce"
                color="white"
              />

              <button
                className="btn btn-primary w-full mt-2 shadow-lg shadow-secondary bg-subtleBackground text-white hover:text-white border-b-4 border-subtleWhite hover:border-blue-500 hover:bg-blue-400 font-black text-md md:text-base h-16 rounded-full tracking-widest"
                onClick={updateFunState}
              >
                Fun
              </button>
            </div>
            <div className="flex-1">
              <FontAwesomeIcon
                icon={faBullseye}
                className="text-2xl"
                color="white"
              />

              <button
                className="btn btn-primary w-full mt-2 shadow-lg shadow-secondary bg-subtleBackground text-white hover:text-white border-b-4 border-subtleWhite hover:border-blue-500 hover:bg-blue-400 font-black text-md md:text-base h-16 rounded-full tracking-widest focus:ring-white"
                onClick={updateImpactfulState}
              >
                Impactful
              </button>
            </div>

            <div className="flex-1">
              <FontAwesomeIcon
                icon={faUserTie}
                className="text-2xl"
                color="white"
              />
              <button
                className="btn btn-primary w-full mt-2 shadow-lg shadow-secondary bg-subtleBackground text-white hover:text-white border-b-4 border-subtleWhite hover:border-blue-500 hover:bg-blue-400 font-black text-md md:text-base h-16 rounded-full tracking-widest px-0"
                onClick={updateTailorState}
              >
                Fitting
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default HeroTop;
