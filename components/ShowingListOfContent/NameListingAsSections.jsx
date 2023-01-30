import React, {useState, useEffect} from 'react'
import axios from 'axios'
import LikesButtonAndLikesLogic from '../ReusableMediumComponents/LikesButtonAndLikesLogic'

export default function NameListingAsSections({name, sessionFromServer}) {  
   

 //############## LIKES STATE #######

 let [currentTargetedId,setCurrentTargetedNameId]=useState(name._id)
 


  return (
    <div 
    
            className="grid grid-cols-4 gap-4 bg-darkPurple
                    text-purple-200 p-2">
        
                {/* ###### LIKES SECTION #### */}

                <LikesButtonAndLikesLogic 
                     data={name}         
                     currentTargetedId={currentTargetedId}
                     session={sessionFromServer}
                      apiLink={`http://localhost:3000/api/auth/updateLikes`}  
          />

            {/* ###### NAME SECTION #### */}
        <span> {name.name} </span>

            {/* ###### DESCRIPTION SECTION #### */}
        <span>
            {name.description[0]==""?
                     "no description"
                     :name.description}
        </span>

            {/* ###### TAGS SECTION #### */}
        <span>{(name.tags).map(names=>names).join(", ")}</span>
        
       
        
</div>
  )
}
