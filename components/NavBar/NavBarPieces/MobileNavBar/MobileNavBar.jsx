import React from "react";
import { Menu, Transition } from "@headlessui/react";
import Link from "next/Link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTags,
  faIgloo,
  faLightbulb,
  faIdCard,
} from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";

function MobileNavBar() {
  return (
    <div>
      <Menu.Items
        className="block px-4 py-2 text-sm font-medium text-white 
 absolute  divide-y divide-gray-100 rounded-md bg-violet-800 shadow-lg ring-1 ring-black ring-opacity-5 

 
 w-screen
border-4 border-transparent border-r-violet-400 
-left-4
z-10

focus:outline-none 
focus-visible:ring-2 
focus-visible:ring-white 
focus-visible:ring-opacity-75"
      >
        <Menu.Item as="div">
          <Link href="/">
            <button
              className="
                 hover:bg-yellow-500 
                 hover:text-violet-900

                 text-white             
                 w-full items-center rounded-md px-2 py-2 text-sm"
            >
              <FontAwesomeIcon
                icon={faIgloo}
                className="text-xl mr-1 
                 text-violet-100
                "
              />

              <a>Home</a>
            </button>
          </Link>
        </Menu.Item>

        <Menu.Item as="div">
          <button
            className="text-yellow-300         
                      w-full items-center rounded-md px-2 py-2 text-sm font-bold bg-violet-600"
            disabled={true}
          >
            {" "}
            Fetch/Find{" "}
          </button>
        </Menu.Item>

        <Menu.Item as="div">
          <Link href="/addnames">
            <button
              className="
                      hover:bg-yellow-500 
                      hover:text-violet-900

                      text-white             
                      w-full items-center rounded-md px-2 py-2 text-sm"
            >
              <FontAwesomeIcon
                icon={faTags}
                className="text-xl mr-1 
                      text-violet-100
                     "
              />

              <a> Names</a>
            </button>
          </Link>
        </Menu.Item>

        <Menu.Item as="div">
          <Link href="/adddescriptions">
            <button
              className="
                      hover:bg-yellow-500 
                      hover:text-violet-900

                      text-white             
                       w-full items-center rounded-md px-2 py-2 text-sm"
            >
              <FontAwesomeIcon
                icon={faIdCard}
                className="text-xl mr-1 
                      text-violet-100
                     "
              />

              <a> Descriptions </a>
            </button>
          </Link>
        </Menu.Item>

        <button
          className="text-yellow-300  
                      bg-violet-600       
                      w-full items-center rounded-md px-2 py-2 text-sm font-bold"
          disabled={true}
        >
          Add
        </button>

        <Menu.Item as="div">
          <Link href="/addnames">
            <button
              className="
                      hover:bg-yellow-500 
                      hover:text-violet-900

                      text-white             
                      w-full items-center rounded-md px-2 py-2 text-sm"
            >
              <FontAwesomeIcon
                icon={faTags}
                className="text-xl mr-1 
                      text-violet-100
                     "
              />

              <a> Names</a>
            </button>
          </Link>
        </Menu.Item>

        <Menu.Item as="div">
          <Link href="/adddescriptions">
            <button
              className="
                 hover:bg-yellow-500 
                 hover:text-violet-900

                 text-white             
                 w-full items-center rounded-md px-2 py-2 text-sm"
            >
              <FontAwesomeIcon
                icon={faIdCard}
                className="text-xl mr-1 
                 text-violet-100
                "
              />

              <a> Descriptions </a>
            </button>
          </Link>
        </Menu.Item>

        <button
          className="text-yellow-300  
                      bg-violet-600       
                      w-full items-center rounded-md px-2 py-2 text-sm font-bold"
          disabled={true}
        >
          Community
        </button>

        <Menu.Item as="div">
          <Link href="/">
            <button
              className="
                 hover:bg-yellow-500 
                 hover:text-violet-900
                 -mt-3

                 text-white             
                 w-full items-center rounded-md px-2 py-2 text-sm"
            >
              <img
                className="h-12 inline-block invert"
                src="/batsignal.png"
                alt="bat logo, created by Megan Mitchell from Noun Project"
              />

              <a>Batsignal/ Play Yard</a>
            </button>
          </Link>
        </Menu.Item>
      </Menu.Items>
    </div>
  );
}

export default MobileNavBar;
