import React, {useState, useEffect} from 'react'
import axios from 'axios'
import LikesButtonAndLikesLogic from '../ReusableMediumComponents/LikesButtonAndLikesLogic'
import DeleteButton from '../ReusableSmallComponents/DeleteButton'
import EditButton from '../ReusableSmallComponents/EditButton'
import { useRouter } from 'next/router';
import DeleteItemNotification from '../DeletingData/DeleteItemNotification'
import EditName from '../EditingData/EditName'

export default function NameListingAsSections({name, sessionFromServer,tagList}) {  
    const router=useRouter()

 //############## STATE FOR LIKES #######

 let [currentTargetedId,setCurrentTargetedNameId]=useState(name._id)

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
    <div 
    
            className="grid 
            lg:grid-cols-5
            grid-cols-3 gap-4 
            border-b-2 border-amber-300
            bg-darkPurple
                    text-purple-200 p-2  
                    
                    
                    items-center justify-items-center">
        
                {/* ###### LIKES SECTION #### */}

                <LikesButtonAndLikesLogic 
                     data={name}      
                     HeartIconStyling="text-2xl"  
                     HeartIconTextStyling="ml-2" 
                     currentTargetedId={currentTargetedId}
                     session={sessionFromServer}
                      apiLink={`http://localhost:3000/api/auth/updateLikes`}  
          />

            {/* ###### NAME SECTION #### */}
        <span className=""> {name.name} </span>

            {/* ###### DESCRIPTION SECTION #### */}
        <span
            className="ml-4">
            {name.description[0]==""?
                     "no description"
                     :name.description}
        </span>

            {/* ###### TAGS SECTION #### */}
        <span>{(name.tags).map(names=>names).join(", ")}</span>
        
            {/* ###### CREATEDBY SECTION #### */}
        <section>
            <img 
                src={name.createdby.profileimage}
                className="rounded-2xl h-16"/>

           <span>  {name.createdby.name}</span>
           <span>   @{name.createdby.profilename}</span>

           {((sessionFromServer)&&
                   (name.createdby._id==sessionFromServer.user._id))&&
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
                    {name._id}
        itemCreatedBy=
                    {name.createdby._id}

         deletionApiPath="/api/individualnames/"
     />
    }

{showEditPage&&
        <EditName
          SetShowEditPage={SetShowEditPage}
           name={name}
            sessionFromServer={sessionFromServer}
        setItemChanged={setItemChanged}
        tagList={tagList}
        // setToastMessage={setToastMessage}
         />
    }

           
        </section>
       
        
</div>
  )
}
