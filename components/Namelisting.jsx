import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faFaceGrinWink, faUserTie } from '@fortawesome/free-solid-svg-icons'
import '@fortawesome/fontawesome-svg-core/styles.css'
import React, {useEffect, useState} from 'react'
// import individualuser from '../models/User'
// import names from '../models/individualNames'
import { useSession, getSession } from "next-auth/react"
import axios from 'axios'

import { toast } from 'react-toastify';

function Namelisting({name}) {
    const { data: session, status } = useSession()
    //grab current user's id
    let [userId,setUserId]=useState()
    let [CurrentTargetedName,setCurrentTargetedName]=useState("")
  
    useEffect(() => {
        let data= (!localStorage.getItem("session"))?
            data="0":
            data=JSON.parse(localStorage.getItem("session")).toString()
        
    
        //we had to convert mongo's object ID to a JSON object, JSON.stringify to store in local storage when we logged in at login.js
            //however JSON's objects are stored with two "", so it stored as ""145555ect""
            // so data=="145555ect" would always be false since ""145555ect""!= "145555ect" (see the "")
            //so we need to use JSON.parse to make it a useable string
            
        // console.log(data);
        setUserId(data)               
        
    }, [])

   

    console.log(userId)
    console.log(`NameListing ${(userId)}`)


 //############################ LIKES FEATURE ###########################################   
       
       const[nameLiked,setNameLiked] = useState(false)
       let likesColor= nameLiked? "red":"grey"

  useEffect(()=>{
      
        // it will take a second for userID to show since we have to grab it from the browser/client side aka localstorage, so lets run use effect so we'll wait for userID to arrive. 
       
          name.likedby.includes(userId)?setNameLiked(true):setNameLiked(false)

        //checks server to see if the client liked the name, if so, set it true. Otherwise, set to false
        
    },[userId])
            

 
  //!!!!!!!!!!!!!update user AND name on server !!!!!!!!!!!!!!!!!!!!
//changes every time namesLiked is chosen
            //!!!!remove name and add name !!!!


const handlelikes =  (e) => {

      // grabbing the name's unique id when we click on it
      let target= e.target.id
      setCurrentTargetedName(target)
       
    {(status === "authenticated")? 
                setNameLiked(!nameLiked): 
                toast.error("Please sign in to like names")}

            //axios put request
      const putLikes = async () => {
                    try {
                        const response = await axios.put(
                            `http://localhost:3000/api/individualnames/${CurrentTargetedName}`,
                                   { likedby: userId }
                                    //add current userid to likedby
                        );
                        console.log(response.status);
  //RESULT: 
            //201
                        console.log(response.data);
//RESULT:
// Array(3) [ {…}, {…}, {…} ]

// 0: Object { _id: "63abc7d5650d1659f0dd305e", name: "donner", __v: 0, … }
// ​
// 1: Object { _id: "63ae1671f202c8bf5752544f", name: "santa", __v: 0, … }
// ​
// 2: Object { _id: "63ae16a9f202c8bf57525455", name: "tataru", __v: 0, … }
// ​
// length: 3
//prototype>: Array []

                    } catch (err) {
                        console.log('something went wrong :(', err);
                    }
                };
        putLikes();

        // https://github.com/safak/youtube/blob/mern-social-app/client/src/components/post/Post.jsx
        // const likeHandler = () => {
        //     try {
        //       axios.put("/posts/" + post._id + "/like", { userId: currentUser._id });
        //     } catch (err) {}
        //     setLike(isLiked ? like - 1 : like + 1);
        //     setIsLiked(!isLiked);
        //   };


      (console.log(`in handlelikes ${nameLiked}`)) 
             //false == result when the heart was grey to start and you clicked it
                 //so adding userID to name's likedby
       
              //true ==result when the heart was red to start and you clicked it
                    //so removing userID to name's likedby

        //logic to remove user which disliked the name
           //likedby.filter(users=>users!=userId)
       }         







   
   //############################## END OF LIKES FEATURE ############################

  return (
 
  
    <tr >
  
    {/* start of likes checkbox section*/}
     <td className="text-purple-200 border-b-2 border-amber-300 px-4 py-2 text-left font-black">
         <label>
        
             <input
                   style={{display:"none"}}
                     type="checkbox"
                    checked={nameLiked}
                     onChange={handlelikes}
                   
                   //  data-amount-of-likes={name.likedby.length}
             
             />
              <FontAwesomeIcon icon={faHeart} className="text-4xl" color={likesColor} />

           
              {/* {console.log(name.likedby.filter(e=>e=="63"))} */}

            {name.likedby.length}
          {/* { console.log(name.likedby)}
          {console.log(typeof (userId))} */}
           {/* {userId} */}
            
        </label>
             
     </td> 
  {/* end of likes checkbox section*/}


<td className="text-purple-200 border-b-2 border-amber-300 px-4 py-2 text-left font-black">{name.name}</td>

<td className="border-b-2 border-amber-200 px-4 py-2 text-left font-medium">{name.description}</td>

<td className="border-b-2 border-amber-100 px-4 py-2 text-left font-medium">{
        (name.tags)
            .map(names=>names)
            .join(", ")}
        </td>
{console.log((name.tags))}
{console.log(Array.isArray(name.tags))}

</tr>
)
 
}



export default Namelisting