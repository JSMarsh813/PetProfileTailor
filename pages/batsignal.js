import React, {useEffect, useState} from 'react'
import { useSession, getSession } from "next-auth/react"
import Layout from '../components/NavBar/NavLayoutwithSettingsMenu'

import { authOptions } from "../pages/api/auth/[...nextauth]"
import { unstable_getServerSession } from "next-auth/next"
import { useRouter } from 'next/router';
import BatsignalPost from "../components/batsignalPost"
import FilteringSidebar from '../components/Filtering/FilteringSidebar';
import { Pagination } from '@nextui-org/react'

// import Pagination from '@etchteam/next-pagination'
// import paginationStyles from '../styles/paginationstyles.module.css'

export const getServerSideProps = async (context) => {

  const session = await unstable_getServerSession(context.req, context.res, authOptions)
  let response = await fetch('http://localhost:3000/api/name-categories');
   
  let data = await response.json()


  return {
    props: {    
      sessionFromServer: session,
      category: data,
         },
    }
}



export default function batsignal({category,nameList, sessionFromServer, pageProps}) {
   
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
    let tagList=["names","photography"]

    const handleFilterChange = (e) => {
    }
    
  return (
    <div classname="mx-auto px-4 py-8 max-w-xl" >
    <Layout profileImage={profileImage} userName={userName}  /> 
     
    
    
    <img className="h-32 mx-auto" 
          src="https://images.wagwalkingweb.com/media/daily_wag/blog_articles/hero/1602871850.792525/best-dog-halloween-costumes-of-2018.jpg"/>

    <h1 className="text-center text-white font-semibold text-3xl mt-4">  BatSignal and PlayYard </h1>

     {/* posts section */}
    <section className="flex w-full h-screen">
      
    <FilteringSidebar
                 category={category} 
                 handleFilterChange={handleFilterChange}/>
    
     <section className="mb-4">
      <BatsignalPost 
        image="https://media.tenor.com/1wU92N1rXhwAAAAM/cute-cute-dog.gif"
        title="Names ideas for this cool dude? 😎"
        paragraphText="Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora reiciendis ad architecto at aut placeat quia, minus dolor praesentium officia maxime deserunt porro amet ab debitis deleniti modi soluta similique..."
        postersProfileImage="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=731&q=80"
        postersName="Bob"
        postDate="friday the 13th"
        amountOfComments="2"
        tagList={tagList.map(tag=>"#"+tag).join(", ")}
        />
              <div className="">
                    <Pagination rounded total={20} initialPage={1}/>
             </div>
        </section>


        </section>
        </div>
  )

  }
