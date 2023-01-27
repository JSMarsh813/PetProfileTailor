import React, {useEffect, useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faCommentDots, faShareFromSquare, faFaceGrinWink, faUserTie, faCircleChevronDown, faReply, faComment, faClock } from '@fortawesome/free-solid-svg-icons'
import '@fortawesome/fontawesome-svg-core/styles.css'
import AddComment from '../AddingNewData/AddComment'
import axios from 'axios'

function CommentListing({rootComment,replies,sessionFromServer}) {
  //  { comment,replies}
 

  const [replying, setReplying]=useState(false)
  const [commentParentId, setCommentParentId]=useState(null)
  const [postersName,setPostersName]=useState("")
  const [postersProfileImage,setPostersProfileImage]=useState("")
  const [postersProfileName,setProfileName]=useState("")
  const [adjustedParentId,setAdjustedParentId]=useState("")

      //We only go one level deep. If the comment already has a parent id then we're already one level deep. So we want to set the id of this new comment as the same as this comment's parentcommendid

      //otherwise we are not one level deep/this is the first reply. So we can grab this comments id as the parentcommentid
  useEffect(()=>{
    {rootComment.parentcommentid?
      setAdjustedParentId(rootComment.parentcommentid):
      setAdjustedParentId(rootComment._id)}
      
  },[])

  console.log(`this is replies ${JSON.stringify(replies)}`)
            //  #########   FORMATTING DATE  #################
            const dateFormatter= new Intl.DateTimeFormat(undefined,
              {dateStyle: "medium",
              timeStyle: "short",
                })
   
       let formattedPostDate= dateFormatter.format(Date.parse(rootComment.createdAt))

               //  ###########  GETTING POSTERS DATA ########
     const fetchUserData = async () =>{

        await axios.get(`api/user/${rootComment.createdby}`)
        .then((res)=>{
             console.log(res.data.data)
            setPostersName(res.data.data.name)
            setPostersProfileImage(res.data.data.profileimage)
            setProfileName(res.data.data.profilename)
          
            return postersProfileImage, postersName
            //i'm not sure if the return here is needed
        })
           }
        useEffect(()=>{
        
        fetchUserData()
    },[])
  return (
<div
    className="flex-col mx-auto py-2 px-2
                rounded-lg px-4">

{/*  w-full my-2 
    border-b-2 border-r-2 border-gray-200 
    sm:px-4 sm:py-4 md:px-4  sm:shadow-sm md:w-2/3 
    pb-10 */}

        <div className="flex flex-row bg-violet-50 p-2 ml-6">
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

                            <FontAwesomeIcon 
                                icon={ faHeart}
                                className="mx-2 text-darkPurple text-xl" 
                                                         >
                                {rootComment.likes.length||0}
                            </FontAwesomeIcon> 

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
                {replies&&                
                replies.map(reply=> {
                  if (reply.parentcommentid==rootComment._id) {

                    console.log(reply)
                    console.log(rootComment._id)
                    return <div>
                 <CommentListing
                        rootComment={reply}
                        replies={null}
                        sessionFromServer={sessionFromServer}
                     
                        /> 
                    </div>
                    
                    }})
                  

                } 

   
                  
       

</div>


  )
}

export default CommentListing