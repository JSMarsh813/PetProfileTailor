import React, { useState } from "react";
import GeneralButton from "../ReusableSmallComponents/buttons/GeneralButton";

export default function YoutubeEmbed({
  embedId,
  styling,
  title,
  showVideoFunction,
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="mt-2 py-4 text-center bg-darkPurple">
      {!loaded && <span className=" text-white text-xl"> Loading ... </span>}

      <GeneralButton
        text="close X"
        subtle
        className={`mb-3 mx-auto ${loaded ? "block" : "hidden"}`}
        onClick={() => showVideoFunction(false)}
        type="button"
      />

      <iframe
        className={`mx-auto aspect-video w-[90vw] max-w-[800px] lg:w-5/12 ${styling} ${
          loaded ? "block" : "hidden"
        }`}
        width="mx-auto"
        src={`https://www.youtube-nocookie.com/embed/${embedId}`}
        title={`${title}`}
        allow="web-share"
        onLoad={() => setLoaded(true)}
        allowFullScreen
      ></iframe>
    </div>
  );
}
