import React, {useEffect, useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faCommentDots, faShareFromSquare, faFaceGrinWink, faUserTie, faCircleChevronDown, faReply, faComment } from '@fortawesome/free-solid-svg-icons'
import '@fortawesome/fontawesome-svg-core/styles.css'
import AddComment from '../AddingNewData/AddComment'

function CommentListing() {
  //  { comment,replies}
  // const rootComments = allComments.filter      
            // (comment=>comment.parentId=== null)

  const [replying, setReplying]=useState(false)
  const [commentParentId, setCommentParentId]=useState(null)
  return (
<div
    className="flex-col w-2/3 mx-auto py-4 bg-violet-50 
                rounded-lg px-4 mb-8">

{/*  w-full my-2 
    border-b-2 border-r-2 border-gray-200 
    sm:px-4 sm:py-4 md:px-4  sm:shadow-sm md:w-2/3 
    pb-10 */}

        <div className="flex flex-row">
                 <img className="w-12 h-12 border-2 border-gray-300 rounded-full" alt="Noob master's avatar"
                  src="https://images.unsplash.com/photo-1517070208541-6ddc4d3efbcb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&faces=1&faceindex=1&facepad=2.5&w=500&h=500&q=80"/>

                 <div className="w-full mt-1">
                       <div className="flex items-center flex-1 px-4 font-bold  text-black leading-tight">Corgi Butts
                                <span className="ml-2 text-xs font-normal text-gray-500">
                                  2 weeks ago
                                 </span>
                       </div>

                        <div className="flex-1 px-2 ml-2 text-sm font-medium leading-loose text-gray-600 text-left">Wow!!! how you did you
                              create this
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
                                
                            </FontAwesomeIcon> 

                        </div>

                        <div className="replies">
                            {/* {replies.map((reply)=> (
                              <Comment comment={reply} key={reply.id} replies={[]}/>
                              // replies={[]}/ is important so we only have 2 levels of comments
                            ))} */}

                        </div>

                        {replying&&<AddComment 
                        // {commentParentId==null&&
                        //   commentParentId={Comment._id}}
                            //we only want to go one level down. So either the comment has a null parent, or its parent is the FIRST comment

                              //sent the current comment's id to the reply
                              //so we know who to place it under/who its parent is
                             
                              
                              />}

                        {/* 17:35 https://www.youtube.com/watch?v=sjAeLwuezxo&t=2210s&ab_channel=MonsterlessonsAcademy */}
   
                  </div>
        </div>

</div>


  )
}

export default CommentListing