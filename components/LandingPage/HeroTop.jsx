import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBullseye,
  faFaceGrinWink,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";

const HeroTop = ({ updateImpactfulState }) => {
  return (
    <div
      className="hero min-h-fit font-serif 
border-y-4 border-darkPurple"
      style={{
        backgroundImage: `url("/pugs.webp")`,
        fontFamily: "Comfortaa",
      }}
    >
      <div className="hero-overlay bg-opacity-80"></div>
      <div className="hero-content text-center text-neutral-content mb-10">
        <div className="max-w-xl text-white">
          <h1 className="mb-5 text-5xl text-yellow-300 font-black">
            Welcome to <br /> Pet Profile Tailor!
          </h1>
          <p className="mb-5 text-xl">
            Naming your new pet or creating engaging profiles for adoptable pets
            can feel ruff! We&apos;ve been there! And we&apos;re here to help.
          </p>
          <p className="mb-5 text-xl">
            Pet profile tailor is a community powered assistant which helps you
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
