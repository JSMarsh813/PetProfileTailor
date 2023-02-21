import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faCommentDots, faFaceGrinWink, faUserTie, faCircleChevronDown, faLocationDot, faRankingStar, faUserPlus, faEnvelopeOpenText, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import '@fortawesome/fontawesome-svg-core/styles.css'

export default function FollowButton() {
  return (

    <label
    className="justify-self-end
    mr-2 mx-auto bg-yellow-500 hover:bg-yellow-400 border-b-4 border-yellow-700 
             hover:border-yellow-500 text-center py-2 px-4 rounded">
    
    
    <input
          className="hidden"
          type="button"  
        //   onClick={onupdateDeleteState}                  
            
   />
            <FontAwesomeIcon 
           icon={faUserPlus}
           className="mr-2"/>
            Follow
            </label>
  )
}
