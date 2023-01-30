import React, {useState, useEffect} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faCommentDots, faFaceGrinWink, faUserTie, faCircleChevronDown } from '@fortawesome/free-solid-svg-icons'
import '@fortawesome/fontawesome-svg-core/styles.css'
import axios from 'axios'

export default function LikesButtonAndLikesLogic({data,currentTargetedId,session,apiLink,HeartIconStyling,HeartIconTextStyling}) {
 //############################ LIKES FEATURE #################   
    let [likesCount,setLikesCount]=useState(data.likedby.length)
 const[dataLiked,setdataLiked] = useState(false)  
       let likesColor= dataLiked? "red":"grey"
       const userId=session.user._id
       
  useEffect(()=>{
      
    //the specific data is being passed as a prop into this component

    // it will take a second for userID to show since we have to grab it from the browser/client side aka localstorage, so lets run use effect so we'll wait for userID to arrive. 
   
    
    //check the data object that was passed as props, does its likedby property include the userId? if so set data to true, else set it to false
      data.likedby.includes(userId)?setdataLiked(true):setdataLiked(false)

    //checks server to see if the client liked the data, if so, set it true. Otherwise, set to false

    //rerun this function anytime the userId changes
    
},[userId])
        


const handlelikes =  (e) => {

    // grabbing the data's unique id when we click on it
    // we can just look at the data props id property      
    // console.log(`this is target ${data._id}`)
    //this is target 63ae16a9f202c8bf57525455
   
    console.log(`this is currentTargetedId ${currentTargetedId}`)
//result: this is currentTargetedId 63abc7d5650d1659f0dd305e
     
    //if user is not logged in, tell them to log in to like datas
  { (!session)&&                  
              toast.error("Please sign in to like")}

          //axios put request
    const putLikes = async () => {
                  try {
                      const response = await axios.put(
                                         apiLink,
                                 { currentTargetedId }
                             

                      );
 
                      console.log(response.data);

                      dataLiked==true?setLikesCount(likesCount-=1):setLikesCount(likesCount+=1)
                      setdataLiked(!dataLiked)


                  } catch (err) {
                      console.log('something went wrong :(', err);
                  }
              };
      putLikes();


    (console.log(`in handlelikes ${dataLiked}`)) 
           //false == result when the heart was grey to start and you clicked it
               //so adding userID to data's likedby
     
            //true ==result when the heart was red to start and you clicked it
                  //so removing userID to data's likedby

      //logic to remove user which disliked the data
         //likedby.filter(users=>users!=userId)
     }         


  return (
    <label
        >
        
    <input
          style={{display:"none"}}
            type="checkbox"
           checked={dataLiked}
            onChange={handlelikes}
          
      
    
    />
    {console.log(HeartIconStyling)}
    
     <FontAwesomeIcon icon={faHeart} 
        className={`${HeartIconStyling}`} 
         color={likesColor}/> 

<span
    className={`${HeartIconTextStyling}`} >
   {likesCount}
   </span>

   
</label>
  )
}
