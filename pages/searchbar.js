import Select from 'react-select';
import React, { useState } from 'react';
import axios from 'axios'
import NewNameWithTagsData from '../components/AddingNewData/addingName'
//another serverSide props from  let categoryList = await fetch('http://localhost:3000/api/name-categories);
import AddNewTag from '../components/AddingNewData/AddingNewTag'

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
  
     return (
      <div style={{width:"700px"}} className="mx-auto mt-4">

        <NewNameWithTagsData tagList={tagList}/>
        {/* <AddNewTag categoryList={categoryList}/> */}
        
   
   
      </div>
    );
  }
  
  export default AddNewNameWithTags;
