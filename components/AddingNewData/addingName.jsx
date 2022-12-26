import Select from 'react-select';
import React, { useState } from 'react';
import axios from 'axios'
// import User from '../../models/User';

//another serverSide props from  let categoryList = await fetch('http://localhost:3000/api/name-categories);

  
function NewNameWithTagsData({tagList}) {
  
    
    const [newName,setNewName] =useState("");
    const [tags,setTags]=useState([]);
    const [isPending,setIsPending]=useState(false);
    const [nameAlreadyExists,setNameExists]=useState(false);
    // const [userId,setUserId]=useState("")

   function handleNameSubmission (e){
    
        e.preventDefault();
         //prevent buttons default behavior

         setIsPending(true);

    const nameSubmission= {
     name: newName, 
     tags: tags,
   }
    //  addedBy: userId,
          //from state

        // #######if the collection does not have the name, do this (allow post):  ..... otherwise update setNameExists to true
          axios.post("http://localhost:3000/api/individualnames", nameSubmission).then(response => {
            console.log(response)
            setIsPending(false);
          }).catch(error => {
            console.log("this is error", error);
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
                <h1 className="text-xl text-white"> Add a name! </h1> 
              
                <p> Add a name with one or more tags that apply to it. </p>
                <h6> Example: A dog named batman </h6>
                <img className="w-52"src="https://i.pinimg.com/originals/19/44/92/194492b23b8f04d3e624eb7b6148c1be.jpg" alt="React Image" />
                <p>Batman could have the tags: comics, superheroes, batman, male, edgy</p>


              <form onSubmit={handleNameSubmission}>
                {/* needs label and value for Select to work  */}
                <input type="text" 
                    placeholder="enter a name to add" 
                    onChange={(e)=>setNewName(e.target.value.toLowerCase())}
                    onClick={(e)=>setNameExists(false)}
                                       
                    ></input>
                    {nameAlreadyExists==true && <p className="text-red-600"> Name already exists </p>}
                  <p>If you type in the tags field, it will filter the tags.</p>


                <Select 
                  options={tagList.map((opt,index) => ({ label: opt.individualTag, value: opt.individualTag}))}
                  isMulti
                  isSearchable
                  placeholder="select tags..."
                  onChange={(opt) => setTags(opt.map(tag=>tag.label))}

                  //update STATE of section of object
                />

                {!isPending&&<button className="btn" onClick={handleNameSubmission}> Add name </button>}
                {isPending&&<button className="btn" disabled> Adding name ... </button>}
            

                {/* <input type="hidden" id="userId" name="userId" value={session} /> */}
                </form>
         </section>

      </div>
    );
  }
  
  export default NewNameWithTagsData;
