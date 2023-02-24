import React from 'react'
import { Dialog, Disclosure, Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon, FunnelIcon, MinusIcon, PlusIcon, Squares2X2Icon } from '@heroicons/react/20/solid'
import nameCategory from "../models/nameCategory"
// https://headlessui.com/react/disclosure 


const filters = [
    {
      id: 'gender',
      name: 'gender',
      options: [
        { value: 'white', label: 'White', checked: false },
        { value: 'beige', label: 'Beige', checked: false },
        { value: 'blue', label: 'Blue', checked: true },
        { value: 'brown', label: 'Brown', checked: false },
        { value: 'green', label: 'Green', checked: false },
        { value: 'purple', label: 'Purple', checked: false },
      ],
    },
    {
      id: 'holiday',
      name: 'holiday',
      options: [
        { value: 'new-arrivals', label: 'New Arrivals', checked: false },
        { value: 'sale', label: 'Sale', checked: false },
        { value: 'travel', label: 'Travel', checked: true },
        { value: 'organization', label: 'Organization', checked: false },
        { value: 'accessories', label: 'Accessories', checked: false },
      ],
    },
    {
      id: 'famousCharacters',
      name: 'famousCharacters',
      options: [
        { value: '2l', label: '2L', checked: false },
        { value: '6l', label: '6L', checked: false },
        { value: '12l', label: '12L', checked: false },
        { value: '18l', label: '18L', checked: false },
        { value: '20l', label: '20L', checked: false },
        { value: '40l', label: '40L', checked: true },
      ],
    },
  ]

  

//  function NewCategory({test5}) {
//   return (
//     <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">

//               {/* Filters */}
//               <form className="hidden lg:block">
            
//                 {filters.map((section) => (
//                   <Disclosure as="div" key={section.id} className="border-b border-gray-200 py-6">
//                     {({ open }) => (
//                       <>
//                         <h3 className="-my-3 flow-root">
//                           <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
//                             <span className="font-medium text-gray-900">{section.name}</span>
//                             <span className="ml-6 flex items-center">
//                               {open ? (
//                                 <MinusIcon className="h-5 w-5" aria-hidden="true" />
//                               ) : (
//                                 <PlusIcon className="h-5 w-5" aria-hidden="true" />
//                               )}
//                             </span>
//                           </Disclosure.Button>
//                         </h3>
//                         <Disclosure.Panel className="pt-6">
//                           <div className="space-y-4">

//                             {section.options.map((option, optionIdx) => (
//                               <div key={option.value} className="flex items-center">
//                                 <input
//                                   id={`filter-${section.id}-${optionIdx}`}
//                                   name={`${section.id}[]`}
//                                   defaultValue={option.value}
//                                   type="checkbox"
//                                   defaultChecked={option.checked}
//                                   className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
//                                 />
//                                 <label
//                                   htmlFor={`filter-${section.id}-${optionIdx}`}
//                                   className="ml-3 text-sm text-gray-600"
//                                 >
//                                   {option.label}
//                                 </label>
//                               </div>
//                             ))}
//                           </div>
//                         </Disclosure.Panel>
//                       </>
//                     )}
//                   </Disclosure>
//                 ))}
//               </form>

//               {/* Product grid */}
//               <div className="lg:col-span-3">
//                 {/* Replace with your content */}
//                 <div className="h-96 rounded-lg border-4 border-dashed border-gray-200 lg:h-full" />
//                 {/* /End replace */}
//               </div>
//             </div>
//   )
// }
// export default NewCategory

//doesn't work
function NewCategory({category}) {
 return (
    <div> test
        {
    category.map(category=>{
     return (
        <Disclosure>
                 <Disclosure.Button className="py-2" key={category._id}>
                    Is team pricing available?   
                    {category._id}{category.name}
                  </Disclosure.Button>

                 <Disclosure.Panel className="text-gray-100">
                   NOOO 
                </Disclosure.Panel>
      </Disclosure>
          )
        })
    }
    </div>
        )
}
export default NewCategory



export const getStaticProps = async () => {

    let response = await fetch('http://localhost:3000/api/namecategories');
  
    let data = await response.json()
    // console.log(data);
  //getServerSideProps allows us to fetch data from an api
  //runs only on server side, will never run clicent side
  //can run server-side code directly in getStaticProps
    return {
      props: {
        category: data,
           },
      }
    //and provide the data as props to the page by returning an object from the function
  }