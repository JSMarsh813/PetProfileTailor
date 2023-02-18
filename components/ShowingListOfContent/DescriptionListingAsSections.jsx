import React, {useState, useEffect} from 'react'
import axios from 'axios'
import LikesButtonAndLikesLogic from '../ReusableMediumComponents/LikesButtonAndLikesLogic'
import DeleteButton from '../ReusableSmallComponents/DeleteButton'
import EditButton from '../ReusableSmallComponents/EditButton'
import { useRouter } from 'next/router';
import DeleteItemNotification from '../DeletingData/DeleteItemNotification'
import EditDescription from '../EditingData/EditDescription'

export default function DescriptionListingAsSections({description, sessionFromServer,tagList}) {  
    const router=useRouter()

 //############## STATE FOR LIKES #######

 let [currentTargetedId,setCurrentTargetedDescriptionId]=useState(description._id)

 //##### STATE FOR DELETIONS ######

 const [showDeleteConfirmation,setShowDeleteConfirmation]=useState(false)

 // ##### STATE FOR EDITS ####
  const [showEditPage,SetShowEditPage]=useState(false)

 //#### STATE FOR EDITS AND DELETIONS
 const [itemChanged,setItemChanged]=useState(false)
 

         // ##for the delete notification button #####

         function updateDeleteState(){
            setShowDeleteConfirmation(true)
               }        

        // ### for the edit notification button
               function updateEditState(){
                SetShowEditPage(true)
                 }

        //if itemChanged in the state is true, then we'll force a reload of the page. This is for BOTH the edit and delete functions

      if (itemChanged) {
             
        const forceReload = () => 
        {router.reload()}  
      
          forceReload()
          setItemChanged(false)           
       
      } 
  



  return (
    <div className=" border-b-2 border-amber-300">
    <div 
    
            className="grid 
            lg:grid-cols-5
            grid-cols-3 gap-4 
           
            bg-darkPurple
                    text-purple-200 p-2  
                    
                    
                    items-center justify-items-center">
        
                {/* ###### LIKES SECTION #### */}

                <LikesButtonAndLikesLogic 
                     data={description}      
                     HeartIconStyling="text-2xl"  
                     HeartIconTextStyling="ml-2" 
                     currentTargetedId={currentTargetedId}
                     session={sessionFromServer}
                      apiLink={`http://localhost:3000/api/description/updateLikes`}  
          />

            {/* ###### description SECTION #### */}
        <span className=""> {description.description} </span>

            {/* ###### NOTES SECTION #### */}
        <span
            className="ml-4">
            {description.notes==""?
                     "no notes"
                     :description.notes}
        </span>

            {/* ###### TAGS SECTION #### */}
        <span>{(description.tags).map(descriptions=>descriptions).join(", ")}</span>
        
            {/* ###### CREATEDBY SECTION #### */}
        <section>
            <img 
                src={description.createdby.profileimage}
                className="rounded-2xl h-16"/>

           <span>  {description.createdby.name}</span>
           <span>   @{description.createdby.profilename}</span>

           {((sessionFromServer)&&
                   (description.createdby._id==sessionFromServer.user._id))&&
           <div className="my-2">
                  <EditButton
                         className="ml-2 mr-6"
                         onupdateEditState={updateEditState} 
                         />
                  <DeleteButton
                     onupdateDeleteState={updateDeleteState}/>
                     
           </div>
            }

 {showDeleteConfirmation&&
    <DeleteItemNotification
        setShowDeleteConfirmation=      
                    {setShowDeleteConfirmation}
        sessionFromServer=
                    {sessionFromServer}
        changeItemState=
                    {setItemChanged}
        itemId=
                    {description._id}
        itemCreatedBy=
                    {description.createdby._id}

         deletionApiPath="/api/description/"
     />
    }


{showEditPage&&
        <EditDescription
          SetShowEditPage={SetShowEditPage}
           description={description}
            sessionFromServer={sessionFromServer}
        setItemChanged={setItemChanged}
        tagList={tagList}
        // setToastMessage={setToastMessage}
         />
    }

           
        </section>
       
        
</div>

<section
    className="text-center"> Testing </section>
</div>

  )
}
