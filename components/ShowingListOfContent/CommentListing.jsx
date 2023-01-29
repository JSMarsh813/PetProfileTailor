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
                    //for likes
   const likes=rootComment.likes
   const [currentTargetedNameId,setCurrentTargetedNameId]=useState(postId)
   const[nameLiked,setNameLiked] = useState(false) 
   const [likesCount, setLikesCount ]=useState(likes.length) 
   let likesColor= nameLiked? "red":"white"
              
const handlelikes =  (e) => {

  // grabbing the name's unique id when we click on it
  // we can just look at the name props id property      
  // console.log(`this is target ${name._id}`)
  //this is target 63ae16a9f202c8bf57525455
 
  console.log(`this is currentTargetedNameId ${currentTargetedNameId}`)
//result: this is currentTargetedNameId 63abc7d5650d1659f0dd305e
   
  //if user is not logged in, tell them to log in to like names
{ (!sessionFromServer)&&                  
            toast.error("Please sign in to like names")}

        //axios put request
  const putLikes = async () => {
                try {
                    const response = await axios.put(
                        `http://localhost:3000/api/individualbatsignalcomments/updatecommentlikes`,
                               { currentTargetedNameId }
                           

                    );
//                            //Object { currentTargetedNameId: "63ae16a9f202c8bf57525455" }
                    console.log(response.status);

                    console.log(response.data);
                    nameLiked==true?setLikesCount(likesCount-=1):setLikesCount(likesCount+=1)
                    setNameLiked(!nameLiked)



                } catch (err) {
                    console.log('something went wrong :(', err);
                }
            };
    putLikes();

  (console.log(`in handlelikes ${nameLiked}`)) 

   }         

  // ############ FOR LIKES COLOR ON APP LOAD ##########

  useEffect(()=>{      
            
    likes.includes(sessionFromServer.user._id)?
             setNameLiked(true):setNameLiked(false)

  //checks server to see if the client liked the name, if so, set it true so the heart is red. Otherwise, set to false               
  
},[sessionFromServer])
           //Logic to avoid comments becoming too deeply nested
  useEffect(()=>{
    {rootComment.parentcommentid?
      setAdjustedParentId(rootComment.parentcommentid):
      setAdjustedParentId(rootComment._id)}
       //We only go one level deep. If the comment already has a parent id then we're already one level deep. So we want to set the id of this new comment as the same as this comment's parentcommendid

      //otherwise we are not one level deep/this is the first reply. So we can grab this comments id as the parentcommentid
      
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
    className={`flex-col mx-auto py-2 pr-4
                rounded-lg ${rootComment.parentcommentid?"pl-6 pr-0":""}`}>
                  {console.log(rootComment)}


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
<label>
        
        <input
              style={{display:"none"}}
                type="checkbox"
               checked={nameLiked}
                onChange={handlelikes}
              
              //  data-amount-of-likes={name.likedby.length}
        
        />
                            <FontAwesomeIcon 
                                icon={ faHeart}
                                className="mx-2 text-darkPurple text-xl" 
                                color={likesColor}
                                                         >
                                {likes.length}
                            </FontAwesomeIcon> 
 </label>
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