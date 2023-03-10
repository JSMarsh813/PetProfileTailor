import React, {useEffect, useState} from 'react'
import { useSession, getSession } from "next-auth/react"
import Layout from '../components/NavBar/NavLayoutwithSettingsMenu'

import { authOptions } from "./api/auth/[...nextauth]"
import { unstable_getServerSession } from "next-auth/next"
import { useRouter } from 'next/router';




export const getServerSideProps = async (context) => {

  const session = await unstable_getServerSession(context.req, context.res, authOptions)
 
   
  return {
    props: {    
      sessionFromServer: session,
         },
    }
}


export default function plain({category,nameList, sessionFromServer, pageProps}) {

  
//  const router = useRouter();

//  useEffect(() => {

//      if (!sessionFromServer) {

//        router.push('/login')}
//    }, [router, sessionFromServer]);


   let userName=""
   let profileImage=""

   if (sessionFromServer){
       userName=sessionFromServer.user.name
    profileImage=sessionFromServer.user.profileimage
  }

    // let [userId,setUserId]=useState()

    // useEffect(() => {
    //     const data = localStorage.getItem("session") 
    //     // console.log(data);
    //     setUserId(data)
    // }, [])
         

  return (
    <Layout profileImage={profileImage} userName={userName}  > 
  
    <p> {userName}</p>
 
    
    </Layout>
  )

  }
