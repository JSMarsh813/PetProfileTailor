import React, {useEffect,useState} from 'react'
import Layout from "../../components/NavBar/NavLayoutwithSettingsMenu"
import Namelisting from '../../components/ShowingListOfContent/Namelisting'
import { authOptions } from "../../pages/api/auth/[...nextauth]"
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

  const UserId = session.user._id



    let postResponse= await fetch('http://localhost:3000/api/individualposts/getASpecificPost/'+id)
    let postData = await postResponse.json()

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

export default function Postid({sessionFromServer, postList,commentList}) {
  
  return (
    <div>
      {console.log(commentList)}
      <NavLayoutwithSettingsMenu/>    
                   
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
