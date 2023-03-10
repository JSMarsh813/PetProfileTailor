import React, {useEffect,useState} from 'react'
import Layout from "../../components/NavBar/NavLayoutwithSettingsMenu"


import BatsignalPost from '../../components/ShowingListOfContent/BatsignalPost'
import SingleComment from '../../components/ShowingListOfContent/SingleComment'
import { authOptions } from "../api/auth/[...nextauth]"
import { unstable_getServerSession } from "next-auth/next"
import NameListingAsSections from '../../components/ShowingListOfContent/NameListingAsSections'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faCommentDots, faFaceGrinWink, faUserTie, faCircleChevronDown, faLocationDot, faRankingStar, faUserPlus, faEnvelopeOpenText, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import '@fortawesome/fontawesome-svg-core/styles.css'
import CommentListing from '../../components/ShowingListOfContent/CommentListing'
import HeadersForNames from '../../components/ShowingListOfContent/HeadersForNames'


export const getServerSideProps = async (context) => {

  //allows us to grab the dynamic value from the url
  const id=context.params.profilename

  const session = await unstable_getServerSession(context.req, context.res, authOptions)


     let userResponse= await fetch('http://localhost:3000/api/user/getASpecificUserByProfileName/'+id)
     let userData = await userResponse.json()

  
     if(!userData.length){ 
      return {
        notFound: true,
      }
     }
     else{

     
     let nameid=userData[0]._id
     console.log(nameid)

     let nameResponse= await fetch('http://localhost:3000/api/individualnames/namesContainingUserId/'+nameid)
     let nameData = await nameResponse.json()    

     //grabbing posts

     let postResponse= await fetch('http://localhost:3000/api/individualposts/postscontaininguserid/'+nameid)
     let postData = await postResponse.json()   

     let commentResponse= await fetch('http://localhost:3000/api/individualbatsignalcomments');
     let commentData = await commentResponse.json()

     //grabbing comments
     
     let UsersCommentResponse= await fetch('http://localhost:3000/api/individualbatsignalcomments/commentscontaininguserid/'+nameid)
     let UsersCommentData = await UsersCommentResponse.json()  

  return {
    props: {
   
      nameList: nameData,
      id: id,
      UsersCommentData: UsersCommentData,
      userData: userData[0],
      commentList:  commentData,
      postData: postData,
      sessionFromServer: session,
   
         },
    }
  }
}

function ProfilePage({sessionFromServer, commentList, postData,nameList,userData,UsersCommentData}) {

   //for Nav menu profile name and image
   let userName=""
   let profileImage=""
 
   if (sessionFromServer){
       userName=sessionFromServer.user.name
    profileImage=sessionFromServer.user.profileimage
  }
 //end of section for nav menu

  return (
    <div >
 
       <Layout       
           profileImage={profileImage} 
            userName={userName}  />   
 

<div className="flex flex-col md:flex-row">
                          {/* ############## BIO ############## */}
<section className="w-96 text-darkPurple ">
<div className="px-4 ">
  <div className="relative flex flex-col min-w-0 break-words bg-purple-50 mb-6 shadow-xl rounded-lg mt-16
   border-4 border-darkPurple border-double shadow-slate-900/70">
    <div className="px-6">
      <div className="flex flex-wrap justify-center">
        <div className="w-full px-4 flex justify-center">
          <div className="relative">
            <img alt="..." src={userData.profileimage}
            className="shadow-xl rounded-full border-4 border-amber-300 align-middle -mt-16 h-60 shadow-slate-800/50"/>

          </div>
        </div>
        <div className="w-full text-center mt-2">

        <span className="text-xl font-bold leading-normal ">  {userData.name} </span> 
        <span>    @{userData.profilename}    </span>

          <div className="flex justify-center py-4">
            
        
            <div className="mr-4 text-center">
              <span className="text-xl font-bold block tracking-wide">
                22
              </span>
              <span className="text-sm text-blueGray-400">Treats</span>
            </div>

            <div className="mr-4 text-center">
              <span className="text-xl font-bold block tracking-wide">
                10
              </span>
              <span className="text-sm">Following</span>
            </div>


            <div className="text-center">
              <span className="text-xl font-bold block tracking-wide">
                 {userData.followers.length}
              </span>
              <span className="text-sm">Followers</span>
            </div>
          </div>
        </div>
      </div>


      <div className="text-center">

       
   

        <div className=" w-full pb-4">
      <a href="#" className=" mr-2 mx-auto bg-yellow-500 hover:bg-yellow-400 border-b-4 border-yellow-700 
      hover:border-yellow-500 text-center py-2 px-4 rounded">
        <FontAwesomeIcon
             icon={faUserPlus}
             className="mr-2"/>
  Follow
</a>
<a href="#" className="ml-2 mx-auto bg-yellow-500 hover:bg-yellow-400 border-b-4 border-yellow-700 hover:border-yellow-500 text-center py-2 px-4 rounded">
<FontAwesomeIcon
             icon={faEnvelope}
             className="mr-2"/>
  Message
</a>

</div>
        <div className="text-sm leading-normal mt-0 mb-2 font-bold ">
        <FontAwesomeIcon 
              icon={faLocationDot}
              className="mr-2 text-lg "/>

        <span className="mr-2 text-lg"> 
      
          {userData.location}
          </span>
        </div>

        <div className="mb-2 font-bold">
        <FontAwesomeIcon 
              icon={faRankingStar}
              className="mr-2 text-lg "
              />
          <span className="mr-2 text-lg">
          Rank: {"mystery"}
          </span>
        </div>
      </div>


      
      <div className="py-2 border-t border-darkPurple text-center">
        <div className="flex flex-wrap justify-center">
          <div className="w-full px-4">
            <p className="mb-4 leading-relaxed">
            {userData.bioblurb}
            </p>
       
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
                      {/* ###########  FOOTER  ########### */}
                      
<footer className="relative  pt-8 pb-6 mt-8">
  <div className="container mx-auto px-4">
    <div className="flex flex-wrap items-center md:justify-between justify-center">
      <div className="w-full md:w-6/12 px-4 mx-auto text-center">
        <div className="text-sm text-blueGray-500 font-semibold py-1">
        Extra
        </div>
      </div>
    </div>
  </div>
</footer>

</section>
     
      {/* ######## USERS CONTRIBUTIONS SECTION ##########*/}

      <div
            className=" flex-1 grid grid-cols-1 gap-4 mr-2 h-fit text-white bg-darkPurple">

        
          {/* ########## NAMES ADDED  ################*/}
    <section
      className="my-4">
          <h2  className="w-full text-center font-semibold text-amber-300
                            text-xl
                             p-2 
                            "> Names Added</h2>
 <div className=" flex-1 grid grid-cols-1 gap-4 mr-2  
 w-full
 border-2 border-amber-300">
        
          {(!nameList.length)?

                <section className="border-2 border-amber-300"> 
          

                <span>  no names added yet! </span>

                </section>:

               <section className="border-2 border-amber-300 w-full"> 
                    
                    <HeadersForNames/>

                       <section
                          className="max-h-96 overflow-scroll">
                       {nameList.map((name)=>{
                            return <NameListingAsSections
                            name={name}
                            key={name._id}
                            sessionFromServer={sessionFromServer}
                            />
                          
                          }
                        
                          )}
                      </section>

                    </section>
            }
            </div>
            </section>
       {/* ################  POSTS SECTION  #################   */}
       <section
      className="my-4">
       <h2 className="w-full text-center font-semibold text-amber-300 
            text-xl
             p-2 
            
            "> Posts Added</h2>
                    
 <div className=" flex-1 grid grid-cols-1 gap-4 mr-2  
 w-full
 border-2 border-amber-300">


{!postData.length?

<section> 

<span
 className="bg-none">"no posts added yet!"</span>

</section>:
 <section className="max-h-screen overflow-scroll">
 
{postData.map(post=>
  {return <BatsignalPost 
  post={post}
  key={post._id}
  className="mx-auto"
  sessionFromServer={sessionFromServer}
  commentList={commentList}
  />
}  )}
</section>
}
</div>
</section>
       {/* ###############  COMMENTS SECTION ############ */}

              <section className="my-2"> 

              <h2  className="w-full text-center font-semibold text-amber-300 
            text-xl
            bg-darkPurple p-2 
            "> Comments Added</h2>
             <div className=" flex-1 grid grid-cols-1 gap-4 mr-2  
 w-full
 border-2 border-amber-300">
 {(!UsersCommentData.length)?

<section className="border-2 border-amber-300"> 
   
<span>  No comments added yet! </span></section>:


<section className="border-2 border-amber-300 max-h-screen overflow-scroll">

             
          {UsersCommentData.map(singleComment=>
                <SingleComment
                key={singleComment._id}
                rootComment={singleComment}
                sessionFromServer={sessionFromServer}
                />
                )}

                </section>
                }
                </div>
                </section>
          
      </div>

</div>




       
        {/* ############## CONTRIBUTIONS ##############*/}
<section>

</section>
       
       
       
       </div>
  )
}

export default ProfilePage