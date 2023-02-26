import React, {useState, useEffect} from 'react'
import GeneralButton from '../GeneralButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faCommentDots, faShareFromSquare, faFaceGrinWink, faUserTie, faCircleChevronDown, faClock } from '@fortawesome/free-solid-svg-icons'
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios'

function AddNameComment({replyingtothisid, parentcommentid,sessionFromServer}) {

   const [showCommentForm,setShowCommentForm]=useState(false)

   const [description,setDescription]=useState("");

   const [createdby,setCreatedBy]=useState()

   const [image,setImage]=useState([])
   
   console.log(`this is replyingtothisid ${replyingtothisid}`)

   useEffect(()=>{
    setCreatedBy(sessionFromServer?
                        sessionFromServer.user._id:
                         "")

},[sessionFromServer]
  )

  const commentSubmission = async (e) => {
         e.preventDefault();    
    
            if(!description) {toast.error(`Ruh Roh! A description is required`)   
            return} 


            const commentSubmission= {
              image:image,          
              replyingtothisid: replyingtothisid,
              description: description,
              createdby: createdby.toString(),
            
   
 }

 console.log(commentSubmission)

 await axios.post("http://localhost:3000/api/namecomments", commentSubmission).then(response => 
 {
  console.log(response)
  // const commentIdToNameDoc={
  // commentid: response.data._id,
  // replyingtothisid:response.data.replyingtothisid
  // }
 
   toast.success(`Successfully added new comment!`)

}).catch(error => {
  console.log("this is error", error);
 
  toast.error(`Ruh Roh! Comment not added`)
  
});

}

   
     return (
  <div className="border-b-2 border-violet-100 justify-center shadow-lg mb-4 w-full">
   
   <form className="w-full bg-violet-900 rounded-lg px-4 pt-2 mb-4 pb-2 grid">

   <GeneralButton
                  text={showCommentForm?"Close":"Add a comment"}
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
                           
                              <div className="w-full md:w-full md:w-full px-3">


<div className="w-1/2 text-gray-700 px-2 mr-auto">

 
</div>


         <div className="text-center">
                      <button 
                             type='submit' 
                             className="
                             mt-2
                             bg-white text-gray-700 font-medium py-1 px-4 border border-gray-400 rounded-lg tracking-wide hover:bg-gray-100" 
                           
                             onClick={commentSubmission}>
                               Add Comment
                              
                              </button>
         </div>

</div>

         </div>



       </div>


     


      </form>



      
   </div>
  )
}

export default AddNameComment