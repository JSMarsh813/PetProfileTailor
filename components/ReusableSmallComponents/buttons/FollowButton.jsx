import React, { useState, useEffect } from "react";
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { toast, ToastContainer } from "react-toastify";

export default function FollowButton({
  data,
  session,
  apiLink,
  FollowIconStyling,
  FollowTextStyling,
}) {
  const [userFollowed, setUserFollowed] = useState(false);
  let userToFollowId = data._id;
  let userId = "";
  {
    console.log(data._id);
  }

  useEffect(() => {
    if (session) {
      userId = session.user._id;
    }

    let searchingInFollowers = data.followers.find(
      (follower) => follower._id == userId
    );
    console.log(searchingInFollowers);
    searchingInFollowers != undefined
      ? setUserFollowed(true)
      : setUserFollowed(false);
  }, [userId]);

  const handleFollows = (e) => {
    !session && toast.error("Please sign in to follow users");
    let userId = session.user._id;

    const putFollows = async () => {
      try {
        const response = await axios.put("/api/user/updatefollows/", {
          userToFollowId,
          userId,
          userFollowed,
        });

        setUserFollowed(!userFollowed);
      } catch (err) {
        console.log("something went wrong :(", err);
      }
    };
    putFollows();
  };

  return (
    <>
      {data._id == userId && <span>its you </span>}
      {userFollowed ? (
        <label
          className="justify-self-end
             mr-2 mx-auto bg-red-500 hover:bg-red-400 border-b-4 border-red-700 
                      hover:border-yellow-500 text-center py-2 px-4 rounded"
        >
          <input
            style={{ display: "none" }}
            type="checkbox"
            checked={userFollowed}
            onChange={handleFollows}
          />
          <FontAwesomeIcon
            icon={faUserPlus}
            className={`mr-2${FollowIconStyling}`}
          />

          <span className={`${FollowTextStyling}`}>Unfollow</span>
        </label>
      ) : (
        <label
          className="justify-self-end
             mr-2 mx-auto bg-yellow-500 hover:bg-yellow-400 border-b-4 border-yellow-700 text-darkPurple
                      hover:border-yellow-500 text-center py-2 px-4 rounded"
        >
          <input
            style={{ display: "none" }}
            type="checkbox"
            checked={userFollowed}
            onChange={handleFollows}
          />
          <FontAwesomeIcon
            icon={faUserPlus}
            className={`mr-2${FollowIconStyling}`}
          />

          <span className={`${FollowTextStyling}`}>Follow</span>
        </label>
      )}
    </>
  );
}
