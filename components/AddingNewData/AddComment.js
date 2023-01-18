import React, {useState} from 'react'
import GeneralButton from '../GeneralButton'

function AddComment() {

   const [showCommentForm,setShowCommentForm]=useState(false)
  
  return (
  <div className="flex items-center border-b-2 border-violet-100 justify-center shadow-lg mb-4">

   
   <form className="w-full bg-violet-900 rounded-lg px-4 pt-2 mb-4">

   <GeneralButton
                  text="Add a new comment"
                  onClick={()=>setShowCommentForm(!showCommentForm)}
                  className=""/>

      <div className={`flex flex-wrap -mx-3 mb-6 ${showCommentForm?"":"hidden"}`}>
        
                  

         
                   {/* Type comment area  */}
         <div className="w-full px-3 mb-2 mt text-darkPurple">
            <textarea className="bg-violet-100 rounded border  border-gray-400 leading-normal  w-full h-20 py-2 px-3 font-medium placeholder-gray-700 focus:outline-none focus:bg-white" 
            name="body" 
            placeholder='Type Your Comment' required>
                            </textarea>
                              {/* Post comment area */}
                              <div className="w-full md:w-full flex items-start md:w-full px-3">


<div className="flex items-start w-1/2 text-gray-700 px-2 mr-auto">

 
</div>


         <div className="-mr-1">
                      <input 
                             type='submit' 
                             className="bg-white text-gray-700 font-medium py-1 px-4 border border-gray-400 rounded-lg tracking-wide mr-1 hover:bg-gray-100" 
                             value='Post Comment'/>
         </div>

</div>

         </div>



       </div>


     


      </form>



      
   </div>
  )
}

export default AddComment