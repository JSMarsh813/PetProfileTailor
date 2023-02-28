import React,{useEffect, useState} from 'react'
import Select from 'react-select';
import  {useRouter} from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faCommentDots, faImage,faShareFromSquare, faFaceGrinWink, faUserTie, faCircleChevronDown, faTrashCan, faX, faCircleXmark, faTowerBroadcast } from '@fortawesome/free-solid-svg-icons'
import '@fortawesome/fontawesome-svg-core/styles.css'

import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import XSvgIcon from '../ReusableSmallComponents/XSvgIcon';

import ImageUpload from '../../components/ImageUpload'

export default function EditBioAndProfile(
    {setShowProfileEditPage,
     userData,
    sessionFromServer,
    setProfileChange}) {

       
  const [bio,setBio]=useState(userData.bioblurb);
  const [location,setLocation]=useState(userData.location);
  const [avatar,setAvatar]=useState(userData.profileimage);

const bioSubmission = async () => {         
   
            const bioSubmission= {
              bio: bio,
              location: location,
            userid: sessionFromServer.user._id
 }
 console.log(bioSubmission)
 

    
       await axios.put("/api/user/editbiolocationavatar",
          {
        bioSubmission
          })
       .then(response => {
          console.log(response)      
          //reloads page  
          setProfileChange(true)     
          setShowProfileEditPage(false)
       
         
        }).catch(error => {
          console.log("there was an error when sending your edits", error);
         
          toast.error(`Ruh Roh! Name not edited`)
          
        });
}
  return (
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
         onClickAction={()=>setShowProfileEditPage(false)}/>
                         

            <div 
        className="mx-auto flex flex-col font-semibold text-darkPurple bg-violet-900
                 border-2 border-violet-400 border-dotted 
                 p-4 shadow-lg max-w-3xl">

    {/* ##### NAME AREA ######*/}
                               <h4
        className="text-white mt-4"> location </h4>
    <input 
                className="border bg-violet-50  border-violet-200 p-2 mb-4 outline-none placeholder-darkPurple"                  
                onChange={(e)=>setLocation(e.target.value)}
                value={location}
                maxlength="70"
                 type="title"/>

<span className="text-white"> {`${70-location.length}/70 characters left`}</span>

   {/* ##### DESCRIPTION AREA ######*/}

   {/* ${description? 'border-violet-200': 'border-rose-500 border-2'} */}
   <h4
        className="text-white"> Bio </h4>

   <textarea 
            className={`border  bg-violet-50 sec p-3 h-30  outline-none placeholder-darkPurple`}
            onChange={(e)=>setBio(e.target.value)}  
            required
            maxlength="400"
            value={bio}>
    </textarea>       
   
    <span className="text-white"> {`${400-bio.length}/400 characters left`}</span>
  
  <h4
      className="text-white mt-2"> 
             Current Avatar </h4>

  <img 
      src={avatar}
      className="h-28 w-scale mx-auto"/>

<ImageUpload sessionFromServer={sessionFromServer}/>
            </div>
            
          </div>
          
        </div>

         

                    {/* ###########                       buttons                     ############## */}
        <div className="bg-darkPurple px-4 py-3
                 sm:px-6 grid grid-cols-2">

          <button type="button" 
                 className="justify-center rounded-md border border-transparent bg-emerald-600 px-4 py-2 text-base 
                 
                 font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                 onClick={()=>bioSubmission()}>
                    Save</button>

          <button 
          type="button" 
          className="mt-3 inline-flex justify-center rounded-md bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 
          sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={()=>setShowProfileEditPage(false)}>
                Cancel</button>
        </div>


      
    </div>
  </div>
</div>
    </div>
  )
}
