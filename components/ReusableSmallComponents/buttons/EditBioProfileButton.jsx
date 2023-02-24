import React, {useState, useEffect} from 'react'
import axios from 'axios'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faCommentDots, faFaceGrinWink, faUserTie, faCircleChevronDown, faLocationDot, faRankingStar, faUserPlus, faEnvelopeOpenText, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import '@fortawesome/fontawesome-svg-core/styles.css'

export default function EditBioProfileButton(
  {session,apiLink,FollowIconStyling,FollowTextStyling,className,setShowProfileEditPage}
) {

    

  return (
    <>     
        <label
             className={`justify-self-end
             mr-2 mx-auto bg-yellow-500 hover:bg-yellow-400 border-b-4 border-yellow-700
                      hover:border-yellow-500 text-center py-2 px-4 rounded ${className}`}>
             
    <input
           className="hidden"
            type="button"           
            onClick={()=>setShowProfileEditPage(true)}    
    />
                     <FontAwesomeIcon 
                    icon={faUserPlus}
                    className={`mr-2${FollowIconStyling}`} />
         
                    <span
                        className={`${FollowTextStyling}`} >
                    Edit Profile
                    </span>
                     </label>       
  </>
  )
}
