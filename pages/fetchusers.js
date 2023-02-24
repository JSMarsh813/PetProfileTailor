import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon, FaceSmileIcon } from '@heroicons/react/20/solid'
import React, {useEffect, useState} from 'react'
import { useSession, getSession } from "next-auth/react"

import { toast } from 'react-toastify';
import Layout from '../components/NavBar/NavLayoutwithSettingsMenu'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faFaceGrinWink, faUserTie } from '@fortawesome/free-solid-svg-icons'
import '@fortawesome/fontawesome-svg-core/styles.css'
import usersId from './api/auth/updateLikes'
import { useForm } from 'react-hook-form';

import { authOptions } from "./api/auth/[...nextauth]"
import { unstable_getServerSession } from "next-auth/next"



export const getServerSideProps = async (context) => {

  const session = await unstable_getServerSession(context.req, context.res, authOptions)
 



    // console.log(data);
  //getServerSideProps allows us to fetch data from an api
  //runs only on server side, will never run clicent side
  //can run server-side code directly in getStaticProps
    return {
      props: {
    
        sessionFromServer: session,
           },
      }


    //and provide the data as props to the page by returning an object from the function
  }



export default function FetchUsers({sessionFromServer}) {
  
  let userName=""
  let profileImage=""

  if (sessionFromServer){
      userName=sessionFromServer.user.name
   profileImage=sessionFromServer.user.profileimage
 }
              


  return (
  <div className="bg-violet-900 h-screen">

    <Layout 
        profileImage={profileImage} 
        userName={userName}  /> 

        <div>
          lookup user by: user name
          
        </div>

        <div>
          lookup user by: profilename
          
        </div>
       

       
</div>
  )
}

