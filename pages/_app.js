import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";

import "@etchteam/next-pagination/dist/index.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Router from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faMessage } from "@fortawesome/free-solid-svg-icons";

import Head from "next/head";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider
      session={session}
      limit={1}
    >
      <Head>
        <title>
          Improve Adoption Rates by Creating Impactful, Fun, and Tailor-Fitted
          Pet Adoption Profiles!
        </title>
        <meta
          name="Pet Profile Tailor"
          content="Pet profile tailor is a community powered assistant which helps you find the perfect pet name or create pet profiles which are impactful, fun, and tailor fitted. Animal welfare professionals can use the community submitted names or descriptions to create engaging pet profiles to improve adoption rates! "
        />
      </Head>
      <Component {...pageProps} />
      <ToastContainer />
      <footer className="text-white py-4 px-4 bg-darkPurple border-t-2 border-violet-400 mt-4 flex">
        <div className="flex-1">
          <h6> Credits: </h6>
          <span>“Bat” icon by Megan Mitchell, from thenounproject.com.</span>
        </div>

        <div className="flex-end">
          <h4> Contact: </h4>

          <span className="block">
            <FontAwesomeIcon
              icon={faEnvelope}
              className="mr-2"
            />
            <button
              type="button"
              onClick={() => Router.push("mailto:petprofiletailor@gmail.com")}
            >
              Email
            </button>
          </span>

          <span className="block">
            <a href="https://twitter.com/Janetthedev">
              <FontAwesomeIcon
                icon={faMessage}
                className="mr-2"
              />
              Message On Twitter
            </a>
          </span>
        </div>
      </footer>
    </SessionProvider>
  );
}

export default MyApp;
