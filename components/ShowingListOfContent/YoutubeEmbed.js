import React, { useState } from "react";

export default function YoutubeEmbed({ embedId, styling, title }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="my-4 text-center">
      {!loaded && <span className=" text-white text-xl"> Loading ... </span>}
      <iframe
        className={`mx-auto aspect-video w-11/12 lg:w-7/12 ${styling} ${
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
