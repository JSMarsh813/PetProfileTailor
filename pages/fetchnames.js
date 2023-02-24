import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon, FaceSmileIcon } from '@heroicons/react/20/solid'
import React, {useEffect, useState} from 'react'
import { useSession, getSession } from "next-auth/react"

import { toast } from 'react-toastify';
import Layout from '../components/NavBar/NavLayoutwithSettingsMenu'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faFaceGrinWink, faUserTie } from '@fortawesome/free-solid-svg-icons'
import '@fortawesome/fontawesome-svg-core/styles.css'
import usersId from './api/auth/updateLikes'
import { useForm } from 'react-hook-form';

import { authOptions } from "../pages/api/auth/[...nextauth]"
import { unstable_getServerSession } from "next-auth/next"

import GeneralButton from "../components/GeneralButton"
import NameListing from "../components/ShowingListOfContent/Namelisting"
import FilteringSidebar from '../components/Filtering/FilteringSidebar';
import PageTitleWithImages from '../components/ReusableSmallComponents/PageTitleWithImages';
import HeadersForNames from '../components/ShowingListOfContent/HeadersForNames';
import NameListingAsSections from '../components/ShowingListOfContent/NameListingAsSections';
      


export const getServerSideProps = async (context) => {

  const session = await unstable_getServerSession(context.req, context.res, authOptions)
 

    let response = await fetch('http://localhost:3000/api/namecategories');
    let data = await response.json()
    console.log(data)

    let nameResponse= await fetch('http://localhost:3000/api/names');   
    let nameData = await nameResponse.json()

      //grabbing Tags for name edit function

      let tagList = await fetch('http://localhost:3000/api/nametag');
      let tagData = await tagList.json()
      let tagListProp=tagData.map(tag=>tag.tag).reduce((sum,value)=>sum.concat(value),[])

    // console.log(data);
  //getServerSideProps allows us to fetch data from an api
  //runs only on server side, will never run clicent side
  //can run server-side code directly in getStaticProps
    return {
      props: {
        category: data,
        nameList: nameData,
        sessionFromServer: session,
        tagList:tagListProp,
           },
      }


    //and provide the data as props to the page by returning an object from the function
  }



export default function FetchNames(
  {category,nameList, pageProps, sessionFromServer,tagList}
  ) {

  
   //for Nav menu profile name and image
        //let section exists in case the user is not signed in
        let userName=""
        let profileImage=""
      
        if (sessionFromServer){
            userName=sessionFromServer.user.name
         profileImage=sessionFromServer.user.profileimage
       }
      //end of section for nav menu


      // useEffect(() => {
    //     const userId = localStorage.getItem("session") 
    //     console.log(userId);
    //     setUserId(userId)
    // }, [])
    // if clicked add to state, then find names with those tags who are true

          //  ################ sets up the toggle for the filter div #############################
    const[IsOpen,SetIsOpen] = useState(true)
         //if true, the className for the filter div will be "" (visible)
         //if false, the className for the filter div will be hidden
    
  
      //  const [checkedState, setCheckedState] = useState([new Array(category.length).fill([])]);
      // console.log(`namelist ${JSON.stringify(nameList)}`)
          const[tagFilters,setTagFiltersState] = useState([])
                    //array above is filled with tags
                    // ex ["christmas", "male"]

                    console.log(tagFilters)
          const[filterednames,setFilteredNames]=useState([...nameList])
                   //to begin with its filled with all names, not actually filtered yet
                        //  namelist console.log result: 
                        //  [

                        //   {"_id":"63abc7d5650d1659f0dd305e","name":"donner","description":[],"tags":["christmas","male"],"likedby":["63a90c2e83e6366b179ffc40","63ac0eb87795b89caaf760fe"],"__v":0},

                        //  {"_id":"63ae1671f202c8bf5752544f","name":"santa","description":[],"tags":["christmas","male"],"likedby":[],"__v":0},

                        //  {"_id":"63ae16a9f202c8bf57525455","name":"tataru","description":[],"tags":["female"],"likedby":[],"__v":0}
                        // ]
                  //  console.log(`filterednames ${JSON.stringify(filterednames)}`)
                   
                
                  //  (setFilteredNames(
                  //        filterednames.map((name)=>(tagFilters.every((tag)=>
                  //        name.tags.includes(tag))))
                  //      ))         
               
                  //  console.log(`filterednames later ${JSON.stringify(filterednames)}`)
   




          // const[checkedStatusOfTags,setCheckedTagsState] =useState([
          //   new Array(category[0].links.length).fill(false)
          // ])

          
                  //how do I added checked state for nested array
          const handleFilterChange = (e) => {

            

                const { value, checked } = e.target;
               
                //copy filteredNames then set it to an empty array, so we "delete" the previous names in the state
                
               
            
                setFilteredNames(nameList);

                    //every time we click, lets reset filteredNames to nameList aka its initial state. This way if we go backwards/unclick options, we'll regain the names we lost so future filtering is correct.
                         // aka round: 1, we click christmas and male. So we lost all female names since they had no male tag
                        //      round: 2, we unclick male
                                  //we need to reset the nameList, so that it will give us ALL christmas names
                                       // so reset the list with all the names
                                       // then the filter function in useEffect runs since the filteredtag array was changed

              
                // name.tags.includes(tag))))
 //We want ONE result for each name, so map through names
                  //names ex: beans, santa
                  //then we want to look through EVERY tag filter ONCE
                          //ex filters: Male and christmas
                              // does the name have all of these tags?
                                   //ex: beans has male, but not christmas. so it'd return false
                                  //while santa would return true so it's rendered
            
          
          // console.log(`${value} is ${checked}`);

          //if checked, it will add the new tag to the state/list. If not checked, it will filter it out and replace the state with the new tagfilter array
                
                (checked)?   
                setTagFiltersState([...tagFilters,value],):( 
                setTagFiltersState(tagFilters.filter((tag) => tag!=value)))
              // console.log(tagFilters)
                         
          }      
         
            // every time a new tag is added to the tagsFilter array, we want to filter the names and update the filteredNames state, so we have useEffect run every time tagFilters is changed 
          useEffect(()=>{
            let currenttags=tagFilters
            console.log(`this is currenttags ${JSON.stringify(currenttags)}`)
            //this is currenttags ["female","male"]
            setFilteredNames( filterednames.filter((name)=>
                      (currenttags.every((tag)=>
                      name.tags.includes(tag)))))
            //name.tags.includes(tag))
            console.log(`this is filterednames ${JSON.stringify(filterednames)}`)
            // console.log((`useEffect filterednames ${JSON.stringify(filterednames)}`))
        },[tagFilters]
          ) 
           
           
             //when checked, add name of checked checkbox to filters state array
      //  category.map((category,index)=>)

      //new Array(category[index].links.length).fill(false)
      // [false, false, false]
      // Array(category[0].links.length).fill(false)    
       // Array(category[1].links.length).fill(false)
        // Array(category[2].links.length).fill(false)
        // {[false,false,false],[false,true],[false,false,true]}
       
  //  let nameList = [
  //   {name:"santa",
  //   meaning:["a jolly man that gives presents"],
  //   tags:["Christmas","Male"]},

  //   {name:"beans",
  //   meaning:"Bean is a unisex name with a cute and quirky feel.",
  //   tags:["food","unisex"]},

  //   {name:"brittney spears",
  //   meaning:"A famous singer",
  //   tags:["celebrities","Female"] },

  //   {name:"Leon",
  //   meaning:["Lion in greek, ","A famous dominos fanatic and 100devs founder"],
  //   tags:["celebrities","greek","Male"] }
  // ]  
 


  return (
  <div className="bg-violet-900">

     <Layout 
        profileImage={profileImage} 
        userName={userName}  /> 

  <section className="px-4 bg-violet-900">

      <PageTitleWithImages
           imgSrc= "bg-[url('https://images.unsplash.com/photo-1514984879728-be0aff75a6e8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1084&q=80')]"
          title="Fetch"
          title2="Names"
       />
  
    <div className="flex w-full">
       
        
        {/* ###################### FILTER DIV ############################ */}

        <FilteringSidebar
                 category={category} 
                 handleFilterChange={handleFilterChange}
                 IsOpen={IsOpen}
                 />

            
      
                  {/*################# CONTENT DIV ################### */}

      <div className="grow bg-darkPurple rounded-box place-items-center">

                  {/* Button that toggles the filter div */}
        <GeneralButton                
               text={`${IsOpen?"Close Filters":"Open Filters"}`}
               onClick={()=>SetIsOpen(!IsOpen)}/>

  {/* ex 
                Bean : male*/}
        {/* <table className="min-w-full divide-y divide-gray-100 bg-darkPurple text-md ">

          
    <thead className="bg-purple-100">
      <tr className="w-full">
     
      <th
          className="whitespace-nowrap px-4 py-2 text-left font-medium text-purple-900 "
        >
          Like 
        </th>


        <th
          className="whitespace-nowrap px-4 py-2 text-left font-medium text-purple-900 "
        >
          Name
        </th>

        <th
          className="whitespace-nowrap px-4 py-2 text-left font-medium text-purple-900"
        >
          Meaning
        </th>

        <th
          className="whitespace-nowrap px-4 py-2 text-left font-medium text-purple-900"
        >
          tags
        </th>
       </tr>
    </thead>
     <tbody className=" text-violet-100 ">
    
        {filterednames.map((name)=>{
                 
                  return <NameListing key={name._id} name={name} session={sessionFromServer}/>
                    
            //         <tr key={`${name._id}Comments`} name={name} className="w-full"> 
            //         {name.description.slice(1).map((description)=>
            //                        <p className="w-full">{description}</p>)}
                    
            //  </tr>
                      
                  
                  // (<tr>
                  //  <button > "some text"
                  // <FontAwesomeIcon key={`${name._id}comments`} icon={faHeart} className="text-4xl text-yellow-300 pr-2" alt="a yellow comment icon, click on it to view comments" />
                  // </button>
                  // </tr>)

                }   

            )
            }

          
             </tbody>
        </table> */}



        <section className="border-2 border-amber-300 w-full"> 
                    
                    <HeadersForNames/>
                  
                       <section
                          className="max-h-96 overflow-scroll">
                           
                       {filterednames.map((name)=>{
                            return <NameListingAsSections
                            name={name}
                            key={name._id}
                            sessionFromServer={sessionFromServer}
                            tagList={tagList}
                            />
                          
                          }
                        
                          )}
                      </section>

                    </section>

      </div>

    </div>
    </section>
</div>
  )
}



// {nameList.map((name)=>( 
                    
//   //if the name does not have ALL those tags stored in the state, exclude it
//   // name: santa, with tags christmas, male
//   // tags in filter: christmas, female. So it'd be excluded
//  name.tags.some((element)=>
//  tagFilters.includes(element))&&
//  <div key={name.name}>{name.name}</div>)
