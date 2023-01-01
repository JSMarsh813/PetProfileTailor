import React, { useContext, useEffect, useState } from 'react';
import Layout from '../components/NavBar/NavLayoutwithSettingsMenu'
import { signOut, useSession } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBowlFood, faCookieBite,faRankingStar, faTags, faIgloo, faLightbulb, faIdCard, faComment } from '@fortawesome/free-solid-svg-icons'
import '@fortawesome/fontawesome-svg-core/styles.css'

import axios from 'axios'
import { ChevronDownIcon, FunnelIcon, MinusIcon, PlusIcon, Squares2X2Icon } from '@heroicons/react/20/solid'

function dashboard() {

  const { status, data: session } = useSession();
  const [userInfo,setUserInfo] =useState()
  const [treatBreakdownMenuOpen,settreatBreakdownMenuOpen]=useState(false)

  let [userId,setUserId]=useState("")
  // get users data from the server

        //need userId, from getStorage or maybe request params somehow?


//grab userID from localStorage
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
  // getUser()            
  
}, [])

            // get request to api/user/???
       
  // const getUser = async()=> {
 
  //   let response=await fetch(`/api/user/${userId}`);
    
  //   let data = await response.json()
 
  //   setUserInfo(data)
  //   return res.status(422).send("somethings wrong")

  
  // }



  return (
    <div className="bg-violet-900">
     
        <Layout></Layout>
        <section>
     
     <div className="relative overflow-hidden bg-no-repeat bg-cover" 
      style={{backgroundPosition: "80%",
       backgroundImage: `url("https://www.freewebheaders.com/wp-content/gallery/dogs/dogs-header-2121-800x200.jpg")`, 
      height: "200px"}}
      testing
      >
     </div>

<div class="container mx-auto px-4 md:px-12 xl:px-32">
<div class="text-center text-white">
  <div class="block rounded-lg shadow-lg px-6 py-12 md:py-16 md:px-12" style={{marginTop: "-70px", background: "hsla(273, 98%, 60%, 0.4)", backdropFilter: "blur(20px)"}}>

  {status === 'loading' ? (
              'Loading'
            ) :
            
    (<div>
        <section className="Welcome-username-and-profile-image flex border-b-2 border-yellow-300 pb-4">

         <h3 class="text-yellow-400  font-bold mb-2 mx-auto font-semibold text-4xl mb-4">{`Welcome Back ${session.user.name}!`}
      </h3> 
         <img className="ml-3  h-32 rounded-full inline"src="https://preview.redd.it/mretq5qte3451.png?auto=webp&s=6040f7d829d09479fd3f44a0546d19653f35219c"/>

         {/* for large screens: -mt-11 */}
        
      </section>

    
    <section className="userStatsSection pt-4">
      
      <section className="overallStats mb-2 font-bold">
          <span className="px-6">
               <FontAwesomeIcon icon={faCookieBite} className="text-2xl mr-2 text-yellow-400"/>
               Treats Earned: 
               <span className="text-yellow-400"> {session.user.points||"6"} 
               </span>
           </span>

           <div>
               <FontAwesomeIcon icon={faRankingStar} className="text-2xl mr-2 text-yellow-400"/>
               <span >
                    Current Rank Title:
                       <span className="text-yellow-400"> The Babiest Woofer </span>
                </span>

          </div>
       </section>

      <section className="mt-4">

        <button className="text-xl bg-yellow-300 
        text-violet-700  font-bold py-2 px-4 border-b-4 border-b-transparent

        hover:bg-violet-700 
        hover:text-yellow-300
        hover:border-yellow-400 rounded"
        onClick={()=> 
          settreatBreakdownMenuOpen(!treatBreakdownMenuOpen)}
        >
              Your Treat Points Breakdown 
              <ChevronDownIcon
                      className="inline ml-2 h-5"
                      aria-hidden="true"
                     
                    />
              

           
        </button>

       { treatBreakdownMenuOpen==true&&( <section className="userStatsBreakdownDropDown 
           grid grid-cols-2 grid-flow-row  gap-2
           bg-darkPurple font-bold border-2 border-yellow-300 p-4">
      
                <div>
                <FontAwesomeIcon icon={faTags} className="text-xl mr-1 text-red-500"/>
                  Liked Names: 
                       <span className="text-yellow-300"> 2</span>
                </div>

                <div>
                <FontAwesomeIcon icon={faIdCard} className="text-xl mr-1 text-red-500"/>
                  Liked Descriptions: 
                  <span className="text-yellow-300"> 0</span>
                  </div>

                  <div>
                  <FontAwesomeIcon icon={faLightbulb} className="text-xl mr-1 text-red-500"/>
                  Liked Inspiration Posts: 
                  <span className="text-yellow-300"> 0</span>
                  </div>

                  <div>
               
                  <FontAwesomeIcon icon={faComment} className="text-xl mr-1 text-red-500"/>
                  
                  Liked Comments: 
                  <span className="text-yellow-300"> 0</span>
                  </div>

                <div>
                <FontAwesomeIcon icon={faTags} className="text-xl mr-1 text-green-500"/>
                  Added Names: 
                  <span className="text-yellow-300"> 4</span>
                  </div>

                <div>
                <FontAwesomeIcon icon={faIdCard} className="text-xl mr-1 text-green-500"/>
                  Added Descriptions: 
                  <span className="text-yellow-300"> 0</span>
                  </div>

                  <div>
                  <FontAwesomeIcon icon={faLightbulb} className="text-xl mr-1 text-green-500"/>
                  Added Inspiration Posts: 
                  <span className="text-yellow-300"> 0</span>
                  </div>

                <div>
                <FontAwesomeIcon icon={faComment} className="text-xl mr-1 text-green-500"/>
                  Comments Added: 
                  <span className="text-yellow-300"> 0</span>
                  </div>

             </section>)}
          
        </section>
    </section>
    </div>    
    )

    
  }
   
  </div>
</div>
</div>

     </section>
  

        <p>{userId}</p>
        {console.log(userInfo)}
      
    </div>
  )
}


export default dashboard