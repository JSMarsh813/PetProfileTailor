import React, {useState, useEffect} from 'react'
import GeneralButton from '../GeneralButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faCommentDots, faShareFromSquare, faFaceGrinWink, faUserTie, faCircleChevronDown, faClock } from '@fortawesome/free-solid-svg-icons'
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios'

function AddComment({postid,parentcommentid,sessionFromServer}) {

   const [showCommentForm,setShowCommentForm]=useState(false)
   const [description,setDescription]=useState("");
   const [createdby,setCreatedBy]=useState()
   const [image,setImage]=useState([])
   

   useEffect(()=>{
    setCreatedBy(sessionFromServer?
                        sessionFromServer.user._id:
                         "")

},[sessionFromServer]
  )

  const commentSubmission = async (e) => {
         e.preventDefault();    
            //need to pass image directly into this function, otherwise it'll try to grab from state to early and thus you'll get "" for the image
            // console.log((`hi from image ${image}`))
            if(!description) {toast.error(`Ruh Roh! A description is required`)   
            return} 


            const commentSubmission= {
              image:image,
              parentcommentid: parentcommentid,
              postid: postid,
              description: description,
              createdby: createdby.toString(),
             
   
 }

 await axios.post("http://localhost:3000/api/individualbatsignalcomments", commentSubmission).then(response => {
  const commentid= response.data._id
  const postid= response.data.postid
  console.log(response)
  console.log(`this is id ${commentid}`)
  //comment id and post id is working
  // setImage([])
  addCommentToPost(commentid,postid)

}).catch(error => {
  console.log("this is error", error);
 
  toast.error(`Ruh Roh! Post not added`)
  
});

  }

const addCommentToPost = async (commentid,postid) => {
  try {
    const response = await axios.put(
        `http://localhost:3000/api/individualposts/updatepostscomments`, {commentid,postid}).then(response=>
        {
          console.log(response)
          toast.success(`Successfully added new post. Heres 5 treat points as thanks for your contribution ${sessionFromServer.user.name}!`)
        })         
    }
    catch (err) {
      console.log('something went wrong :(', err);
       }
   }

  

   
     return (
  <div className="border-b-2 border-violet-100 justify-center shadow-lg mb-4 w-full">

<ToastContainer
    position="top-center"/>

   
   <form className="w-full bg-violet-900 rounded-lg px-4 pt-2 mb-4 pb-2">

   <GeneralButton
                  text="Add a new comment"
                  onClick={()=>setShowCommentForm(!showCommentForm)}
                  className=""/>

      <div className={`-mx-3 mb-6 ${showCommentForm?"":"hidden"}`}>
        
                  

         
                   {/* Type comment area  */}
         <div className="w-full px-3 mb-2 mt text-darkPurple">
            <textarea
             className="bg-violet-100 rounded border  border-gray-400 leading-normal  w-full h-20 py-2 px-3 font-medium placeholder-gray-700 focus:outline-none focus:bg-white" 
            name="body" 
            onChange={(e)=>setDescription(e.target.value)}  
            required
            placeholder='Type Your Comment'>
                            </textarea>
                              {/* Post comment area */}
                              <div className="w-full md:w-full md:w-full px-3">


<div className="w-1/2 text-gray-700 px-2 mr-auto">

 
</div>


         <div className="-mr-1">
                      <input 
                             type='submit' 
                             className="bg-white text-gray-700 font-medium py-1 px-4 border border-gray-400 rounded-lg tracking-wide mr-1 hover:bg-gray-100" 
                             value='Post Comment'
                             onClick={commentSubmission}>

                              
                              </input>
         </div>

</div>

         </div>



       </div>


     


      </form>



      
   </div>
  )
}

export default AddComment