import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faCommentDots, faShareFromSquare, faFaceGrinWink, faUserTie, faCircleChevronDown, faClock, faDeleteLeft, faTrash, faTrashCan, faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import '@fortawesome/fontawesome-svg-core/styles.css'

export default function ShowTime({postDate}) {

          //  #########   FORMATTING DATE  #################
  const dateFormatter= new Intl.DateTimeFormat(undefined,
    {dateStyle: "medium",
    timeStyle: "short",
      })

let formattedPostDate= dateFormatter.format(Date.parse(postDate))
     //undefined that way it'll reset to the correct timezone based on the users computer
     // To use the browser's default locale, omit this argument or pass undefined. http://udn.realityripple.com/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
     //@58:00 he goes over the time https://www.youtube.com/watch?v=lyNetvEfvT0&ab_channel=WebDevSimplified

  return (
    <span >
    <FontAwesomeIcon 
       icon={faClock}
       className="mx-2" >
   </FontAwesomeIcon> 
   {formattedPostDate}
</span>
  )
}
