import React from 'react'

function Comment() {

  return (
  <div class="flex mx-auto items-center justify-center shadow-lg mb-4 max-w-lg">
   <form class="w-full max-w-xl bg-white rounded-lg px-4 pt-2 mb-4">
      <div class="flex flex-wrap -mx-3 mb-6">
         <h2 class="px-4 pt-3 pb-2 text-gray-800 text-lg">Add a new comment</h2>
         <div class="w-full md:w-full px-3 mb-2 mt-2">
            <textarea class="bg-gray-100 rounded border border-gray-400 leading-normal  w-full h-20 py-2 px-3 font-medium placeholder-gray-700 focus:outline-none focus:bg-white" 
            name="body" 
            placeholder='Type Your Comment' required>
                            </textarea>
         </div>
       </div>

        <div class="w-full md:w-full flex items-start md:w-full px-3">


            <div class="flex items-start w-1/2 text-gray-700 px-2 mr-auto">
         
             
            </div>


            <div class="-mr-1">
               <input 
               type='submit' 
               class="bg-white text-gray-700 font-medium py-1 px-4 border border-gray-400 rounded-lg tracking-wide mr-1 hover:bg-gray-100" 
               value='Post Comment'/>
            </div>
            
        </div>
      </form>
   </div>
  )
}

export default Comment