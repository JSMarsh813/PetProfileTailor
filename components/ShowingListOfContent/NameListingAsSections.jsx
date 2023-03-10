import React, {useState, useEffect} from 'react'
import axios from 'axios'
import LikesButtonAndLikesLogic from '../ReusableMediumComponents/LikesButtonAndLikesLogic'
import DeleteButton from '../ReusableSmallComponents/DeleteButton'
import EditButton from '../ReusableSmallComponents/EditButton'

export default function NameListingAsSections({name, sessionFromServer}) {  
   

 //############## LIKES STATE #######

 let [currentTargetedId,setCurrentTargetedNameId]=useState(name._id)
 


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
                         className="ml-2 mr-6"/>
                  <DeleteButton/>
           </div>
            }

           
        </section>
       
        
</div>
  )
}
