import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon, FaceSmileIcon } from '@heroicons/react/20/solid'
import React, {useEffect, useState} from 'react'



function FilteringSidebar({category, handleFilterChange,IsOpen}) {
  

  return (
    <div className={`w-80 h-fit bg-violet-900 border-b-2 border-solid border-violet-400 rounded-box place-items-center ${IsOpen?"":"hidden"}`}>
    {/* mapping through categories ex: gender, holidays */}
            {category.map((category,index)=>{return (
            
           <Disclosure 
                key={category._id} 
            
                >
{/* defaultOpen will have the disclosure stay open*/}
             {({ open }) => (
               <>

        {/* Category Name shows here ("species", "food") */}
                 <Disclosure.Button className="flex w-full justify-between rounded-lg rounded-r-none border-t-2 border-violet-300 bg-purple-100 px-4 py-2 text-left text-base font-medium text-purple-900 
                 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75 ">
                   <span>{category.category} </span>
                   <ChevronUpIcon
                     className={`${
                       open ? 'rotate-180 transform' : ''
                     } h-5 w-5 text-purple-500`}
                   />
                 </Disclosure.Button>
                 
                 <Disclosure.Panel 
                 
                  className="px-4 pt-4 pb-2 text-sm text-gray-500">
                  
                     <div className="space-y-6 ">
   
   {/* mapping through category options and assigning them a button (ex: male, female, unisex)*/}
   
                     {category.tags.map((option,index)=>
                    
                     ( <div key={option._id} className="flex items-center hover:bg-violet-700">
               {/* adds a checkbox*/}
                     <input
                                         id={`filter-mobile-${index}`}
                                         name={`${option.tag}[]`}
                                         value={option.tag}
                                         type="checkbox"
                                         // checked={checkedStatusOfTags} 
                                         onChange={handleFilterChange}
                                         // onChange={() => handleOnChange(index)}
                                         className="h-4 w-4 rounded border-violet-300 text-amber-300 focus:ring-amber-600 "
                                       />
                                      
              {/* shows the actual description (male, female, unisex ect for gender) */}
                      <label
                                         htmlFor={`filter-mobile-${option.tag}-${option.tag}`}
                                         className="ml-3 min-w-0 flex-1 text-base text-violet-100 "
                                       >
                                         {option.tag}
                                         {console.log(option)}
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
  )
}

export default FilteringSidebar