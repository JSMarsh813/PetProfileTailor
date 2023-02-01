import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faCommentDots, faShareFromSquare, faFaceGrinWink, faUserTie, faCircleChevronDown, faClock, faDeleteLeft, faTrash, faTrashCan, faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import '@fortawesome/fontawesome-svg-core/styles.css'
import AddComment from "../AddingNewData/AddComment"
import GeneralButton from '../GeneralButton';
import CommentListing from './CommentListing';
import axios from 'axios';
import LikesButtonAndLikesLogic from "../ReusableMediumComponents/LikesButtonAndLikesLogic"
import EditPost from '../EditingData/EditPost';

function BatsignalPost({
   className,sessionFromServer,post,commentList,tagListProp}) {

        console.log(`this is post ${JSON.stringify(post)}`)
   const image=post.image
   const title=post.title
   const paragraphText=post.description
   const postersName=post.createdby.name
   const profileName= post.createdby.profilename
   const postersProfileImage=post.createdby.profileimage
   const postDate= post.createdAt
   const comments = post.comments 
     //comments to change
   const shares =post.shares
   const likes = post.likes
   const tagList= post.taglist.map(tag=>"#"+tag).join(", ")
   const postId =post._id

        
                     //for comments
    const [commentsShowing,SetCommentsShowing]=useState(false)
  const rootComments = commentList.filter      
            (comment=>comment.postid===post._id&&comment.parentcommentid=== null)
  const [showEditPage,SetShowEditPage]=useState(false)

  const replyComments = commentList.filter(comment=>comment.parentcommentid!=null)
  console.log(`this is root ${JSON.stringify(replyComments)}`)
                      //for likes
  const [currentTargetedId,setCurrentTargetedId]=useState(postId)
 
  const [sharesCount, setSharesCount ]=useState(shares.length)
    // console.log({rootComments})
 
        //  ###########  GETTING POSTERS DATA ########
    //  const fetchUserData = async () =>{

    //     await axios.get(`api/user/${postersId}`)
    //     .then((res)=>{
    //          console.log(res.data.data)
    //         setPostersName(res.data.data.name)
    //         setPostersProfileImage(res.data.data.profileimage)
    //         setProfileName(res.data.data.profilename)
          
    //         return postersProfileImage, postersName
    //         //i'm not sure if the return here is needed
    //     })
    //        }

        //  ###########  GRABBING COMMENTS ########


            //  #########   FORMATTING DATE  #################
  const dateFormatter= new Intl.DateTimeFormat(undefined,
           {dateStyle: "medium",
           timeStyle: "short",
             })

    let formattedPostDate= dateFormatter.format(Date.parse(postDate))
            //undefined that way it'll reset to the correct timezone based on the users computer
            // To use the browser's default locale, omit this argument or pass undefined. http://udn.realityripple.com/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
            //@58:00 he goes over the time https://www.youtube.com/watch?v=lyNetvEfvT0&ab_channel=WebDevSimplified
 
  

    // useEffect(()=>{
        
    //     fetchUserData()
    // },[])
   
    //console,console.log(Date.parse(postDate).toLocaleDateString(en-DE', options));
    // let date= new Date(postDate)
    // date.toLocaleString('en-GB', {day:'numeric', month: 'long',  year:'numeric'})
    // setCurrentDate(date)



    // grab postersId from postersId prop
                //pass it to an api which finds a user with that id
                        // we get that data back from the api (user object)
                        //grab user.name
                        // setPosterName(user.name)
                // import db from '../utils/db'
                // import User from "../models/User"
                // await db.connect()
                // const result = await User.find({_id:UserId})



  return (
    <div className="mx-auto px-6 py-8
             ">
                {/* above is the background of posts
                below is the start of the post squares */}
{showEditPage&&
<EditPost
    SetShowEditPage={SetShowEditPage}
    sessionFromServer={sessionFromServer}
    tagListProp={tagListProp}
    post={post}
  

/>}
{console.log(tagListProp)}

        <div className={`bg-violet-900 text-white rounded-lg tracking-wide max-w-3xl text-center mx-auto shadow-lg shadow-slate-900/70 border-2 border-violet-400 ${className} pb-4`}>
       


            <div className="px-4 py-2 mt-2 flex-1  ">
            {((sessionFromServer)&&(post.createdby._id==sessionFromServer.user._id))&&
             <div
                >
                         
                         
 <div className="grid grid-cols-2">                     

<label
     className="justify-self-start"   >
        
    <input
          style={{display:"none"}}
            type="checkbox"           
            onClick={()=>SetShowEditPage(true)}    
    />
    {console.log(`set show edit page ${!showEditPage}`)}
       
       <FontAwesomeIcon 
                                    icon={faPenToSquare}
                                    className="text-2xl  text-emerald-500"/>   
</label>
  
               <label
     className="justify-self-end"   >
        
    <input
          style={{display:"none"}}
            type="checkbox"           
            onClick={()=>SetShowEditPage(true)}    
    />
    {console.log(`set show edit page ${!showEditPage}`)}       
                            <FontAwesomeIcon 
                            icon={faTrashCan}
                             className="text-2xl justify-self-end text-rose-500"
                             />
                 </label>
                 </div>      
              </div>
            }
            
                  
              <h2 
                                className="font-semibold text-2xl  tracking-normal text-center">
                            {title}
                          </h2>
                
                {image.length!=0 &&
                <div className="md:flex-shrink-0 pt-4">
                           <img src={image} alt="" className="max-w-full mx-auto h-96 rounded-lg rounded-b-none"/>
            </div>}

                    <p className="text-sm py-2 px-2 mr-1">
                        {paragraphText}
                       
                    </p>
                  
                <div className="author flex items-center -ml-3 my-3">
                    <div className="user-logo">
                        <img className="w-12 h-12  object-cover rounded-full mx-4  shadow" src={postersProfileImage} alt="avatar"/>
                    </div>
                    <h2 className="text-sm tracking-tighter">
                        <a className="font-bold block text-left" href="#">By {postersName}
                        </a> 
                        <a className="" href="#">@{profileName}</a> 
                        <span >
                             <FontAwesomeIcon 
                                icon={faClock}
                                className="mx-2" >
                            </FontAwesomeIcon> 
                            {formattedPostDate}
                        </span>
                       
                    </h2>
                </div>

                <h4> Tags: {tagList}</h4>

                <div className="flex border-y-2 border-slate-200 py-2 bg-violet-900 text-white">

                    <span className="flex-1  inline ml-6">
                        <FontAwesomeIcon icon={faCommentDots} 
                        onClick={()=>SetCommentsShowing(!commentsShowing)}    
                        className="text-3xl mr-2"/>
                            <span
                            className="text-xl">{comments.length} </span> 
                    </span>

       <LikesButtonAndLikesLogic 
             data={post}         
            currentTargetedId={currentTargetedId}
            HeartIconStyling="text-3xl"
             session={sessionFromServer}
             apiLink={`http://localhost:3000/api/individualposts/updatepostlikes`}  
             
          />

                    <span className="flex-1 inline">
                           <FontAwesomeIcon icon={faShareFromSquare} 
                           className="text-3xl mr-2 inline flex-1"/>
                            <span
                            className="text-xl">{sharesCount} </span>
                    </span>
            </div>
           
            <AddComment 
            postid={postId} 
            hasParent={null}
            sessionFromServer={sessionFromServer}/>
                  

            </div>

       {commentsShowing&&rootComments.map(comment=>
            <section>
                    <CommentListing 
                    rootComment={comment} 
                    replies={replyComments}
                    postid={postId} 
                    key={comment._id}
                    sessionFromServer={sessionFromServer}/>
            
                         </section>)
             }
        </div>
    </div>
  )
}

export default BatsignalPost