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


import NameListing from "../components/Namelisting"
import FilteringSidebar from '../components/Filtering/FilteringSidebar';

export const getServerSideProps = async (context) => {

  const session = await unstable_getServerSession(context.req, context.res, authOptions)
 

    let response = await fetch('http://localhost:3000/api/name-categories');
    let nameResponse= await fetch('http://localhost:3000/api/individualnames');
  
    let data = await response.json()
    let nameData = await nameResponse.json()

    // console.log(data);
  //getServerSideProps allows us to fetch data from an api
  //runs only on server side, will never run clicent side
  //can run server-side code directly in getStaticProps
    return {
      props: {
        category: data,
        nameList: nameData,
        sessionFromServer: session,
           },
      }


    //and provide the data as props to the page by returning an object from the function
  }



export default function Example({category,nameList, pageProps, sessionFromServer}) {
  
  let userName=""
  let profileImage=""

  if (sessionFromServer){
      userName=sessionFromServer.user.name
   profileImage=sessionFromServer.user.profileimage
 }


      // useEffect(() => {
    //     const userId = localStorage.getItem("session") 
    //     console.log(userId);
    //     setUserId(userId)
    // }, [])
    // if clicked add to state, then find names with those tags who are true

    // const name=target.name

  
      //  const [checkedState, setCheckedState] = useState([new Array(category.length).fill([])]);
      // console.log(`namelist ${JSON.stringify(nameList)}`)
          const[tagFilters,setFiltersState] = useState([])
                    //array above is filled with tags
                    // ex ["christmas", "male"]
          const[filterednames,setFilteredNames]=useState([...nameList])
                 
         

          const handleFilterChange = (e) => {

       
                const { value, checked } = e.target;

                //setFilteredNames is needed in here, so every time a change happens, we reload the list. So we can go back in time if we remove some of the tags we chose.
                setFilteredNames(nameList);     
                
                (checked)?   setFiltersState([...tagFilters,value],):( 
                setFiltersState(tagFilters.filter((tag) => tag!=value)))
                         
          }      
        
          useEffect(()=>{
            let currenttags=tagFilters
            
            setFilteredNames( filterednames.filter((name)=>
                      (currenttags.every((tag)=>
                                 name.tags.includes(tag)))))

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
  <div className="bg-violet-900 h-screen">

    <Layout 
        profileImage={profileImage} 
        userName={userName}  /> 

<section className="px-4 bg-violet-900">

  <div
    className="h-32 mb-4 bg-[url('https://images.unsplash.com/photo-1514984879728-be0aff75a6e8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1084&q=80')] bg-repeat-x bg-contain">

    <h3 className="text-center pt-2 w-screen text-5xl text-white"> Fetch Names </h3>
     

  </div>
{/* {    JSON.stringify(filterednames)} */}

  
    <div className="flex w-full h-screen ">
       
           {/* {console.log(`session in return ${pageProps}`)} */}
        {/* <span>{console.log(category.map((eachCategory,index)=>eachCategory.links.length))}</span>  */}
        <FilteringSidebar
                 category={category} 
                 handleFilterChange={handleFilterChange}/>

      <div className="h-screen grow bg-darkPurple rounded-box place-items-center">

  {/* ex 
                Bean : male*/}
        <table className="min-w-full divide-y divide-gray-100 bg-darkPurple text-md ">

          
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
                 
                  return <NameListing key={name._id} name={name}/>
                    
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
        </table>


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
