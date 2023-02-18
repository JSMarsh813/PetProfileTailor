import React, {useState} from 'react'
import { authOptions } from "./api/auth/[...nextauth]"
import { unstable_getServerSession } from "next-auth/next"
import axios from 'axios'

export const getServerSideProps = async (context) => {

    
  const session = await unstable_getServerSession(context.req, context.res, authOptions)


  return {
    props: {

      sessionFromServer:session,
                 },
    }
}

export default function AddNameTag({sessionFromServer}) {
    
    const [newNameTag,setNewNameTag]=useState("")
    function handleNameTagSubmission (e){ 
        e.preventDefault();
        //prevent buttons default behavior

        const nameTagSubmission= { 
          nameTag: newNameTag,
        }

        console.log(nameTagSubmission)

        axios.post("http://localhost:3000/api/nametag", nameTagSubmission)
        .then(response => {
            console.log(response)})
        .catch(error => {
                console.log("this is error", error);})

    }


  return (
    <div>

        
<form onSubmit={handleNameTagSubmission}>

<input 
                    type="text" 
                    id="categoryInput"
                    className="text-darkPurple"
                    // className={`${(!sessionFromServer)&&"bg-slate-400"}`} 
                    placeholder="enter a name tag to add" 
                    onChange={(e)=>setNewNameTag(e.target.value.toLowerCase())}/>

                <button
                type="submit"
                 onClick={handleNameTagSubmission}> 
                  Submit category
                </button>
 
</form>
    </div>
  )
}
