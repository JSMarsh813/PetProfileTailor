import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon, FaceSmileIcon } from '@heroicons/react/20/solid'
import React, {useState} from 'react'

export const getStaticProps = async () => {

    let response = await fetch('http://localhost:3000/api/name-categories');
    let nameResponse= await fetch('http://localhost:3000/api/individualNames');
  
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
           },
      }


    //and provide the data as props to the page by returning an object from the function
  }


export default function Example({category,nameList}) {

    // if clicked add to state, then find names with those tags who are true

    // const name=target.name

 
      //  const [checkedState, setCheckedState] = useState([new Array(category.length).fill([])]);
          const[tagFilters,setFiltersState] = useState([])
                    //array above is filled with tags


          // const[checkedStatusOfTags,setCheckedTagsState] =useState([
          //   new Array(category[0].links.length).fill(false)
          // ])

          
                  //how do I added checked state for nested array
          const handleChange = (e) => {

                const { value, checked } = e.target;
          
          //  console.log(`${value} is ${checked}`);

          //if checked, it will add the new tag to the state/list. If not checked, it will filter it out and replace the state with the new tagfilter array
                (checked)? setFiltersState([...tagFilters,value],):( 
                setFiltersState(tagFilters.filter((tag) => tag!=value)))             
          }

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
   
    <div className="flex w-full ">
     

        {/* <span>{console.log(category.map((eachCategory,index)=>eachCategory.links.length))}</span>  */}
        <div className="w-80 h-screen bg-violet-900  rounded-box place-items-center ">
 {/* mapping through categories ex: gender, holidays */}
         {category.map((category,index)=>{return (
        <Disclosure key={category._id}>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between rounded-lg bg-purple-100 px-4 py-2 text-left text-base font-medium text-purple-900 
              hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75 ">
                <span>{category.name} </span>
                <ChevronUpIcon
                  className={`${
                    open ? 'rotate-180 transform' : ''
                  } h-5 w-5 text-purple-500`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                  <div className="space-y-6 ">

{/* mapping through links array (so ex: male, female, unisex)*/}

                  {category.links.map((option,index)=>
                  ( <div key={option} className="flex items-center hover:bg-violet-700">
            {/* adds a checkbox*/}
                  <input
                                      id={`filter-mobile-${index}`}
                                      name={`${option}[]`}
                                      value={option}
                                      type="checkbox"
                                      // checked={checkedStatusOfTags} 
                                      onChange={handleChange}
                                      // onChange={() => handleOnChange(index)}
                                      className="h-4 w-4 rounded border-violet-300 text-amber-300 focus:ring-amber-600 "
                                    />
           {/* shows the actual description (male, female, unisex ect for gender) */}
                   <label
                                      htmlFor={`filter-mobile-${option}-${option}`}
                                      className="ml-3 min-w-0 flex-1 text-base text-violet-100 "
                                    >
                                      {option}
                                    </label>
                  
                  </div>)
                  )} 

                  </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
         )
})}
      
        
      </div>

      <div className="h-screen grow bg-darkPurple rounded-box place-items-center">

  {/* ex 
                Bean : male*/}
        <table className="min-w-full divide-y divide-gray-100 text-md">

          
    <thead className="bg-purple-100">
      <tr>
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
                {nameList.map((name)=>( 
                    
                       //We want ONE result for each name, so map through names
                             //names ex: beans, santa
                             //then we want to look through EVERY tag filter ONCE
                                     //ex filters: Male and christmas
                                         // does the name have all of these tags?
                                              //ex: beans has male, but not christmas. so it'd return false
                                             //while santa would return true so it's rendered

                       tagFilters.every((tag)=>
                       name.tags.includes(tag))&&
                      <tr key={name.name} >

                        <td className="text-purple-200 border-b-2 border-amber-300 px-4 py-2 text-left font-black">{name.name}</td>

                        <td className="border-b-2 border-amber-200 px-4 py-2 text-left font-medium">{name.description}</td>

                        <td className="border-b-2 border-amber-100 px-4 py-2 text-left font-medium">{name.tags}</td>
                      </tr>)

          


                   
              )}
             </tbody>
        </table>


      </div>

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
