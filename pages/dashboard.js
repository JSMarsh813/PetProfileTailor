import React, { useContext, createContext, useState, useEffect } from 'react'
import Layout from '../components/NavBar/NavLayoutwithSettingsMenu'
import { signOut, useSession } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBowlFood, faCookieBite,faRankingStar, faTags, faIgloo, faLightbulb, faIdCard, faComment } from '@fortawesome/free-solid-svg-icons'
import '@fortawesome/fontawesome-svg-core/styles.css'

import axios from 'axios'
import { ChevronDownIcon, FunnelIcon, MinusIcon, PlusIcon, Squares2X2Icon } from '@heroicons/react/20/solid'
import UserSessionContext from "../src/context/UserSessionContext"

import NameListing from "../components/ShowingListOfContent/Namelisting"
import MainChartComponent from "../components/MainChartComponent"
import GeneralButton from '../components/GeneralButton';
import GeneralOpenCloseButton from "../components/buttons/generalOpenCloseButton"

import { authOptions } from "../pages/api/auth/[...nextauth]"
import { unstable_getServerSession } from "next-auth/next"

import dbConnect from "../utils/db"
import IndividualNames from "../models/individualNames"
//wasn't working when everything was lowercase, had to be IndividualNames not individualNames for it to work
import { useRouter } from 'next/router';

import RankNames from '../components/RankNames';





export const getServerSideProps = async (context) => {

  let response = await fetch('http://localhost:3000/api/name-categories');
  let data = await response.json()


  let nameResponse= await fetch('http://localhost:3000/api/individualnames');  
  let nameData = await nameResponse.json()

  const session = await unstable_getServerSession(context.req, context.res, authOptions)
  // const userEmail = await session.user.email;


                                //USERS FAVED NAMES //

  let filterednames=""
       if(session){
             let filteringNames= await fetch(`http://localhost:3000/api/individualnames/namesContainingUserId/${session.user._id}`);

             filterednames= await filteringNames.json()   
             }

                             //NAMES ADDED BY USER //
 
  // let currentUser= await fetch('http://localhost:3000/api/getCurrentUser');
 


  // let currentProfilePicture = currentUser

  //look through names, find names user favorited
  // look through names, find names user created
  // look at user, find their current profile image





    
        // try {
        //   await dbConnect() //from config/mongo.js

        //     const individualNames = await IndividualNames.find();
        //     filteredNames = individualNames.filter(name=>name.likedby.includes("63a90c2e83e6366b179ffc40"))
        //     return filteredNames
           
        //   } catch (err) {
        //     JSON.stringify(err);
        //   }
         


  // console.log(data);
//getServerSideProps allows us to fetch data from an api
//runs only on server side, will never run clicent side
//can run server-side code directly in getStaticProps
  return {
    props: {
      category: data,
      nameList: nameData,
      favNames:filterednames,
      sessionFromServer: session,
         },
    }
//kept getting an error that it couldn't parse due to Error serializing `.userIdFromServer.user.image` but there was no image property....adding an image property and making it null also didn't work. JSON.parse(JSON.stringify((session)) used as a workaround)

  //and provide the data as props to the page by returning an object from the function
}




function dashboard({category,nameList,sessionFromServer,favNames}) {


   const [treatBreakdownMenuOpen,settreatBreakdownMenuOpen]=useState(false)
  const [favoritesListOpen,setFavoritesListOpen]=useState(false)
  const valuetest = useContext(UserSessionContext); 
   
 const router = useRouter();

  useEffect(() => {

      if (!sessionFromServer) {
 
        router.push('/login')}
    }, [router, sessionFromServer]);
                        //##############POINTS###########

       const [nameLikedPoints,setNameLikedPoints]=useState(favNames.length*1)
       const [nameAddedPoints,setNameAddedPoints]=useState("0")
       const [commentLikedPoints,setCommentLikedPoints]=useState("3")
       const [commentAddedPoints,setCommentAddedPoints]=useState("6")

      
        const [totalPoints,setTotalPoints]=useState((+nameLikedPoints)+(+nameAddedPoints)+(+commentLikedPoints)+(+commentAddedPoints))
       
      console.log(totalPoints)
     
       console.log(sessionFromServer)
       
       let userName=""
       let profileImage=""

       if (sessionFromServer){
           userName=sessionFromServer.user.name
        profileImage=sessionFromServer.user.profileimage
      }
//   let [userId,setUserId]=useState(userIdFromServer._id)

// {console.log(`from server ${(userId)}`)}

// const currentUserInfo = async ({ name, email, password }) => {
//   try {
//     await axios.post('/api/auth/signup', {
//       name,
//       email,
//       password,
//     });

//     const result = await signIn('credentials', {
//       redirect: false,
//       email,
//       password,
//     });
//     if (result.error) {
//       toast.error(result.error);
//     }
//     else {
      
//       toast.success("Successfully signed up! Sending to profile page")
//       console.log(result)
//       // Object { error: null, status: 200, ok: true, url: "http://localhost:3000/api/auth/signin?csrf=true" }
//       console.log(`email: ${email} pass:${password}`)
//       //email: kyunyu@gmail.com pass:testtest
//       //and appears in mongodb users collection
//       router.push("/")
//     }
//   } catch (err) {
//     toast.error(getError(err));
//   }
// };





//grab userID from localStorage

// useEffect(() => {
//   let data= (!localStorage.getItem("session"))?
//       data="0":      
//       data=JSON.parse(localStorage.getItem("session")).toString()
  

  //we had to convert mongo's object ID to a JSON object, JSON.stringify to store in local storage when we logged in at login.js
      //however JSON's objects are stored with two "", so it stored as ""145555ect""
      // so data=="145555ect" would always be false since ""145555ect""!= "145555ect" (see the "")
      //so we need to use JSON.parse to make it a useable string
      
  // console.log(data);
  // setUserId(data)   
  // getUser()            
  
// }, [])

            // get request to api/user/???
       
  // const getUser = async()=> {
 
  //   let response=await fetch(`/api/user/${userId}`);
    
  //   let data = await response.json()
 
  //   setUserInfo(data)
  //   return res.status(422).send("somethings wrong")

  
  // }
         



  return (
    <div className="bg-violet-900 h-fit">
     
     <Layout profileImage={profileImage} userName={userName} /> 
  {/* <p> {currentProfilePicture}</p> */}
      
       <section>

     {/* <p> {(valuetest)}</p> */}


     <div className="relative overflow-hidden bg-no-repeat bg-cover" 
      style={{backgroundPosition: "80%",
       backgroundImage: `url("https://www.freewebheaders.com/wp-content/gallery/dogs/dogs-header-2121-800x200.jpg")`, 
      height: "200px"}}
     
      >
       
     </div>


<div className="container mx-auto px-4 md:px-12 xl:px-32">
<div className="text-center text-white">
  <div className="block rounded-lg shadow-lg px-6 py-12 md:py-16 md:px-12" style={{marginTop: "-70px", background: "hsla(273, 98%, 60%, 0.4)", backdropFilter: "blur(20px)"}}>

  {!sessionFromServer ? (
              'Loading'
            ) :
            
    (<div>
        <section className="Welcome-username-and-profile-image flex border-b-2 border-yellow-300 pb-4">

         <h3 className="text-yellow-400  font-bold mb-2 mx-auto font-semibold text-4xl mb-4">{`Welcome Back ${userName}!`}
      </h3> 
         <img className="ml-3  h-32 rounded-full inline"src={profileImage}/>

         {/* for large screens: -mt-11 */}
        
      </section>

    
    <section className="userStatsSection pt-4">
      
      <section className="overallStats mb-2 font-bold">
          <span className="px-6">
               <FontAwesomeIcon icon={faCookieBite} className="text-2xl mr-2 text-yellow-400"/>
               Treats Earned: 
               <span className="text-yellow-400"> {totalPoints} 
               </span>
           </span>

           <div>
               <FontAwesomeIcon icon={faRankingStar} className="text-2xl mr-2 text-yellow-400"/>
               <section>
                    Current Rank Title:
                            <RankNames points={totalPoints}/>                      
                </section>

          </div>
       </section>

      <section className="mt-4">

      <GeneralOpenCloseButton 
       text="Your Treat Points Breakdown " 
       setStatus={settreatBreakdownMenuOpen} 
       styling=""
        status={treatBreakdownMenuOpen}/>


       { treatBreakdownMenuOpen==true&&( <section className="userStatsBreakdownDropDown 
           grid grid-cols-2 grid-flow-row  gap-2
           bg-darkPurple font-bold border-2 border-yellow-300 p-4">
      
                <div>
                <FontAwesomeIcon icon={faTags} className="text-xl mr-1 text-red-500"/>
                  Liked Names: 
                       <span className="text-yellow-300">{nameLikedPoints}</span>
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
                  <span className="text-yellow-300"> {commentLikedPoints}</span>
                  </div>

                <div>
                <FontAwesomeIcon icon={faTags} className="text-xl mr-1 text-green-500"/>
                  Added Names: 
                  <span className="text-yellow-300"> {nameAddedPoints}</span>
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
                  <span className="text-yellow-300"> {commentAddedPoints}</span>
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
  
       {/* ############# FAVORITE LISTS SECTION ############ */}

  <section className="favoritesSection px-4">

       <h3 className="text-center mt-5 text-yellow-400  font-bold mb-2 text-2xl 
       pb-2
       border-b-2
       border-yellow-300"> Your Favorites </h3>

       <div className="favoriteSubsections mt-5 text-yellow-400  font-bold mb-2 text-2xl 
       pb-2
       border-b-2
       border-yellow-300">

         {/* ############# FAVORITE NAMES LIST ############ */}

              <section className="favoriteNames">

              

               <div className="flow-root w-screen">

  <GeneralOpenCloseButton 
       text="Open Your Favorites Names List" 
       setStatus={setFavoritesListOpen} 
       styling=""
        status={favoritesListOpen}/>

                  {/* <div className="float-right mb-4">
                        <GeneralButton text="Sort Names by Categories"></GeneralButton>
                  </div> */}
                 
                </div>


                {favoritesListOpen==true&&  <MainChartComponent nameList={favNames}/>}
                

              </section>

 {/* ############# FAVORITE DESCRIPTIONS LIST ############ */}

              <section className="favoriteDescriptions">


              <GeneralOpenCloseButton 
       text="Open Your Favorites Descriptions List" 
       setStatus={setFavoritesListOpen} 
       styling=""
        status={favoritesListOpen}/>

{favoritesListOpen==true&&<MainChartComponent nameList={nameList}/>}                

              </section>

       </div>

  </section>

        {/* <p>{userId}</p> */}
       
       <section>
          
          <h4> Recent batsignals .... </h4>

          <p> Offer your help and creativty to your community members who are struggling to find the perfect name, description or more! </p>

       </section>
      
    </div>
  )
}


export default dashboard