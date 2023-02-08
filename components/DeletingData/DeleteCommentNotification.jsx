import React from 'react'
import XSvgIcon from '../ReusableSmallComponents/XSvgIcon'
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

export default function deletePostNotification(
    {setShowDeleteConfirmation,
     commentId,
    sessionFromServer,
    commentCreatedBy,
    changeCommentState}
    ) {

 //  toast.success(`You successfully deleted your post!`)
    
   const handleCommentDelete= async () =>{

    if(sessionFromServer.user._id!=commentCreatedBy){
        toast.error("validation error, session id does not match post's created by id")
        return
    }
    else {
        await axios.delete("/api/individualbatsignalcomments/",
                 {
              data: {commentId}
                 })
              .then(response => {
                 console.log(response) 
                 //reloads page
                 changeCommentState(true)
               
                 setShowDeleteConfirmation(false)      
                })
              .catch(error => {
                 console.log("there was an error when deleting your post", error);
                
                 toast.error(`Ruh Roh! Post not deleted`)
                 
               });
            }
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
    
            <div className="">                       
    
                <div 
            className="mx-auto flex flex-col font-semibold text-darkPurple bg-violet-900
                     border-2 border-violet-400 border-dotted 
                     p-4 shadow-lg max-w-3xl">
    
                 

    <div class="relative p-4 text-center rounded-lg shadow dark:bg-darkPurple sm:p-5">

                   {/* X Button and SVG Icon */}

<XSvgIcon
        screenReaderText="Close Delete Confirmaton Screen"
        onClickAction={()=>setShowDeleteConfirmation(false)}/>
          

                       {/* Trash can icon */}
            <svg 
                class="text-gray-400 dark:text-gray-500 w-11 h-11 mb-3.5 mx-auto" 
                aria-hidden="true" 
                fill="white" 
                viewBox="0 0 20 20" 
                xmlns="http://www.w3.org/2000/svg">
                    
                    <path 
                    fill-rule="evenodd"
                 d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clip-rule="evenodd">
                    </path>
            </svg>
            
            <p 
            class="mb-4 text-gray-500 dark:text-gray-300">
                Are you sure you want to delete this?</p>

            <div class="flex justify-center items-center space-x-4">

                <button 
                data-modal-toggle="deleteModal" 
                type="button" 
                class="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 
                
                hover:bg-gray-100 hover:text-gray-900 
                
                focus:ring-4 focus:outline-none focus:ring-primary-300 focus:z-10 
                
                dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600
                "
                onClick={()=>setShowDeleteConfirmation(false)}
                >
                    No, cancel
                </button>

                <button 
                type="submit" 
                class="py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900"
                onClick={()=>handleCommentDelete()}
                
                >
                    Yes, I'm sure
                </button>
            </div>
        </div>
    
    
          
        </div>
      </div>
    </div>
        </div>    
        </div>
        </div>
        </div>
  )
}
