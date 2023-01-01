import { Menu, Transition } from '@headlessui/react'
import { Fragment, useEffect, useRef, useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBullseye, faFaceGrinWink, faUserTie, faTags, faLightbulb, faIdCard, faCirclePlus} from '@fortawesome/free-solid-svg-icons'
import '@fortawesome/fontawesome-svg-core/styles.css'
import Link from 'next/Link'
import DropDownLink from "../DropDownLink"

export default function DropDownMenu() {
  return (
  
      <Menu as="div" className="relative inline-block text-left z-10">
        <div>
          <Menu.Button className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white
          
          border-4 border-transparent border-r-violet-400 

          hover:bg-opacity-30 
          hover:border-b-4
          hover:border-b-yellow-400 

          focus:outline-none 
          focus-visible:ring-2 
          focus-visible:ring-white 
          focus-visible:ring-opacity-75">


<FontAwesomeIcon icon={faCirclePlus} className="text-xl mr-2 text-violet-200"/>

            Add
            <ChevronDownIcon
              className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100"
              aria-hidden="true"
            />
          </Menu.Button>
        </div>
      
          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-violet-800 shadow-lg ring-1 ring-black ring-opacity-5 
          
          focus:outline-none">
            <div className="px-1 py-1 ">
              <Menu.Item>
              
                   <Link href="/addnames">

                  <button
                    className="
                      hover:bg-yellow-500 
                      hover:text-violet-900

                      text-white             
                      group flex w-full items-center rounded-md px-2 py-2 text-sm"
                  >
                                         
                      <FontAwesomeIcon icon={faTags} 
                       className="text-xl mr-1 
                      text-violet-100
                     "
                   />
                 
                       <a> Names</a>
                 

                     </button>

                  </Link>
              
              </Menu.Item>


              <Menu.Item>
              
                   <Link href="/adddescriptions">
                   <button
                    className="
                      hover:bg-yellow-500 
                      hover:text-violet-900

                      text-white             
                      group flex w-full items-center rounded-md px-2 py-2 text-sm"
                  >

                   <FontAwesomeIcon icon={faIdCard}
                    className="text-xl mr-1 
                      text-violet-100
                     "
                   />
                    
                   <a> Descriptions </a>
                   
                  </button>
                  </Link>

              
              </Menu.Item>
            </div>
            <div className="px-1 py-1">
              <Menu.Item>
              
                  <Link href="/addinspiration">
                  <button
                    className="
                      hover:bg-yellow-500 
                      hover:text-violet-900

                      text-white             
                      group flex w-full items-center rounded-md px-2 py-2 text-sm"
                  >

                  
                   <FontAwesomeIcon icon={faLightbulb}   className="text-xl mr-1 
                      text-violet-100
                     "/>
                        
              <a>Inspiration Fuel</a> 
            
                  </button>
                  </Link>
         
              </Menu.Item>
              
            </div>
          </Menu.Items>
       
      </Menu>
    
  )
}

