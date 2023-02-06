import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faCommentDots, faShareFromSquare, faFaceGrinWink, faUserTie, faCircleChevronDown, faClock, faDeleteLeft, faTrash, faTrashCan, faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import '@fortawesome/fontawesome-svg-core/styles.css'

export default function EditButton({onupdateEditState,className}) {

    // const [showEditPage,SetShowEditPage]=useState(false)


    // function updateEditState(){
    //     SetShowEditPage(true)
    //       //passing set state directly as a prop isn't best practice, instead passing a function is better
    //       // https://www.reddit.com/r/learnreactjs/comments/m99nbz/is_it_a_good_practice_to_pass_setstate_of_one/
    //    }


       
  return (
    <label

     className={`justify-self-start ${className}`}>
        
    <input
           className="hidden"
            type="button"           
            onClick={onupdateEditState}    
    />
          
       <FontAwesomeIcon 
              icon={faPenToSquare}
              className="text-2xl  text-emerald-500"/>   
</label>
  )
}
