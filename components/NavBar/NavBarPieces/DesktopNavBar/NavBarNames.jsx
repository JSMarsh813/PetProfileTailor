import { Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import AddItemsDropDownMenu from "./AddItemsDropDownMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTags, faIgloo, faIdCard } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";
import Link from "next/Link";

//onclick wrapped in spans due to this error https://github.com/vercel/next.js/discussions/39212

const NavBarNames = () => {
  return (
    <div className="divWhichHasBothMenus">
      {/* DESKTOP MENU */}

      <section className="hidden md:flex desktop-menu ">
        <Menu
          as="div"
          className="inline-block text-left"
        >
          <span>
            <Link href="/">
              <Menu.Button
                className="inline-flex px-4 py-2 text-sm font-bold text-white 

border-4 border-transparent border-r-violet-400 

hover:bg-opacity-30 
hover:border-b-4
hover:border-b-yellow-400 

focus:outline-none 
focus-visible:ring-2 
focus-visible:ring-white 
focus-visible:ring-opacity-75"
              >
                <FontAwesomeIcon
                  icon={faIgloo}
                  className="text-xl mr-1 text-white"
                />

                <a>Home</a>
              </Menu.Button>
            </Link>
          </span>
        </Menu>

        <Menu
          as="div"
          className="relative inline-block text-left"
        >
          <span>
            <Link href="/fetchnames">
              <Menu.Button
                className="inline-flex px-4 py-2 text-sm font-bold  text-white 

border-4 border-transparent border-r-violet-400 

hover:bg-opacity-30 
hover:border-b-4
hover:border-b-yellow-400 

focus:outline-none 
focus-visible:ring-2 
focus-visible:ring-white 
focus-visible:ring-opacity-75"
              >
                <FontAwesomeIcon
                  icon={faTags}
                  className="text-xl mr-2 text-white"
                />

                <a>Fetch Names</a>
              </Menu.Button>
            </Link>
          </span>
        </Menu>

        <Menu
          as="div"
          className="relative inline-block text-left"
        >
          <span>
            <Link href="/fetchdescriptions">
              <Menu.Button
                className="inline-flex px-4 py-2 text-sm font-bold text-white 

border-4 border-transparent border-r-violet-400 

hover:bg-opacity-30 
hover:border-b-4
hover:border-b-yellow-400 

focus:outline-none 
focus-visible:ring-2 
focus-visible:ring-white 
focus-visible:ring-opacity-75"
              >
                <FontAwesomeIcon
                  icon={faIdCard}
                  className="text-xl mr-1 text-white"
                />
                <a> Fetch Descriptions</a>
              </Menu.Button>
            </Link>
          </span>
        </Menu>

        <Menu
          as="div"
          className="relative inline-block text-left"
        >
          <span>
            <Link href="/batsignal">
              <Menu.Button
                className="inline-flex px-4 py-2 text-sm font-bold text-white ml-8

border-4 border-transparent border-r-violet-400 

hover:bg-opacity-30 
hover:border-b-4
hover:border-b-yellow-400 

focus:outline-none 
focus-visible:ring-2 
focus-visible:ring-white 
focus-visible:ring-opacity-75"
              >
                <img
                  className="h-16 inline-block absolute -bottom-3 -left-1 invert"
                  src="/batsignal.png"
                  alt="bat logo, created by Megan Mitchell from Noun Project"
                />
                <a> BatSignal/ PlayYard</a>
              </Menu.Button>
            </Link>
          </span>
        </Menu>

        <AddItemsDropDownMenu />
      </section>
    </div>
  );
};

export default NavBarNames;
