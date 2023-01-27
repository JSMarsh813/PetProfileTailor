import React, { useContext, useEffect, useState } from 'react';
import User from "../models/User"
import db from '../utils/db'
import { getSession,useSession } from 'next-auth/react';
import { authOptions } from "../pages/api/auth/[...nextauth]"
import { unstable_getServerSession } from "next-auth/next"


export const getServerSideProps = async (context) => {

    const session = await unstable_getServerSession(context.req, context.res, authOptions)    
    if (!session) {
      console.log("no session")
    }  
    const userEmail = session.user.email;


    try {     
      await db.connect();   
      const users = await User.findOne({ email: userEmail });
      return {
        props: {
           currentProfileImage: JSON.parse(JSON.stringify(users.profileimage))
          
           
        },
      };
    } catch (error) {
      console.log(error);
      return {
        notFound: true,
      };
    }
  };

  //placing profile image in local storage
function GrabOneUser(currentProfileImage) {

  const [UserprofileImage,setUserProfileImage]=useState("")

  useEffect(()=>{
    if (typeof window !== 'undefined') {
          localStorage.setItem("PetProfileProfileImage",(currentProfileImage["currentProfileImage"]))
          let testing=(localStorage.getItem("PetProfileProfileImage"))
          setUserProfileImage(testing)
    }
},[])

  return (
    <div>
   
    <p> test</p>
    <p> {JSON.stringify(UserprofileImage)}</p>
    <img src={UserprofileImage}/>
    {console.log(currentProfileImage)}
 
    </div>
  )
}

export default GrabOneUser

