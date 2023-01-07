
import { Menu, Transition } from '@headlessui/react'
import { Fragment, useEffect, useRef, useState } from 'react'
import AddItemsDropDownMenu from './AddItemsDropDownMenu'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBullseye, faFaceGrinWink, faUserTie, faTags, faIgloo, faLightbulb, faIdCard, faBars } from '@fortawesome/free-solid-svg-icons'
import '@fortawesome/fontawesome-svg-core/styles.css'
import Link from 'next/Link'


// https://headlessui.com/react/menu

const NavBarNames = ({}) => {




//!!!!!!! TURN INTO HAMBURGER AT SPECIFIC SIZES !!!!!!//
    return (
<div className="divWhichHasBothMenus">



{/* DESKTOP MENU */}

<section className="hidden md:flex desktop-menu ">



<Menu as="div" className="inline-block text-left">
<Link href="/">
  
<Menu.Button className="inline-flex px-4 py-2 text-sm font-medium text-white 

border-4 border-transparent border-r-violet-400 

hover:bg-opacity-30 
hover:border-b-4
hover:border-b-yellow-400 

focus:outline-none 
focus-visible:ring-2 
focus-visible:ring-white 
focus-visible:ring-opacity-75">

<FontAwesomeIcon icon={faIgloo} 
        className="text-xl mr-1 text-violet-100"/>
   
         <a>Home</a>
      
  </Menu.Button>
  </Link>

  </Menu>

  <Menu as="div" className="relative inline-block text-left">

  <Link href="/fetchnames">
<Menu.Button className="inline-flex px-4 py-2 text-sm font-medium text-white 

border-4 border-transparent border-r-violet-400 

hover:bg-opacity-30 
hover:border-b-4
hover:border-b-yellow-400 

focus:outline-none 
focus-visible:ring-2 
focus-visible:ring-white 
focus-visible:ring-opacity-75">
      <FontAwesomeIcon icon={faTags} className="text-xl mr-2 text-violet-100"/>

        
         <a>Fetch Names</a>
        
  </Menu.Button>
  </Link>

  </Menu>
 
  <Menu as="div" className="relative inline-block text-left">
 
  <Link href="/fetchdescriptions">
<Menu.Button className="inline-flex px-4 py-2 text-sm font-medium text-white 

border-4 border-transparent border-r-violet-400 

hover:bg-opacity-30 
hover:border-b-4
hover:border-b-yellow-400 

focus:outline-none 
focus-visible:ring-2 
focus-visible:ring-white 
focus-visible:ring-opacity-75">
<FontAwesomeIcon icon={faIdCard} className="text-xl mr-1 text-violet-100"/>
        <a> Fetch Descriptions</a>
  </Menu.Button>
  </Link>

  </Menu>

  <AddItemsDropDownMenu/>
</section>


     
   
  </div>

    )


}

export default NavBarNames