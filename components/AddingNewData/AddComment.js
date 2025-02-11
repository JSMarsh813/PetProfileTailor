import React, { useState, useEffect } from "react";
import GeneralButton from "../ReusableSmallComponents/buttons/GeneralButton";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";

function AddComment({
  replyingtothisid,
  replyingtothiscontent,
  parentcommentid,
  sessionFromServer,
  apiLink,
  signedInUsersId,
  setThereIsANewComment,
  setThereIsANewReply,
  setReplying,
}) {
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [description, setDescription] = useState("");
  const [createdby, setCreatedBy] = useState();
  const [image, setImage] = useState([]);

  useEffect(() => {
    setCreatedBy(signedInUsersId);
  }, [sessionFromServer]);

  const commentSubmission = async (e) => {
    e.preventDefault();
    //you need to pass the image directly into this function, otherwise it'll try to grab from state too early and thus you'll get "" for the image
    if (!description) {
      toast.error(`Ruh Roh! A description is required`);
      return;
    }
    if (createdby == "") {
      toast.error(`Ruh Roh! You must be signed in to add comments`);
      return;
    }

    const commentSubmission = {
      image: image,
      parentcommentid: parentcommentid,
      replyingtothisid: replyingtothisid,
      description: description,
      createdby: createdby,
      replyingtothiscontent: replyingtothiscontent,
    };

    await axios
      .post(apiLink, commentSubmission)
      .then((response) => {
        toast.success(`Successfully added new comment!`);
        // close reply form
        // a comment has been added, so pass the true prop to the parent component, the parent component will refetch the data and render the new comment
        setThereIsANewReply(false);
        setThereIsANewComment(true);
        setReplying(false);
      })
      .catch((error) => {
        console.log("this is error", error);

        toast.error(`Ruh Roh! Comment not added`);
      });
  };

  return (
    <div className="border-b-2 border-violet-100 justify-center shadow-lg mb-4 w-full">
      <form className="w-full bg-violet-900 rounded-lg px-4 pt-2 mb-4 pb-2">
        <GeneralButton
          text={` ${!showCommentForm ? "Add a new comment" : "Cancel"}`}
          onClick={() => setShowCommentForm(!showCommentForm)}
          className=""
        />

        <div className={`-mx-3 mb-6 ${showCommentForm ? "" : "hidden"}`}>
          {/* Area to Type a comment  */}
          <div className="w-full px-3 mb-2 mt text-darkPurple">
            <textarea
              className="bg-violet-100 rounded border  border-gray-400 leading-normal  w-full h-20 py-2 px-3 font-medium placeholder-gray-700 focus:outline-none focus:bg-white"
              name="body"
              onChange={(e) => setDescription(e.target.value)}
              required
              maxLength="700"
              placeholder="Type Your Comment"
            ></textarea>

            <span className="text-white">
              {`${700 - description.length}/700 characters left`}
            </span>
            {/* Area with a button to submit comment */}
            <div className="w-full md:w-full md:w-full px-3">
              <div className="w-1/2 text-gray-700 px-2 mr-auto"></div>

              <div className="-mr-1">
                <input
                  type="submit"
                  className="bg-white text-gray-700 font-medium py-1 px-4 border border-gray-400 rounded-lg tracking-wide mr-1 hover:bg-gray-100"
                  value="Post Comment"
                  onClick={commentSubmission}
                ></input>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddComment;
