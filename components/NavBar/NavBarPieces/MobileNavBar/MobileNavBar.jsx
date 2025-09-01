import React from "react";
import { Menu } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTags, faIgloo, faIdCard } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { forwardRef } from "react";
import Link from "next/link";
import Image from "next/image";

const MyLink = forwardRef((props, ref) => {
  let { href, active, children, ...rest } = props;
  return (
    <Link
      href={href}
      ref={ref}
      className={`block rounded-md px-2 py-2 text-md
      hover:bg-subtleWhite
      hover:text-darkPurple
      border-none
      text-center                   
 
`}
      {...rest}
    >
      {children}
    </Link>
  );
});
MyLink.displayName = "MyLink";

function MobileNavBar() {
  return (
    <div>
      <Menu.Items
        className="block text-sm text-subtleWhite 
        absolute  
 divide-y divide-gray-100 
 rounded-md bg-primary shadow-lg ring-1 ring-black ring-opacity-5 
 border-subtleWhite border-b

 
 w-screen
 items-center

-left-2
z-10

focus:outline-none 
focus-visible:ring-2 
focus-visible:ring-white 
focus-visible:ring-opacity-75"
      >
        <Menu.Item>
          {({ active }) => (
            <MyLink
              href={`/`}
              active={active}
            >
              <FontAwesomeIcon
                icon={faIgloo}
                className={`text-xl mr-1 
                      
                        
                        ${active ? "text-violet-800" : "text-violet-100"}`}
              />
              Home
            </MyLink>
          )}
        </Menu.Item>

        <Menu.Item
          disabled
          className="border-none"
        >
          <button
            className="text-subtleWhite     
                      w-full items-center rounded-md px-2 py-2 text-sm font-bold bg-darkPurple  "
            disabled={true}
          >
            Fetch/Find
          </button>
        </Menu.Item>

        <Menu.Item>
          {({ active }) => (
            <MyLink
              href={`/fetchnames`}
              active={active}
            >
              <FontAwesomeIcon
                icon={faTags}
                className={`text-xl mr-1 
                      
                        
                        ${active ? "text-violet-800" : "text-violet-100"}`}
              />
              Names
            </MyLink>
          )}
        </Menu.Item>

        <Menu.Item>
          {({ active }) => (
            <MyLink
              href={`/fetchdescriptions`}
              active={active}
            >
              <FontAwesomeIcon
                icon={faIdCard}
                className={`text-xl mr-1 
                      
                        
                        ${active ? "text-violet-800" : "text-violet-100"}`}
              />
              Descriptions
            </MyLink>
          )}
        </Menu.Item>

        <Menu.Item
          disabled
          className="border-none"
        >
          <button
            className="text-subtleWhite 
                      bg-darkPurple  
                      w-full items-center rounded-md px-2 py-2 text-sm font-bold"
            disabled={true}
          >
            Add
          </button>
        </Menu.Item>

        <Menu.Item>
          {({ active }) => (
            <MyLink
              href={`/addnames`}
              active={active}
            >
              <FontAwesomeIcon
                icon={faTags}
                className={`text-xl mr-1 
                      
                        
                        ${active ? "text-violet-800" : "text-violet-100"}`}
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
                className={`text-xl mr-1 
                      
                        
                        ${active ? "text-violet-800" : "text-violet-100"}`}
              />
              Descriptions
            </MyLink>
          )}
        </Menu.Item>
      </Menu.Items>
    </div>
  );
}

export default MobileNavBar;
