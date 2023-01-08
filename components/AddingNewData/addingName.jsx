import Select from 'react-select';
import React, { useState,useEffect } from 'react';
import { useSession } from "next-auth/react"
import axios from 'axios'
// import User from '../../models/User';

import { toast, ToastContainer } from 'react-toastify';


//another serverSide props from  let categoryList = await fetch('http://localhost:3000/api/name-categories);

  
function NewNameWithTagsData({tagList,userId}) {
  const { data: session, status } = useSession()
  
  
    const [newName,setNewName] =useState("");
    const [tags,setTags]=useState([]);
    // const [description,setDescription]=useState([]);
    const [isPending,setIsPending]=useState(false);
    const [nameAlreadyExists,setNameExists]=useState(false);
    const [description, setDescription] =useState("")
   


    // useEffect(() => {
    //   if (session?.user) 
    //       {setUserId(session.user._id.toString(""))}
      
    // }, [session]);

    // console.log(`This is session${userId}`)
   function handleNameSubmission (e){
    
        e.preventDefault();
         //prevent buttons default behavior

         setIsPending(true);

    const nameSubmission= {
     name: newName, 
     description: description,
     tags: tags,
     createdby: userId.toString(),
   }
    //  addedBy: userId,
          //from state

        // #######if the collection does not have the name, do this (allow post):  ..... otherwise update setNameExists to true
          axios.post("http://localhost:3000/api/individualnames", nameSubmission).then(response => {
            console.log(response)
            setIsPending(false);
            toast.success(`Successfully added name: ${newName}`)
            
          }).catch(error => {
            console.log("this is error", error);
            setNameExists(true)
            setIsPending(false)
            toast.error(`Ruh Roh! ${newName} not added`)
            
          });


    // fetch('http://localhost:3000/api/individualTags', {
    //   method: 'POST',
    //   headers: {"Content-type": "application/json"},
    //   body: JSON.stringify(nameSubmission)
    // }).then(()=>{
    //   console.log(`New Name added: ${nameSubmission}`)
    //   setIsPending(false)
    //     //when the request is done, by changing setIsPending to false we change the rendered button from the disabled one, to the one that allows submissions 
    // }).catch((error)=>{
    //     console.log(`There was an error ${nameSubmission}`,error)
    // });

    //Error handling
       // only allow submission if NAME and TAGS are filled out, aka state isn't blank. Make button deactivated until this happens
            // (newName!=""&&tags!=[])              
           
       //if error happens, send error

    //don't allow duplicate names
       //if name exists already, send error
            //map through server, does it include the name? if so reject and send error message
    
    //submit to server
       //add name to individual Names collection,submit state to server in correct format

    }
    
    return (
      <div style={{width:"700px"}} className="mx-auto mt-4">
        {/* {console.log(tagList[0].individualTag)} */}
     
    
    
       <section className="mt-10 mb-16">
                <h1 className="text-3xl text-white"> Add a Name! </h1> 
              
                <p> Add a name with one or more tags that apply to it. </p>
                <h6 className="mt-4"> Example: A dog named batman </h6>
                <img className="w-52 mb-4"src="https://i.pinimg.com/originals/19/44/92/194492b23b8f04d3e624eb7b6148c1be.jpg" alt="React Image" />
                <p>Batman could have the tags: comics, superheroes, batman, male, edgy</p>


              <form onSubmit={handleNameSubmission}>
                {/* needs label and value for Select to work  */}
                <input type="text" className="text-darkPurple" 
                    placeholder="enter a name to add" 
                    onChange={(e)=>setNewName(e.target.value.toLowerCase())}
                    onClick={(e)=>setNameExists(false)}
                                       
                    ></input>
                    {nameAlreadyExists==true &&      
                 <p 
                    className="text-red-500 font-bold"> 
                    Name already exists 
                    </p>}

                    {/* setDescription */}
                    <textarea type="text" className="text-darkPurple block w-full mt-4" 
                    placeholder="optional description: please add anything that would be useful to know. Examples: the name's meaning, popular fictional or historical figures with this name, ect" 
                    onChange={(e)=>setDescription(e.target.value.trim())}>
                    </textarea>


                  <p className="mt-4">If you type in the tags field, it will filter the tags.</p>


                <Select 
                  className="text-darkPurple"
                
                  options={tagList.map((opt,index) => ({
                     label: opt.individualTag, value: opt.individualTag,
                   }))}
                 
                  isMulti
                  isSearchable
                  placeholder="select tags..."
                  onChange={(opt) => setTags(opt.map(tag=>tag.label))}

                  //update STATE of section of object
                />

                {!isPending&&<button className="
                mt-4
                 bg-yellow-300 text-violet-800 
                font-bold py-2 px-4 border-b-4     border-yellow-100

                 hover:bg-blue-400 
                 hover:text-white 
                hover:border-blue-500 rounded"

                onClick={handleNameSubmission}> Add name </button>}
                {isPending&&<button className="btn" disabled> Adding name ... </button>}
            

                {/* <input type="hidden" id="userId" name="userId" value={session.user._id} /> */}
                </form>
         </section>

      </div>
    );
  }
  
  export default NewNameWithTagsData;
