import React, {useEffect, useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faCommentDots, faShareFromSquare, faFaceGrinWink, faUserTie, faCircleChevronDown, faReply, faComment, faClock } from '@fortawesome/free-solid-svg-icons'
import '@fortawesome/fontawesome-svg-core/styles.css'
import AddComment from '../AddingNewData/AddComment'
import axios from 'axios'
import LikesButtonAndLikesLogic from '../ReusableMediumComponents/LikesButtonAndLikesLogic'
import GeneralButton from '../GeneralButton'

function CommentListing({postid,rootComment,sessionFromServer}) {
 
  const [replying, setReplying]=useState(false)
  const [commentParentId, setCommentParentId]=useState(null)
  const [postersName,setPostersName]=useState(rootComment.createdby.name)
  const [postersProfileImage,setPostersProfileImage]=useState(rootComment.createdby.profileimage)
  const [postersProfileName,setProfileName]=useState(rootComment.createdby.profilename)
 { console.log(`this is profilename ${JSON.stringify(rootComment)}`)}
  const [adjustedParentId,setAdjustedParentId]=useState("")
         
  useEffect(()=>{
    {rootComment.parentcommentid?
      setAdjustedParentId(rootComment.parentcommentid):
      setAdjustedParentId(rootComment._id)}
       //We only go one level deep. If the comment already has a parent id then we're already one level deep. So we want to set the id of this new comment as the same as this comment's parentcommendid

      //otherwise we are not one level deep/this is the first reply. So we can grab this comments id as the parentcommentid
      
  },[])

          //  #########   FORMATTING DATE  #################
            const dateFormatter= new Intl.DateTimeFormat(undefined,
              {dateStyle: "medium",
              timeStyle: "short",
                })
   
       let formattedPostDate= dateFormatter.format(Date.parse(rootComment.createdAt))

  return (
<div
    className={`flex-col mx-auto py-2 pr-4
               bg-darkPurple 
                border-2 border-violet-300}`}>
                


        <div className="flex flex-row bg-violet-50 p-2 ml-6 ">
                 <img className="w-12 h-12 border-2 border-gray-300 rounded-full" alt="poster's avatar"
                  src={postersProfileImage}/>

                 <div className="w-full mt-1">
                       <div className="flex items-center  px-2 font-bold  text-black leading-tight">{postersName}
                       
                               <span className="ml-2 text-xs font-normal text-gray-500">
                               @{postersProfileName}
                                 </span>
                                <span className="ml-2 text-xs font-normal text-gray-500">
                                <FontAwesomeIcon 
                                icon={faClock}
                                className="mx-2" >
                            </FontAwesomeIcon> 
                                 {formattedPostDate}
                                 </span>
                       </div>

                        <div className=" px-2 ml-2 text-sm font-medium leading-loose text-gray-600 text-left">{rootComment.description}
                        </div>
                        
                        <div className="text-left ml-2 mt-2">
                        <FontAwesomeIcon 
                                icon={ faCommentDots}
                                className="mx-2 text-darkPurple text-xl"
                                   onClick={()=>
                                  {setReplying(!replying)}} >
                            </FontAwesomeIcon> 
<LikesButtonAndLikesLogic
              data={rootComment}                  
              HeartIconStyling="text-xl"
              HeartIconTextStyling="text-darkPurple ml-2"
               session={sessionFromServer}
               apiLink={`http://localhost:3000/api/individualbatsignalcomments/updatecommentlikes`}  

            />
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
<div className="grid cols-1 justify-items-center my-2">

<GeneralButton
    text={`Link to Post ${rootComment.postid}`}
    className={""}/>
 </div>                                     
</div>


  )
}

export default CommentListing