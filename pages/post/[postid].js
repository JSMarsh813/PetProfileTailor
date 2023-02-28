import React, {useEffect,useState} from 'react'
import Layout from "../../components/NavBar/NavLayoutwithSettingsMenu"
import Namelisting from '../../components/ShowingListOfContent/Namelisting'
import { authOptions } from "../api/auth/[...nextauth]"
import { unstable_getServerSession } from "next-auth/next"
import NameListingAsSections from '../../components/ShowingListOfContent/NameListingAsSections'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faCommentDots, faFaceGrinWink, faUserTie, faCircleChevronDown, faLocationDot, faRankingStar, faUserPlus, faEnvelopeOpenText, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import '@fortawesome/fontawesome-svg-core/styles.css'
import BatsignalPost from '../../components/ShowingListOfContent/batsignalPost'
import NavLayoutwithSettingsMenu from '../../components/NavBar/NavLayoutwithSettingsMenu'



export const getServerSideProps = async (context) => {

  //allows us to grab the dynamic value from the url
  const id=context.params.postid



  const session = await unstable_getServerSession(context.req, context.res, authOptions)

let UserId = ""
  
  if (session){
   UserId=session.user._id}



    let postResponse= await fetch('http://localhost:3000/api/individualposts/getASpecificPost/'+id)
    let postData = await postResponse.json()
  

    if((!postData)){ 
      return {
        notFound: true,
      }
     }
   
     else{
    let commentResponse= await fetch('http://localhost:3000/api/individualbatsignalcomments');
    let commentData = await commentResponse.json()

    //  let userResponse= await fetch('http://localhost:3000/api/posts/getASpecificPost/'+id)
    //  let userData = await userResponse.json()

    //  console.log(`this is ${userData}`)    
  

  return {
    props: {     
      postList: postData,          
      sessionFromServer: session, 
      commentList: commentData  
         },
    }
     }
}

export default function Postid({sessionFromServer, postList,commentList}) {
  
   //for Nav menu profile name and image
   let userName=""
   let profileImage=""
 
   if (sessionFromServer){
       userName=sessionFromServer.user.name
    profileImage=sessionFromServer.user.profileimage
  }
 //end of section for nav menu
 
  return (
    <div>
      {console.log}
      <NavLayoutwithSettingsMenu
          profileImage={profileImage} 
          userName={userName}  /> 
      
                   
          <BatsignalPost 
                          post={postList}
                          key={postList._id}             
                          className="mx-auto"
                          sessionFromServer={sessionFromServer}
                          commentList={commentList}
                          />
           
      
    </div>
  )
}
