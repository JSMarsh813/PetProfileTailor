import React,{useEffect, useState} from 'react'
import Select from 'react-select';
import  {useRouter} from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faCommentDots, faImage,faShareFromSquare, faFaceGrinWink, faUserTie, faCircleChevronDown, faTrashCan, faX, faCircleXmark, faTowerBroadcast } from '@fortawesome/free-solid-svg-icons'
import '@fortawesome/fontawesome-svg-core/styles.css'

import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import XSvgIcon from '../ReusableSmallComponents/XSvgIcon';

export default function EditPost({SetShowEditPage,sessionFromServer,tagListProp,post,changePostState,setToastMessage}) {
               //data for posts in mongoDB
  const [image,setImage]=useState()
  const [title,setTitle]=useState(post.title);
  const [description,setDescription]=useState(post.description);
  const [tagList,setTags]=useState(post.taglist);
    // tagList:["bugs","general chat"]
  const [createdby,setCreatedBy]=useState({})


 
           //image we attached, waiting to upload to cloudinary
  const[imageToCloudinary,setImageToCloudinary]=useState("")
   const[imagePreview,setImagePreview]=useState(post.image!=[]?post.image:[])

  useEffect(()=>{
    setCreatedBy(sessionFromServer?
                        sessionFromServer.user._id:
                         "")

},[sessionFromServer]
  )

             // ######Attaching Image ############
  const handleImageAttachment = (e) => {
    e.preventDefault();             
   setImageToCloudinary(e.target.files[0])
   setImagePreview(URL.createObjectURL(e.target.files[0]))
  
  }

  
                // ########## upload image to cloudinary #############
                
const handleImageUpload = async () => {

  if (imageToCloudinary!="") {

   const formData = new FormData();
   formData.append('file', imageToCloudinary);
   formData.append('upload_preset', "db0l5fmb");
  //  console.log(formData)

  const response = await fetch("https://api.cloudinary.com/v1_1/dujellms1/image/upload", {
      method: 'POST',
      body: formData,
    })
    const data = await response.json();

    let imageFromCloudinary = data.secure_url         
       
    setImage(imageFromCloudinary)
    setImageToCloudinary("")     
    return imageFromCloudinary     
                
  }
   
}


// After the handleImageUpload finishes, run the handlePostCreate function


const handlePostEdit = async ()=>{
  if(!description) {toast.error(`Ruh Roh! A description is required`)   
  return} 

  if(tagList.length==0) {toast.error(`Ruh Roh! At least one tag is required`)
return}
 
 await handleImageUpload().then((image)=>postSubmission(image))     
//  necessary to pass image directly to next function as an object, postSubmission({image})
//  otherwise postSubmission grabs the state's image variable's value before it was updated, aka when it was ""

}



const postSubmission = async (image) => {
            //need to pass image directly into this function, otherwise it'll try to grab from state to early and thus you'll get "" for the image
            console.log((`hi from image ${image}`))

            const postSubmission= {
              image:image,
              title: title, 
              description: description,
              createdby: createdby.toString(),
              taglist: tagList, 
              postid: post._id,
 }
 console.log(postSubmission)
 

       await axios.put("/api/individualposts/",
          {
        postSubmission
          })
       .then(response => {
          console.log(response)      
          //reloads page  
          changePostState(true)     
          SetShowEditPage(false)
       
         
         
          // setImage([])
        }).catch(error => {
          console.log("there was an error when sending your post edits", error);
         
          toast.error(`Ruh Roh! Post not edited`)
          
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

                  

                    {/* ##### TITLE AREA ######*/}
                    <h4
        className="text-white mt-4"> Title </h4>
    <input 
                className="border bg-violet-50  border-violet-200 p-2 mb-4 outline-none placeholder-darkPurple"                  
                onChange={(e)=>setTitle(e.target.value)}
                value={title}
                 type="title"/>

   {/* ##### DESCRIPTION AREA ######*/}

   {/* ${description? 'border-violet-200': 'border-rose-500 border-2'} */}
   <h4
        className="text-white"> Description </h4>

   <textarea 
            className={`border  bg-violet-50 sec p-3 h-30  outline-none placeholder-darkPurple`}
            onChange={(e)=>setDescription(e.target.value)}  
            required
            value={description}>
    </textarea>       


    <div>
  
                   {/* ##### IMAGE ATTACH  ######*/}
      <label htmlFor="attachImage" >
            <FontAwesomeIcon icon={faImage} 
                className="text-3xl text-yellow-300 mr-2 mt-2 align-middle inline-block
                                   hover:text-white"/>
             <span
                    className="text-white"> Attach an Image (optional)
             </span>
     </label>
     <input
        onChange={handleImageAttachment}
        accept=".jpg, .png, .jpeg, .gif"
        id="attachImage"
        className="fileInput hidden"
        type="file">
      </input>             

      </div>


                 {/* ##### ATTACHING TAGS  ######*/}
                 <label 
                    className="font-bold block mt-4 text-white"
                    htmlFor="nameTags">Tags:</label>
<div className="text-white">

</div>
        <Select                 
                 value={tagList.map(tag=>
                            ({label:tag,value:tag}))}
    
                  className={`text-darkPurple mb-4 border ${tagList? 'border-violet-200': 'border-rose-500 border-2'}`}
                  id="nameTags"
                  options={tagListProp.map((opt,index) => ({
                    label: opt,
                    value: opt}))
                   }
                
                  isMulti
                  isSearchable                            
                  onChange={(opt) => setTags(opt.map(tag=>tag.label))}
                   
                />

<p
        className="text-white text-center py-4"> 
        Preview uploaded image(s) below before posting </p>

                 {/* ##### IMAGE PREVIEW AREA  ######*/}
  {imagePreview!="" &&
    <div
            className="flex justify-center">
              <div className="relative w-content"> 

        <img
        className="max-h-56 object-scale-down mx-auto block"      
        src={imagePreview}/>
            <FontAwesomeIcon 
            icon={faCircleXmark} 
            onClick={()=>{
                    setImagePreview(""); 
                    setImageToCloudinary("")}}
            className="text-3xl text-yellow-300 mr-2 absolute top-1 right-1 justify-center drop-shadow-md"/>
                 </div>
        </div>
        }

            </div>
            
          </div>
        </div>
                    {/* ###########                       buttons                     ############## */}
        <div className="bg-darkPurple px-4 py-3
                 sm:px-6 grid grid-cols-2">

          <button type="button" 
                 className="justify-center rounded-md border border-transparent bg-emerald-600 px-4 py-2 text-base 
                 
                 font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                 onClick={()=>handlePostEdit()}>
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
