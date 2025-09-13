"use client";

import React, { useEffect, useState } from "react";
import LikesButtonAndLikesLogic from "@components/ReusableSmallComponents/buttons/LikesButtonAndLikesLogic";

function Namelisting({ name, session, signedInUsersId }) {
  let [currentTargetedId, setCurrentTargetedNameId] = useState(name._id);
  let [openComment, SetOpenComments] = useState(false);
  console.log("signedInUsersId in nameListing", signedInUsersId);
  return (
    <tr>
      {/* start of likes checkbox section*/}
      <td className="text-purple-200 border-b-2 border-amber-300 px-4 py-2 text-left font-black">
        <LikesButtonAndLikesLogic
          data={name}
          signedInUsersid={signedInUsersId}
          currentTargetedId={currentTargetedId}
          session={session}
          apiLink="/api/names/updateLikes"
        />
      </td>
      {/* end of likes checkbox section*/}

      <td className="text-purple-200 border-b-2 border-amber-300 px-4 py-2 text-left font-black">
        {name.name}
      </td>

      <td className="border-b-2 border-amber-200 px-4 py-2 text-left font-medium">
        {name.description}
      </td>

      <td className="border-b-2 border-amber-100 px-4 py-2 text-left font-medium">
        {name.tags.map((names) => names).join(", ")}
      </td>
    </tr>
  );
}

export default Namelisting;
