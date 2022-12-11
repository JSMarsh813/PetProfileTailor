import Select from 'react-select';
import React, { useState } from 'react';


export const getServerSideProps = async () => {

    let tagList = await fetch('http://localhost:3000/api/individualTags');
  
    let tagData = await tagList.json()

    return {
      props: {
        tagList: tagData,
           },
      }
    //and provide the data as props to the page by returning an object from the function
  }


  
  function AddNewNameWithTags({tagList}) {

    const [newName,setNewName] =useState("")
    const [tags,setTags]=useState([])

   function handleNameSubmission ({newName,tags}){
    
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
        {console.log(`name: ${newName} tags: ${tags}`)}
      
       <section className="mt-10 mb-16">
                <h1 className="text-xl text-white"> Add a name! </h1> 
              
                <p> Add a name with one or more tags that apply to it. </p>
                <h6> Example: A dog named batman </h6>
                <img className="w-52"src="https://i.pinimg.com/originals/19/44/92/194492b23b8f04d3e624eb7b6148c1be.jpg" alt="React Image" />
                <p>Batman could have the tags: comics, superheroes, batman, male, edgy</p>
              <form>
                {/* needs label and value for Select to work  */}
                <input type="text" 
                    placeholder="enter a name to add" 
                    onChange={(e)=>setNewName(e.target.value.toLowerCase())}></input>
                  <p>If you type in the tags field, it will filter the tags.</p>
                <Select 
                  options={tagList.map((opt,index) => ({ label: opt.individualTag, value: opt.individualTag}))}
                  isMulti
                  isSearchable
                  placeholder="select tags..."
                  onChange={(opt) => setTags(opt.map(tag=>tag.label))}

                  //update STATE of section of object
                />

                <button className="btn" onClick={handleNameSubmission}> Add name </button>
            
                </form>
         </section>

        <section>

            <h4 className="text-xl text-white"> Can't find the tag you need?</h4> 
            <p className="text-white">Click here to add the tag to our database </p>

            <form>
              <input type="text" placeholder="*required enter a single tag"></input>
              <p> For example, the superhero tag can be under the "popular culture" and "fiction" categories. </p>
              <p> If a suitable category is not available, select the "other" category</p>
              <Select 
          options={tagList.map((opt,index) => ({ label: opt.individualTag, value: opt.individualTag}))}
          isMulti
          isSearchable
          placeholder="Add a category/categories"
                  //other is default
        />
            <button className="btn"> Add Tag here </button>
            </form>
           

        </section>
      </div>
    );
  }
  
  export default AddNewNameWithTags;
