import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faCommentDots,
  faFaceGrinWink,
  faUserTie,
  faCircleChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";
import React, { useEffect, useState } from "react";
// import individualuser from '../models/User'
// import names from '../models/individualNames'
import { useSession, getSession } from "next-auth/react";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LikesButtonAndLikesLogic from "../ReusableMediumComponents/LikesButtonAndLikesLogic";

function Namelisting({ name, session }) {
  console.log(`this is name ${JSON.stringify(name)}`);

  let [currentTargetedId, setCurrentTargetedNameId] = useState(name._id);
  let [openComment, SetOpenComments] = useState(false);

  // useEffect(() => {
  //     // let data= (!localStorage.getItem("session"))?
  //     //     data="0":
  //     //     data=JSON.parse(localStorage.getItem("session")).toString()

  //     //we had to convert mongo's object ID to a JSON object, JSON.stringify to store in local storage when we logged in at login.js
  //         //however JSON's objects are stored with two "", so it stored as ""145555ect""
  //         // so data=="145555ect" would always be false since ""145555ect""!= "145555ect" (see the "")
  //         //so we need to use JSON.parse to make it a useable string

  //     // console.log(data);
  //     // setUserId(data)
  //     setCurrentTargetedNameId(session.user._id)

  // }, [])

  return (
    <tr>
      {/* start of likes checkbox section*/}
      <td className="text-purple-200 border-b-2 border-amber-300 px-4 py-2 text-left font-black">
        <LikesButtonAndLikesLogic
          data={name}
          currentTargetedId={currentTargetedId}
          session={session}
          apiLink={`http://localhost:3000/api/auth/updateLikes`}
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
      {/* {console.log((name.tags))}
{console.log(Array.isArray(name.tags))} */}

      {/* {(openComment)&& <div>
   "comments!"
  </div>} */}
    </tr>
  );
}

export default Namelisting;
