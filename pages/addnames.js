import Select from 'react-select';
import React, { useState } from 'react';
import axios from 'axios'
import NewNameWithTagsData from '../components/AddingNewData/addingName'
//another serverSide props from  let categoryList = await fetch('http://localhost:3000/api/name-categories);
import AddNewTag from '../components/AddingNewData/AddingNewTag'
import { useSession } from "next-auth/react"
import Layout from '../components/NavBar/NavLayoutwithSettingsMenu'

import { authOptions } from "../pages/api/auth/[...nextauth]"
import { unstable_getServerSession } from "next-auth/next"




export const getServerSideProps = async (context) => {

    let tagList = await fetch('http://localhost:3000/api/individualtags');
    let categoryList = await fetch('http://localhost:3000/api/name-categories');
  
        let tagData = await tagList.json()
        let categoryData = await categoryList.json()
    
  const session = await unstable_getServerSession(context.req, context.res, authOptions)


    return {
      props: {
        tagList: tagData,
        categoryList: categoryData,
        sessionFromServer:session,
                   },
      }
    //and provide the data as props to the page by returning an object from the function
  }


  
function AddNewNameWithTags({tagList,categoryList,sessionFromServer}) {

  
  const { data: session, status } = useSession()

//needed to avoid error if sessionFromServer is null aka not signed in
  let userName=""
  let profileImage=""
  let userId=""
 
  if (sessionFromServer){
      userName=sessionFromServer.user.name
      profileImage=sessionFromServer.user.profileimage
      userId=sessionFromServer.user._id
     }

     return (     
<div className="bg-violet-900 h-full text-white">
<Layout 
        profileImage={profileImage} 
        userName={userName} 
         /> 
  <div
    className="h-32 mb-4 
    
     bg-[url('https://arc-anglerfish-washpost-prod-washpost.s3.amazonaws.com/public/Z5QQMNJZGJDSVJFNHHR3QYNMCE.jpg')] bg-repeat-x bg-contain"
    >

    <div className="text-center
    w-96 mx-auto  h-32
    text-4xl text-yellow-300   bg-darkPurple
    font-semibold
    border-y-4 border-amber-300"
     style={{background: "hsla(260, 90%, 60%, 0.6)", backdropFilter: "blur(20px)"}}
     > 
      <span>Add a</span>
      <span 
      className="block"> Name </span>

    </div>
     

  </div>
 

      <div style={{width:"700px"}} className="mx-auto mt-4 ">
        {/* if not signed in, do not allow them to add names */}
      {(status !="authenticated")&&<div className="bg-red-800 p-2 text-white font-bold border-2 border-yellow-300 text-center"> To avoid spam, users must sign in to add names </div>}
        {/* if not signed in, allow them to add names */}
      {console.log(`this is session ${sessionFromServer}`)}
        
     <NewNameWithTagsData 
        tagList={tagList} 
        userId={userId} 
        sessionFromServer={sessionFromServer}
       />
        
        
        {/* <AddNewTag categoryList={categoryList}/> */}
        
   
   
      </div>
      </div>
    );
  }
  
  export default AddNewNameWithTags;
