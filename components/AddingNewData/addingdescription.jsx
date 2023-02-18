import Select from 'react-select';
import React, { useState,useEffect } from 'react';
import { useSession } from "next-auth/react"
import axios from 'axios'
// import User from '../../models/User';

import { toast, ToastContainer } from 'react-toastify';


//another serverSide props from  let categoryList = await fetch('http://localhost:3000/api/name-categories);

  
function NewDescriptionWithTagsData({tagList,userId, sessionFromServer}) {


  const { data: session, status } = useSession()
  
  
    const [newDescription,setNewDescription] =useState("");
    const [tags,setTags]=useState([]);
    const [notes,setNotes]=useState("")
    // const [description,setDescription]=useState([]);
    const [isPending,setIsPending]=useState(false);
    const [descriptionAlreadyExists,setDescriptionExists]=useState(false);
    const [description, setDescription] =useState("")
   
   
    // useEffect(() => {
    //   if (session?.user) 
    //       {setUserId(session.user._id.toString(""))}
      
    // }, [session]);

    // console.log(`This is session${userId}`)
   function handleDescriptionSubmission (e){
    
    
        e.preventDefault();
         //prevent buttons default behavior

         setIsPending(true);

    const descriptionSubmission= {
     description: newDescription, 
     tags: tags,
     notes: notes,
     createdby: userId.toString(),
   }
    //  addedBy: userId,
          //from state

        // #######if the collection does not have the name, do this (allow post):  ..... otherwise update setNameExists to true
          axios.post("http://localhost:3000/api/description", descriptionSubmission).then(response => {
            console.log(response)
            setIsPending(false);
            toast.success(`Successfully added description: ${newDescription}. Heres 5 treat points as thanks for your contribution ${sessionFromServer.user.name}!`)
            
          }).catch(error => {
            console.log("this is error", error);
            setDescriptionExists(true)
            setIsPending(false)
            toast.error(`Ruh Roh! ${newDescription} not added`)
            
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
      <div style={{width:"700px"}} className="mx-auto">
        {/* {console.log(tagList[0].individualTag)} */}
     
    {console.log(tagList)}
    
       <section className="my-6">
                       
                <p> Add a description with one or more tags. </p>
               
                <h6 
                className="mt-4 ml-4"> Example: A dog named batman </h6>
                <img 
                className="w-52 ml-6
                mb-4"src="https://i.pinimg.com/originals/19/44/92/194492b23b8f04d3e624eb7b6148c1be.jpg" alt="React Image" />
                <p
                className="ml-6">Batman could have the tags: comics, superheroes, batman, male, edgy</p>


              <form onSubmit={handleDescriptionSubmission}>
                {/* needs label and value for Select to work  */}

                <label 
                    className="font-bold block mt-4"
                    htmlFor="descriptionInput">
                        New Description</label>

                <textarea 
                      type="text" 
                      id="nameDescription"
                      className="text-darkPurple block w-full" 
                   
                    placeholder="enter a description to add" 

                    onChange={(e)=>setNewDescription(e.target.value.toLowerCase())}

                    disabled={sessionFromServer?"":"disabled"}

                    onClick={(e)=>setDescriptionExists(false)}
                                       
                    ></textarea>
                    {descriptionAlreadyExists==true &&      
                 <p 
                    className="text-red-500 font-bold"> 
                    Description already exists 
                    </p>}       

                    
                    {/* NOTES SECTION           */}

                    <label 
                    className="font-bold block mt-4"
                    htmlFor="notesinput">
                        Notes</label>

                <textarea 
                      type="text" 
                      id="noteinput"
                      className="text-darkPurple block w-full" 
                   
                    placeholder="(Optional) enter any notes to add. For example, explaining if it has any references to shows/popular culture, ect." 

                    onChange={(e)=>setNotes(e.target.value.toLowerCase())}

                    disabled={sessionFromServer?"":"disabled"}
                                       
                    ></textarea>

         {/* TAGS SECTION */}
                  <label 
                    className="font-bold block mt-4"
                    htmlFor="descriptionTags">Tags</label>
                  <Select 
                  className="text-darkPurple mb-4"
                  id="descriptionTags"
                  options={tagList.map((opt,index) => ({
                     label: opt, value: opt,
                   }))}
                 
                  isMulti
                  isSearchable
                  placeholder="If you type in the tags field, it will filter the tags"
                  onChange={(opt) => setTags(opt.map(tag=>tag.label))}

                  //update STATE of section of object
                />
           
                    {/* BUTTON */}

                {!isPending&&<button className={`font-bold py-2 px-4 border-b-4 mt-2 rounded     

                ${sessionFromServer?"mt-4 bg-yellow-300 text-violet-800 border-yellow-100                         hover:bg-blue-400                       hover:text-white                     hover:border-blue-500" :
                
                "bg-slate-800"}`
                
                 }
                

                disabled={sessionFromServer?"":"disabled"}
                onClick={handleDescriptionSubmission}> 
                Add description {!sessionFromServer&&"(disabled)"}
                 </button>}


                {isPending&&<button className="btn" disabled> Adding description ... </button>}
            
                {!sessionFromServer&&
                <span
                 className="mt-4 bg-red-800 p-2 text-white font-bold border-2 border-yellow-300 block text-center">
                 Please sign in to submit a description </span>
                 }

                {/* <input type="hidden" id="userId" name="userId" value={session.user._id} /> */}
                </form>
         </section>

      </div>
    );
  }
  
  export default NewDescriptionWithTagsData;
