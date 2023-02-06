import React,{useEffect, useState} from 'react'
import GeneralButton from '../GeneralButton';
import DisabledButton from '../DisabledButton';

import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faCommentDots, faImage,faShareFromSquare, faFaceGrinWink, faUserTie, faCircleChevronDown, faTrashCan, faX, faCircleXmark, faTowerBroadcast } from '@fortawesome/free-solid-svg-icons'
import '@fortawesome/fontawesome-svg-core/styles.css'

import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

function AddPost({tagListProp,userId, sessionFromServer}) {
            //data for posts in mongoDB
  const [image,setImage]=useState([])
  const [title,setTitle]=useState("");
  const [description,setDescription]=useState("");
  const [tagList,setTags]=useState([]);
  const [createdby,setCreatedBy]=useState()
 
           //image we attached, waiting to upload to cloudinary
  const[imageToCloudinary,setImageToCloudinary]=useState("")
  const[imagePreview,setImagePreview]=useState()

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
    console.log(imageFromCloudinary)              
  }
   
}


// After the handleImageUpload finishes, run the handlePostCreate function


const handlePostCreate = async ()=>{
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
   
 }
 console.log(postSubmission)
 
      // #######if the collection does not have the name, do this (allow post):  ..... otherwise update setNameExists to true
        axios.post("http://localhost:3000/api/apinewpost", postSubmission).then(response => {
          console.log(response)        
          toast.success(`Successfully added new post. Heres 5 treat points as thanks for your contribution ${sessionFromServer.user.name}!`)
          // setImage([])
        }).catch(error => {
          console.log("this is error", error);
         
          toast.error(`Ruh Roh! Post not added`)
          
        });
}


        // ####################### UPLOAD NEW POST TO MONGODB ####################
        // let createNewPost = function(){
        
        //      console.log("hi")
        
        // }

  return (
    <div>

  <div 
        className="mx-auto flex flex-col font-semibold text-darkPurple bg-violet-900
                 border-2 border-violet-400 border-dotted 
                 p-4 shadow-lg max-w-3xl">

                    {/* ##### TITLE AREA ######*/}
    <input 
                className="border bg-violet-50  border-violet-200 p-2 mb-4 outline-none placeholder-darkPurple"                  
                placeholder="Type a title here (optional)" 
                onChange={(e)=>setTitle(e.target.value)}
                type="text"/>

                {/* ##### DESCRIPTION AREA ######*/}

    <textarea 
            className={`border ${description? 'border-violet-200': 'border-rose-500 border-2'} bg-violet-50 sec p-3 h-30  outline-none placeholder-darkPurple`}

            onChange={(e)=>setDescription(e.target.value)}  
            required
            placeholder="Describe everything about this post here (required)">
    </textarea>       

    <div>
  
                   {/* ##### IMAGE ATTACH  ######*/}
      <label htmlFor="attachImage" >
            <FontAwesomeIcon icon={faImage} 
                className="text-3xl text-yellow-300 mr-2 mt-2 align-middle inline-block
                                   hover-text-white"/>
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
                    htmlFor="nameTags">Tags</label>

        <Select 
                  className={`text-darkPurple mb-4 border ${description? 'border-violet-200': 'border-rose-500 border-2'}`}
                  id="nameTags"
                  options={tagListProp.map((opt,index) => ({
                    label: opt,
                    value: opt}))
                   }
                 
                  isMulti
                  isSearchable
                  placeholder="If you type in the tags field, it will filter the tags (required)"
                  onChange={(opt) => setTags(opt.map(tag=>tag.label))}
                   
                />
      {/* <ToastContainer 
          position="top-center"
           limit={1} /> */}      
        
    <div className="buttons flex">

    <button 
            className="btn border border-gray-300 p-1 px-4 font-semibold cursor-pointer text-white ml-auto">
              Cancel</button>
      <button 
           className="btn border border-indigo-500 p-1 px-4 font-semibold cursor-pointer text-gray-200 ml-2 bg-indigo-500"
           onClick={handlePostCreate}>
               Post</button>
    </div>

    <p
        className="text-white text-center py-4"> 
        Preview uploaded image(s) below before posting </p>

                 {/* ##### IMAGE PREVIEW AREA  ######*/}
   {imagePreview &&
    <div
            className="flex justify-center">
              <div className="relative w-content"> 

        <img
        className="max-h-96 object-scale-down mx-auto block"      
        src={imagePreview}/>
            <FontAwesomeIcon 
            icon={faCircleXmark} 
            onClick={()=>{
                    setImagePreview(""); 
                    setImageToCloudinary("")}}
            className="text-3xl text-yellow-300 mr-2 absolute top-1 right-1 justify-center drop-shadow-md"/>
                 </div>
        </div>}
          


  </div>

  </div>
  )
}

export default AddPost