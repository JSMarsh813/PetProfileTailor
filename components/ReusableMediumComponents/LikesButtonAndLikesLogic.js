import React, {useState, useEffect} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faCommentDots, faFaceGrinWink, faUserTie, faCircleChevronDown } from '@fortawesome/free-solid-svg-icons'
import '@fortawesome/fontawesome-svg-core/styles.css'
import axios from 'axios'

export default function LikesButtonAndLikesLogic({name,currentTargetedNameId,session}) {
 //############################ LIKES FEATURE #################   
    let [likesCount,setLikesCount]=useState(name.likedby.length)
 const[nameLiked,setNameLiked] = useState(false)  
       let likesColor= nameLiked? "red":"grey"
       const userId=session.user._id
       
  useEffect(()=>{
      
    //the specific name is being passed as a prop into this component

    // it will take a second for userID to show since we have to grab it from the browser/client side aka localstorage, so lets run use effect so we'll wait for userID to arrive. 
   
    
    //check the name object that was passed as props, does its likedby property include the userId? if so set name to true, else set it to false
      name.likedby.includes(userId)?setNameLiked(true):setNameLiked(false)

    //checks server to see if the client liked the name, if so, set it true. Otherwise, set to false

    //rerun this function anytime the userId changes
    
},[userId])
        


const handlelikes =  (e) => {

    // grabbing the name's unique id when we click on it
    // we can just look at the name props id property      
    // console.log(`this is target ${name._id}`)
    //this is target 63ae16a9f202c8bf57525455
   
    console.log(`this is currentTargetedNameId ${currentTargetedNameId}`)
//result: this is currentTargetedNameId 63abc7d5650d1659f0dd305e
     
    //if user is not logged in, tell them to log in to like names
  { (!session)&&                  
              toast.error("Please sign in to like names")}

          //axios put request
    const putLikes = async () => {
                  try {
                      const response = await axios.put(
                          `http://localhost:3000/api/auth/updateLikes`,
                                 { currentTargetedNameId }
                             

                      );
 
                      console.log(response.data);

                      nameLiked==true?setLikesCount(likesCount-=1):setLikesCount(likesCount+=1)
                      setNameLiked(!nameLiked)


                  } catch (err) {
                      console.log('something went wrong :(', err);
                  }
              };
      putLikes();


    (console.log(`in handlelikes ${nameLiked}`)) 
           //false == result when the heart was grey to start and you clicked it
               //so adding userID to name's likedby
     
            //true ==result when the heart was red to start and you clicked it
                  //so removing userID to name's likedby

      //logic to remove user which disliked the name
         //likedby.filter(users=>users!=userId)
     }         


  return (
    <label>
        
    <input
          style={{display:"none"}}
            type="checkbox"
           checked={nameLiked}
            onChange={handlelikes}
          
      
    
    />
     <FontAwesomeIcon icon={faHeart} className="text-4xl" color={likesColor} /> 


   {likesCount}

   
</label>
  )
}
