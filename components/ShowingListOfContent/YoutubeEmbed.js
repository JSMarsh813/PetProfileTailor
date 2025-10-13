import React, { useState } from "react";
import GeneralButton from "@components/ReusableSmallComponents/buttons/GeneralButton";
import LoadingSpinner from "../ui/LoadingSpinner";

export default function YoutubeEmbed({
  embedId,
  styling,
  title,
  showVideoFunction,
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="mt-2 py-4 text-center bg-secondary">
      {!loaded && <LoadingSpinner />}

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
