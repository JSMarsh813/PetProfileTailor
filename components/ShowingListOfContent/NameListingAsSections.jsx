import React, {useState, useEffect} from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faCommentDots, faFaceGrinWink, faUserTie, faCircleChevronDown } from '@fortawesome/free-solid-svg-icons'
import '@fortawesome/fontawesome-svg-core/styles.css'
import axios from 'axios'

export default function NameListingAsSections({name, sessionFromServer}) {
  
   

 //############## LIKES STATE #######
 let [likesCount,setLikesCount]=useState(name.likedby.length)
 const[nameLiked,setNameLiked] = useState(false)  
 let [currentTargetedNameId,setCurrentTargetedNameId]=useState(name._id)
 
       let likesColor= nameLiked? "red":"grey"

      // ############ FOR LIKES COLOR ON APP LOAD ##########

      useEffect(()=>{
      
          
        name.likedby.includes(sessionFromServer.user._id)?
                 setNameLiked(true):setNameLiked(false)

      //checks server to see if the client liked the name, if so, set it true so the heart is red. Otherwise, set to false               
      
  },[sessionFromServer])


  
                
const handlelikes =  (e) => {

    // grabbing the name's unique id when we click on it
    // we can just look at the name props id property      
    // console.log(`this is target ${name._id}`)
    //this is target 63ae16a9f202c8bf57525455
   
    console.log(`this is currentTargetedNameId ${currentTargetedNameId}`)
//result: this is currentTargetedNameId 63abc7d5650d1659f0dd305e
     
    //if user is not logged in, tell them to log in to like names
  { (!sessionFromServer)&&                  
              toast.error("Please sign in to like names")}

          //axios put request
    const putLikes = async () => {
                  try {
                    const response = await axios.put(
                        `http://localhost:3000/api/auth/updateLikes`,
                               { currentTargetedNameId }
                             

                      );
//                            //Object { currentTargetedNameId: "63ae16a9f202c8bf57525455" }
                      console.log(response.status);

                      console.log(response.data);
                      nameLiked==true?setLikesCount(likesCount-=1):setLikesCount(likesCount+=1)
                      setNameLiked(!nameLiked)



                  } catch (err) {
                      console.log('something went wrong :(', err);
                  }
              };
      putLikes();

    (console.log(`in handlelikes ${nameLiked}`)) 
  
     }         

  return (
    <div 
            className="grid grid-cols-4 gap-4 bg-darkPurple
                    text-purple-200 p-2">
        
                {/* ###### LIKES SECTION #### */}
        <span>
            <label>
         
               <input
                style={{display:"none"}}
                type="checkbox"
                checked={nameLiked}
                onChange={handlelikes}        
                   />
                <FontAwesomeIcon icon={faHeart} className="text-4xl" color={likesColor}/>     
      
                 {likesCount}
       
            </label>
        </span>

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
