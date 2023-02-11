import React, {useEffect, useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faCommentDots, faShareFromSquare, faFaceGrinWink, faUserTie, faCircleChevronDown, faReply, faComment, faClock } from '@fortawesome/free-solid-svg-icons'
import '@fortawesome/fontawesome-svg-core/styles.css'
import AddComment from '../AddingNewData/AddComment'
import axios from 'axios'
import LikesButtonAndLikesLogic from '../ReusableMediumComponents/LikesButtonAndLikesLogic'
import PostersImageUsernameProfileName from "../ReusableSmallComponents/PostersImageUsernameProfileName"
import EditButton from '../ReusableSmallComponents/EditButton'
import DeleteButton from '../ReusableSmallComponents/DeleteButton'

import EditComment from '../EditingData/EditComment'

import DeleteCommentNotification from '../DeletingData/DeleteCommentNotification'

import { useRouter } from 'next/router';

function CommentListing({postid,rootComment,replies,sessionFromServer}) {
  //  { comment,replies}
 
 
  const [replying, setReplying]=useState(false)
  const [commentParentId, setCommentParentId]=useState(null)
  const [postersName,setPostersName]=useState(rootComment.createdby.name)
  const [postersProfileImage,setPostersProfileImage]=useState(rootComment.createdby.profileimage)
  const [postersProfileName,setProfileName]=useState(rootComment.createdby.profilename)
  const [adjustedParentId,setAdjustedParentId]=useState("")
         
  const showtime=true

  useEffect(()=>{
    {rootComment.parentcommentid?
      setAdjustedParentId(rootComment.parentcommentid):
      setAdjustedParentId(rootComment._id)}
       //We only go one level deep. If the comment already has a parent id then we're already one level deep. So we want to set the id of this new comment as the same as this comment's parentcommendid

      //otherwise we are not one level deep/this is the first reply. So we can grab this comments id as the parentcommentid
      
  },[])

     
     //for editing
     const [showEditPage,SetShowEditPage]=useState(false)

     //for deleting
const [showDeleteConfirmation,setShowDeleteConfirmation]=useState(false)
         //setting up that we will reroute/refresh if the comment is changed
const router=useRouter()
  const [commentChanged,setCommentChanged]=useState(false)


  
  function updateEditState(){
    SetShowEditPage(true)
  
   }


   function updateDeleteState(){
    setShowDeleteConfirmation(true)
       }

       //if postEdited in the state is true, then we'll force a reload of the page
       if (commentChanged) {
             
        const forceReload = () => 
        {router.reload()}  
      
          forceReload()
          setCommentChanged(false)           
       
      } 



    //        //  ###########  GETTING POSTERS DATA ########
    //  const fetchUserData = async () =>{

    //     await axios.get(`api/user/${rootComment.createdby}`)
    //     .then((res)=>{
    //          console.log(res.data.data)
    //         setPostersName(res.data.data.name)
    //         setPostersProfileImage(res.data.data.profileimage)
    //         setProfileName(res.data.data.profilename)
          
    //         return postersProfileImage, postersName
    //         //i'm not sure if the return here is needed
    //     })
    //        }
    //     useEffect(()=>{
        
    //     fetchUserData()
    // },[])
  return (
<div
    className={`flex-col mx-auto py-2 pr-4 text-darkPurple
                rounded-lg ${rootComment.parentcommentid?"pl-6 pr-0":""}`}>
                  {console.log(rootComment)}


        <div className="flex flex-row bg-violet-50 p-2 ml-6 ">
                

          <div className="w-full mt-1">
                  
                       
                    <PostersImageUsernameProfileName
                        postersProfileImage={postersProfileImage}
                        postersName={postersName}
                        profileName={postersProfileName}
                        postDate={rootComment.createdAt}
                        showtime={showtime}
                          />
                                

                        <div className=" px-2 ml-2 text-sm font-medium leading-loose text-left">{rootComment.description}
                        </div>
                        
       <div className="text-left ml-2 mt-2 grid grid-cols-2 gap-x-8">

              <div className="place-self-start">
                        <FontAwesomeIcon 
                                icon={ faCommentDots}
                                className="ml-2 mr-4 text-darkPurple text-2xl"
                                   onClick={()=>
                                  {setReplying(!replying)}} >
                            </FontAwesomeIcon> 

                  <LikesButtonAndLikesLogic
                           data={rootComment}                  
                           HeartIconStyling="text-2xl"
                           HeartIconTextStyling="text-darkPurple ml-2"
                           session={sessionFromServer}
                           apiLink={`http://localhost:3000/api/individualbatsignalcomments/updatecommentlikes`}  
               
            />
          </div>

                  {((sessionFromServer)&&
                    (rootComment.createdby._id==sessionFromServer.user._id))&&
                    <div className="place-self-end mr-2">
                          <EditButton
                                className="mr-4"
                                onupdateEditState={updateEditState} 
                          />
                  
                        <DeleteButton
                          onupdateDeleteState={updateDeleteState}/>
                    </div> }
                      
      
   {showEditPage&&
        <EditComment
          SetShowEditPage={SetShowEditPage}
           postid={postid}
           rootComment= {rootComment}
           sessionFromServer={sessionFromServer}
        changeCommentState={setCommentChanged}
        // setToastMessage={setToastMessage}
         />
    }

            
{showDeleteConfirmation&&

 
<DeleteCommentNotification
    setShowDeleteConfirmation={setShowDeleteConfirmation}
    sessionFromServer={sessionFromServer}
    changeCommentState={setCommentChanged}
    commentId={rootComment._id}
    commentCreatedBy={rootComment.createdby._id}
 />
}

                
              
          </div>            
                                              

                        {replying&& 
                        
                       <AddComment
                        
                        postid={rootComment.postid}
                        parentcommentid={adjustedParentId}
                        sessionFromServer={sessionFromServer}
                        />
                        }
                      

                        </div>
                      
                        </div>


          {/* if replies exist for this post, loop through them. If their parentcommentid matches this current comment, then add it to the bottom of this comment.
          Otherwise do not add it to the bottom of this comment. */}
                {(replies!="")&&                
                replies.map(reply=> {
                  if (reply.parentcommentid==rootComment._id) {

                    return <div>
                 <CommentListing
                        rootComment={reply}
                        replies={null}
                        key={reply._id}
                        sessionFromServer={sessionFromServer}
                     
                        /> 
                    </div>
                    
                    }})
                  

                } 

   
                  
       

</div>


  )
}

export default CommentListing