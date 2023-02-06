import React,{useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faCommentDots, faShareFromSquare, faFaceGrinWink, faUserTie, faCircleChevronDown, faClock, faDeleteLeft, faTrash, faTrashCan, faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import '@fortawesome/fontawesome-svg-core/styles.css'

export default function ShareButton({shares}) {

const [sharesCount, setSharesCount ]=useState(shares.length)

  return (
    <label
    className="flex-1 inline ml-6">

        <input
            className="hidden"
            type="button"           
            // onClick={onupdateAddShare}    
         />

         <FontAwesomeIcon 
            icon={faShareFromSquare} 
            className="text-3xl mr-2 inline flex-1"/>
        <span
            className="text-xl">{sharesCount}
        </span>

</label>
  )
}
