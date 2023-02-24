import React, {useState} from 'react'
import { authOptions } from "../pages/api/auth/[...nextauth]"
import { unstable_getServerSession } from "next-auth/next"
import axios from 'axios';

export const getServerSideProps = async (context) => {

    
  const session = await unstable_getServerSession(context.req, context.res, authOptions)


  return {
    props: {

      sessionFromServer:session,
                 },
    }
}

export default function AddCategory({sessionFromServer}) {
    
    const [newCategory,setNewCategory]=useState("")

    function handleCategorySubmission (e){ 
        e.preventDefault();
        //prevent buttons default behavior

        const categorySubmission= { 
            category: newCategory
        }
  
        axios.post("http://localhost:3000/api/namecategories", categorySubmission)
        .then(response => {
            console.log(response)})
        .catch(error => {
                console.log("this is error", error);})

    }


  return (
    <div>

        
<form onSubmit={handleCategorySubmission}>

<input 
                    type="text" 
                    id="categoryInput"
                    className="text-darkPurple"
                    // className={`${(!sessionFromServer)&&"bg-slate-400"}`} 
                    placeholder="enter a category to add" 
                    onChange={(e)=>setNewCategory(e.target.value.toLowerCase())}/>

                <button
                type="submit"
                 onClick={handleCategorySubmission}> 
                  Submit category
                </button>
 
</form>
    </div>
  )
}
