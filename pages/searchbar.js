import Select from 'react-select';
import React, { useState } from 'react';
import axios from 'axios'
import NewNameWithTagsData from '../components/AddingNewData/addingName'
//another serverSide props from  let categoryList = await fetch('http://localhost:3000/api/name-categories);
import AddNewTag from '../components/AddingNewData/AddingNewTag'
import { useSession } from "next-auth/react"

export const getServerSideProps = async () => {

    let tagList = await fetch('http://localhost:3000/api/individualtags');
    let categoryList = await fetch('http://localhost:3000/api/name-categories');
  
        let tagData = await tagList.json()
        let categoryData = await categoryList.json()


    return {
      props: {
        tagList: tagData,
        categoryList: categoryData
                   },
      }
    //and provide the data as props to the page by returning an object from the function
  }


  
function AddNewNameWithTags({tagList,categoryList}) {
  const { data: session, status } = useSession()

  console.log(status)
  console.log(session)

     return (     

  

      <div style={{width:"700px"}} className="mx-auto mt-4">
        {/* if not signed in, do not allow them to add names */}
      {(status !="authenticated")&&<div> To avoid spam, we ask users to sign in to add names </div>}
        {/* if not signed in, allow them to add names */}
      
       {(status === "authenticated") &&
      <p>Signed in as {session.user.name}</p>}
            <NewNameWithTagsData tagList={tagList}/>
        {/* <AddNewTag categoryList={categoryList}/> */}
        
   
   
      </div>
    );
  }
  
  export default AddNewNameWithTags;
