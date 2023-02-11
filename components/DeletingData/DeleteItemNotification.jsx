import React from 'react'
import XSvgIcon from '../ReusableSmallComponents/XSvgIcon'
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

export default function DeleteNameNotification(    
    {setShowDeleteConfirmation,
     itemId,
     sessionFromServer,
   itemCreatedBy,
   changeItemState,
   deletionApiPath}
   ) 
    {


    
 //#### sections that need to be added to the component which calls this component

  //import { useRouter } from 'next/router';
 //const router=useRouter()
  //  const [showDeleteConfirmation,setShowDeleteConfirmation]=useState(false)
  //const [itemChanged,setItemChanged]=useState(false)

      //if itemChanged in the state is true, then we'll force a reload of the page. This is for BOTH the edit and delete functions

    //   if (itemChanged) {
             
    //     const forceReload = () => 
    //     {router.reload()}  
      
    //       forceReload()
    //       setItemChanged(false)           
       
    //   } 

         // ##for the delete notification button #####


//  function updateDeleteState(){
//     setShowDeleteConfirmation(true)
//        }


//          <DeleteButton
//          onupdateDeleteState={updateDeleteState}/>
//    </div> }

//FOR THIS NOTIFICATION COMPONENT  


// {showDeleteConfirmation&&
//   <DeleteItemNotification
//       setShowDeleteConfirmation=      
//                   {setShowDeleteConfirmation}
//       sessionFromServer=
//                   {sessionFromServer}
//       changeItemState=
//                   {setItemChanged}
//       itemId=
//                   {name._id}
//       itemCreatedBy=
//                   {name.createdby._id}

//        deletionApiPath="/api/individualnames/"
            //if its in an object the api path will break
//    />
//   }

 //  toast.success(`You successfully deleted your post!`)
    
   const handleItemDelete= async () =>{

    if(sessionFromServer.user._id!=itemCreatedBy){
        toast.error("validation error, session id does not match items's creator's id")
        return
    }
    else {
        await axios.delete(deletionApiPath,
                 {
              data: {itemId}
                 })
              .then(response => {
                 console.log(response) 
                 //reloads page
                 changeItemState(true)
               
                 setShowDeleteConfirmation(false)      
                })
              .catch(error => {
                 console.log("there was an error when deleting your item", error);
                
                 toast.error(`Ruh Roh! Item not deleted`)
                 
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
    
                 

    <div className="relative p-4 text-center rounded-lg shadow dark:bg-darkPurple sm:p-5">

                   {/* X Button and SVG Icon */}

<XSvgIcon
        screenReaderText="Close Delete Confirmaton Screen"
        onClickAction={()=>setShowDeleteConfirmation(false)}/>
          

                       {/* Trash can icon */}
            <svg 
                className="text-gray-400 dark:text-gray-500 w-11 h-11 mb-3.5 mx-auto" 
                aria-hidden="true" 
                fill="white" 
                viewBox="0 0 20 20" 
                xmlns="http://www.w3.org/2000/svg">
                    
                    <path 
                    fillRule="evenodd"
                 d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd">
                    </path>
            </svg>
            
            <p 
            className="mb-4 text-gray-500 dark:text-gray-300">
                Are you sure you want to delete this?</p>

            <div className="flex justify-center items-center space-x-4">

                <button 
                data-modal-toggle="deleteModal" 
                type="button" 
                className="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 
                
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
                className="py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900"
                onClick={()=>handleItemDelete()}
                
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