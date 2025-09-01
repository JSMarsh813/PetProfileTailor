import { Menu } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTags,
  faIdCard,
  faCirclePlus,
} from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";

import Link from "next/link";
import { forwardRef } from "react";

const MyLink = forwardRef((props, ref) => {
  let { href, active, children, ...rest } = props;
  return (
    <Link
      href={href}
      ref={ref}
      className={`block rounded-md px-2 py-2 text-md
      hover:bg-blue-500
      hover:text-subtleWhite
      text-center                   
 bg-primary text-subtleWhite
`}
      {...rest}
    >
      {children}
    </Link>
  );
});
MyLink.displayName = "MyLink";

export default function DropDownMenu() {
  return (
    <Menu
      as="div"
      className="relative inline-block text-left text-base z-30"
    >
      <Menu.Button
        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-subtleWhite align-middle
          
         
          hover:border-b-4
         hover:border-subtleWhite
    

          focus:outline-none 
          focus-visible:ring-2 
          focus-visible:ring-white 
          focus-visible:ring-opacity-75"
      >
        <FontAwesomeIcon
          icon={faCirclePlus}
          className="text-base mr-2 font-bold text-subtleWhite "
        />

        <span className="font-bold  text-subtleWhite "> Add </span>
        <ChevronDownIcon
          className="ml-2 -mr-1 h-5 w-5 text-subtleWhite  hover:text-violet-100"
          aria-hidden="true"
        />
      </Menu.Button>

      <Menu.Items
        className="absolute font-bold  text-subtleWhite  right-0 mt-2 w-56 origin-top-right rounded-md bg-primary shadow-lg ring-1 ring-black ring-opacity-5 
          
          focus:outline-none"
      >
        <Menu.Item>
          {({ active }) => (
            <MyLink
              href={`/addnames`}
              active={active}
            >
              <FontAwesomeIcon
                icon={faTags}
                className={`text-base mr-1 
                      
                        
                       "text-violet-100`}
              />
              Names
            </MyLink>
          )}
        </Menu.Item>

        <Menu.Item>
          {({ active }) => (
            <MyLink
              href={`/adddescriptions`}
              active={active}
            >
              <FontAwesomeIcon
                icon={faIdCard}
                className={`text-base mr-1 
                      
                        
                       "text-violet-100`}
              />
              Descriptions
            </MyLink>
          )}
        </Menu.Item>
      </Menu.Items>
    </Menu>
  );
}
