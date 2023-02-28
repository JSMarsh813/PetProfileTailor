import React, { useEffect, useState } from 'react';

import AddComment from "../AddingNewData/AddComment"
import GeneralButton from '../GeneralButton';
import CommentListing from './CommentListing';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LikesButtonAndLikesLogic from "../ReusableMediumComponents/LikesButtonAndLikesLogic"
import EditPost from '../EditingData/EditPost';
import EditButton from '../ReusableSmallComponents/EditButton';
import DeleteButton from '../ReusableSmallComponents/DeleteButton';
import DeletePostNotification from '../DeletingData/DeletePostNotification';
import SeeCommentsButton from '../ReusableSmallComponents/SeeCommentsButton';
import ShareButton from '../ReusableSmallComponents/ShareButton';
import PostersImageUsernameProfileName from '../ReusableSmallComponents/PostersImageUsernameProfileName';

import { useRouter } from 'next/router';
import SharingOptionsBar from '../ReusableMediumComponents/SharingOptionsBar';


function BatsignalPost({
   className,
   sessionFromServer,
   post,
  //  commentList,
   tagListProp,
  
}) {

 
  const image=post.image
   const title=post.title
   const paragraphText=post.description
   const postersName=post.createdby.name
   const profileName= post.createdby.profilename
   const postersProfileImage=post.createdby.profileimage
   const postDate= post.createdAt
   
   const shares =post.shares
   const likes = post.likes
   const tagList= post.taglist.map(tag=>"#"+tag).join(", ")
   const postId =post._id


   const showtime=true
        
   const [postsCommentsFromFetch,setPostsCommentsFromFetch]=useState([])

                     //for comments
    const [commentsShowing,SetCommentsShowing]=useState(false)
console.log(postsCommentsFromFetch)
    let rootComments=[]
    
    if (postsCommentsFromFetch){
     rootComments=postsCommentsFromFetch.filter      
            (comment=>comment.replyingtothisid===post._id&&comment.parentcommentid===null)
          }
          console.log(`this is rootComments ${JSON.stringify(rootComments)}`)

    let amountOfComments=rootComments.length

                     //for editing
  const [showEditPage,SetShowEditPage]=useState(false)

                    //for deleting
  const [showDeleteConfirmation,setShowDeleteConfirmation]=useState(false)

                    //for showing share buttons
  const[shareSectionShowing,setShareSectionShowing]=useState(false)
  let linkToShare=`http://localhost:3000/posts/${post._id}`
  

  let replyComments=""
  if (postsCommentsFromFetch){
  replyComments = postsCommentsFromFetch.filter(comment=>comment.parentcommentid!=null)
  }
  console.log(`ths is replyComments ${JSON.stringify(replyComments)}`)
                      //for likes
  const [currentTargetedId,setCurrentTargetedId]=useState(postId)
                 //if the post is edited, we will refresh this component
const router=useRouter()
  const [postChanged,setPostChanged]=useState(false)
  const [toastMessage,setToastMessage]=useState("")
 


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

 
 
     const handleFetchPosts = async () => {
       const response = await fetch('http://localhost:3000/api/individualbatsignalcomments/commentscontainingpostid/'+postId)
       const data =await response.json()
       console.log(data)
       setPostsCommentsFromFetch(data)
     }

     useEffect(() => {
      handleFetchPosts();
      
  },[])

  function updateEditState(){
    SetShowEditPage(true)
      //passing set state directly as a prop isn't best practice, instead passing a function is better
      // https://www.reddit.com/r/learnreactjs/comments/m99nbz/is_it_a_good_practice_to_pass_setstate_of_one/
   }

   function updateDeleteState(){
    setShowDeleteConfirmation(true)
       }

  function updateCommentShowState(){
    SetCommentsShowing(!commentsShowing)
           }
           
  function onClickShowShares() {
    setShareSectionShowing(!shareSectionShowing)
  }

  {console.log(`set share section ${shareSectionShowing}`)}
         //if postEdited in the state is true, then we'll force a reload of the page
       if (postChanged) {
                 
           const forceReload = () => 
           {router.reload()}  
         
             forceReload()
             setPostChanged(false)
            
          
         }


  return (
    <div 
      className="mx-auto px-6 py-8
             ">
                {/* above is the background of posts
                below is the start of the post squares */}
    {showEditPage&&
        <EditPost
        SetShowEditPage={SetShowEditPage}
        sessionFromServer={sessionFromServer}
        tagListProp={tagListProp}
        post={post}
        changePostState={setPostChanged}
        setToastMessage={setToastMessage}
         />
    }

{showDeleteConfirmation&&

 
        <DeletePostNotification
            setShowDeleteConfirmation={setShowDeleteConfirmation}
            sessionFromServer={sessionFromServer}
            changePostState={setPostChanged}
            postId={post._id}
            postCreatedBy={post.createdby._id}
         />
    }

            {/* WRAPPING POST AND POST'S COMMENT SECTION */}

     <div
       className={`bg-violet-900 text-white rounded-lg tracking-wide max-w-3xl text-center mx-auto shadow-lg shadow-slate-900/70 border-2 border-violet-400 ${className} pb-4`}>
       

            {/* ######## POST SECTION ###########*/}
        <section className="px-4 py-2 mt-2 flex-1  ">

            {((sessionFromServer)&&
                  (post.createdby._id==sessionFromServer.user._id))&&

                       <div className="grid grid-cols-2">            
                          <EditButton
                              onupdateEditState={updateEditState}      
                            />  
                          <DeleteButton
                              onupdateDeleteState={updateDeleteState}
                            />
                       </div>                  
            }
            
                  
           <h2 
              className="font-semibold text-2xl tracking-normal text-center">
                 {title}
           </h2>
                

           {image.length!=0 &&
                <div className="md:flex-shrink-0 pt-4">
                    <img src={image} 
                         alt="" 
                         className="max-w-full mx-auto h-96 rounded-lg rounded-b-none"/>
                </div>
            }


            <p className="text-sm py-2 px-2 mr-1">
                 {paragraphText}
            </p>
                  
                  
                <PostersImageUsernameProfileName
                
                    postersProfileImage={postersProfileImage}
                    postersName={postersName}
                    profileName={profileName}
                    postDate={postDate}
                    showtime={showtime}
                    />

                <h4
                    className="text-base"> 
                  Tags: {tagList}
                </h4>

         <div 
                    className="flex border-y-2 border-slate-200 py-2 bg-violet-900 text-white">

      <SeeCommentsButton
           comments={amountOfComments}
           onupdateCommentShowState={updateCommentShowState}
      />
                  

       <LikesButtonAndLikesLogic 
             data={post}         
            currentTargetedId={currentTargetedId}
            HeartIconStyling="text-3xl"
             session={sessionFromServer}
             apiLink={`http://localhost:3000/api/individualposts/updatepostlikes`}  
             
          />

              <ShareButton
                  shares={shares}
                  onClickShowShares={onClickShowShares}
                  />
                 
            </div>        
           
            <AddComment 
                  replyingtothisid={postId} 
                  parentcommentid={null}
                  sessionFromServer={sessionFromServer}
                  apiLink="/api/individualbatsignalcomments/"
                  />                 

        </section>

{/* SHARING OPTIONS SECTION */}
{shareSectionShowing&&
<SharingOptionsBar
    linkToShare={linkToShare}/>
}

        {/* ######## POST'S COMMENTS SECTION ###########*/}

          
          {/* this section keeps giving the "Each child in a list should have a unique key prop" error??? */}

           {commentsShowing&&rootComments!=[]&&
            rootComments.map(comment=>
             
              
                    <CommentListing 
                    key={comment._id}
                    rootComment={comment} 
                    replies={replyComments}
                    postid={postId} 
                    typeOfContentReplyingTo={post}
                    sessionFromServer={sessionFromServer}
                    apiLink="/api/individualbatsignalcomments/"
                    likesApiLink="http://localhost:3000/api/individualbatsignalcomments/updatecommentlikes"
                    />
            
                )
        }
     </div>

  </div>
  )
}

export default BatsignalPost