import React,{useEffect, useState} from 'react'
import Select from 'react-select';
import  {useRouter} from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faCommentDots, faImage,faShareFromSquare, faFaceGrinWink, faUserTie, faCircleChevronDown, faTrashCan, faX, faCircleXmark, faTowerBroadcast } from '@fortawesome/free-solid-svg-icons'
import '@fortawesome/fontawesome-svg-core/styles.css'

import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import XSvgIcon from '../ReusableSmallComponents/XSvgIcon';
import FollowButton from '../ReusableSmallComponents/buttons/FollowButton';

export default function UsersFollowersList({
    setShowUsersListPage, userData,sessionFromServer
}) {
  return (
    <>
<div>

<div className="relative z-10" 
aria-labelledby="modal-title" 
role="dialog" 
aria-modal="true">

  <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

  <div className="fixed inset-0 z-10 overflow-y-auto">
    
           {/* centers content */}
    <div className="            
            p-4 text-center sm:items-center sm:p-0 
            max-w-3xl
            mx-auto my-2">    
      <div>

        <div className="relative">     
        
                   {/* X Button and SVG Icon */}

 
      <XSvgIcon
         screenReaderText="Close Edit Screen"
         onClickAction={()=>setShowUsersListPage(false)}/>
                         

            <div 
        className="mx-auto flex flex-col font-semibold text-darkPurple bg-violet-900
                 border-2 border-violet-400 border-dotted 
                 p-4 shadow-lg max-w-3xl">

                  <h1
                      className="text-white text-xl"> 
                      Followers </h1>
       </div>

       {userData.followers[0]?userData.followers.map((follower)=>
       <a href={`http://localhost:3000/profile/${follower.name.toLowerCase()}`}>
    <section
    
    className="grid 
    grid-cols-4 gap-4 
    border-b-2 border-amber-300
    bg-darkPurple
            text-purple-200 p-2  
            
            
            items-center justify-items-center">

        {/* ###### PROFILE IMAGE #### */}
        <img 
                src={follower.profileimage}
                className="rounded-2xl h-16"/>
         {/* ###### PROFILE name, profile and bioblurb #### */}
        <section>
          <span 
                className="block">  {follower.name} 
          </span>

          <span  
                className="block"> @{follower.profilename}
        </span>     
        
        </section>

               <p>{follower.bioblurb}</p>

         <section>
            <FollowButton
              data={userData}
              session={sessionFromServer}
              />
         </section>

        </section>

    
        </a>):
        <div
            className="bg-darkPurple items-center">
              
        <p
          className="py-4">No followers currently 😿</p>

        <p> Lets find some friends! </p>
        <img 
            className="mx-auto pt-2 pb-6 rounded-full"
            src="https://img.huffingtonpost.com/asset/5774075f1800002500fa30fa.gif"
            alt="gif of a kitten climbing out of its cage into the excited puppies cage next to it"/>
        </div>
}
  

       </div>
       </div>
       </div>
       </div>
       </div>
       </div>

        
    </>
  )
}
