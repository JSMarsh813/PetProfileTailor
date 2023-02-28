import React,{useEffect, useState} from 'react'
import Select from 'react-select';
import  {useRouter} from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faCommentDots, faImage,faShareFromSquare, faFaceGrinWink, faUserTie, faCircleChevronDown, faTrashCan, faX, faCircleXmark, faTowerBroadcast } from '@fortawesome/free-solid-svg-icons'
import '@fortawesome/fontawesome-svg-core/styles.css'

import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import XSvgIcon from '../ReusableSmallComponents/XSvgIcon';

export default function EditName(
    {SetShowEditPage,
     name,
    sessionFromServer,
    setItemChanged,
    setToastMessage,
    tagList}) {

       
               //data for posts in mongoDB

               //  let tagList = await fetch('http://localhost:3000/api/individualtags');
               //let tagData = await tagList.json()
  const [description,setDescription]=useState(name.description);
  const [newName,setName]=useState(name.name);
  const [tags,setTags]=useState(name.tags);


const nameSubmission = async () => {
         
   
            const nameSubmission= {
              description: description,
              name: newName,
              tags: tags,
            nameId: name._id,
 }
 console.log(nameSubmission)
 

    
       await axios.put("/api/individualnames/",
          {
     nameSubmission
          })
       .then(response => {
          console.log(response)      
          //reloads page  
          setItemChanged(true)     
          SetShowEditPage(false)
       
         
        }).catch(error => {
          console.log("there was an error when sending your edits", error);
         
          toast.error(`Ruh Roh! Name not edited`)
          
        });
}


        // ####################### UPLOAD NEW POST TO MONGODB ####################
        // let createNewPost = function(){
        
        //      console.log("hi")
        
        // }

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
         onClickAction={()=>SetShowEditPage(false)}

        //  onClick={()=>SetShowEditPage(false)}
   />                          

            <div 
        className="mx-auto flex flex-col font-semibold text-darkPurple bg-violet-900
                 border-2 border-violet-400 border-dotted 
                 p-4 shadow-lg max-w-3xl">

    {/* ##### NAME AREA ######*/}
                               <h4
        className="text-white mt-4"> Name </h4>
    <input 
                className="border bg-violet-50  border-violet-200 p-2 mb-4 outline-none placeholder-darkPurple"                  
                onChange={(e)=>setName(e.target.value)}
                value={newName}
                maxlength="40"
                 type="title"/>

<span
       className="block"> 
                      {`${40-newName.length}/40 characters left`} </span>

   {/* ##### DESCRIPTION AREA ######*/}

   {/* ${description? 'border-violet-200': 'border-rose-500 border-2'} */}
   <h4
        className="text-white"> Description </h4>

   <textarea 
            className={`border  bg-violet-50 sec p-3 h-30  outline-none placeholder-darkPurple`}
            onChange={(e)=>setDescription(e.target.value)}  
            required
            maxlength="500"
            value={description}>
    </textarea>       

    <span> {`${500-description.length}/500 characters left`} </span>
     {/* ##### ATTACHING TAGS  ######*/}
     <label 
                    className="font-bold block mt-4 text-white"
                    htmlFor="nameTags">Tags:</label>
<div className="text-white">

</div>
        <Select                 
                 value={tags.map(tag=>
                            ({label:tag,value:tag}))}
    
                  className={`text-darkPurple mb-4 border ${tags? 'border-violet-200': 'border-rose-500 border-2'}`}
                  id="nameTags"

                  options={tagList.map((opt,index) => ({
                    label: opt,
                    value: opt}))
                   }
                
                  isMulti
                  isSearchable                            
                  onChange={(opt) => setTags(opt.map(tag=>tag.label))}
                   
                />
  

            </div>
            
          </div>
          
        </div>

         

                    {/* ###########                       buttons                     ############## */}
        <div className="bg-darkPurple px-4 py-3
                 sm:px-6 grid grid-cols-2">

          <button type="button" 
                 className="justify-center rounded-md border border-transparent bg-emerald-600 px-4 py-2 text-base 
                 
                 font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                 onClick={()=>nameSubmission()}>
                    Save</button>

          <button type="button" className="mt-3 inline-flex justify-center rounded-md bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 
          sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={()=>SetShowEditPage(false)}>
                Cancel</button>
        </div>


      
    </div>
  </div>
</div>
    </div>
  )
}
