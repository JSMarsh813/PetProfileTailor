import React from 'react'
import axios from "axios";
import NewCategory from "../components/NewCategory"

//works
function TestingDatabase({category}) {
  return (
    <div>testingdatabase
    {
      
      category.map(category=>{
        return (
          <div key={category._id}>
               <h2>
                  {category._id}{category.name}
               </h2>
            </div>
        )
      })
    }
        
     
    </div>
    
  )
}

export default TestingDatabase


export const getStaticProps = async () => {

  let response = await fetch('http://localhost:3000/api/name-categories');

  let data = await response.json()
  console.log(data);
//getServerSideProps allows us to fetch data from an api
//runs only on server side, will never run clicent side
//can run server-side code directly in getStaticProps
  return {
    props: {
      category: data,
         },
    }
  //and provide the data as props to the page by reeturning an object from the function
}