import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";

import "@etchteam/next-pagination/dist/index.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider
      session={session}
      limit={1}
    >
      <Component {...pageProps} />

      <ToastContainer />
      <footer className="text-white py-4 px-4 bg-darkPurple border-t-2 border-violet-400 mt-4">
        <h6> Credits: </h6>
        <span className="ml-6">
          “Bat” icon by Megan Mitchell, from thenounproject.com.
        </span>
      </footer>
    </SessionProvider>
  );
}

export default MyApp;
