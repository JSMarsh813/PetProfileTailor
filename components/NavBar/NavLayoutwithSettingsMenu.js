import { signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/Link";
// //Special jsx code that allows us to build links. Allows us to keep everything on a single page (makes it a SPA), rather than using a href="page link", which would make us lose any state and require that we get a new file sent from the server

// import Cookies from 'js-cookie';
import React, { useContext, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { Menu } from "@headlessui/react";
import "react-toastify/dist/ReactToastify.css";
// import { Store } from '../utils/Store';
import DropDownLink from "./NavBarPieces/DropDownLink";
import { useRouter } from "next/router";
import { SearchIcon } from "@heroicons/react/outline";
import MobileNavBar from "./NavBarPieces/MobileNavBar/MobileNavBar";
import NavBarNames from "./NavBarPieces/DesktopNavBar/NavBarNames";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBullseye,
  faFaceGrinWink,
  faUserTie,
  faTags,
  faIgloo,
  faLightbulb,
  faIdCard,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";

export default function NavLayoutwithSettingsMenu({
  title,
  children,
  userName,
  profileImage,
}) {
  // const { status, data: session } = useSession();

  // const { state, dispatch } = useContext(Store);
  // const { cart } = state;
  // const [cartItemsCount, setCartItemsCount] = useState(0);
  // useEffect(() => {
  //   setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0));
  // }, [cart.cartItems]);
  // console.log(`this is username ${userName}`)
  const [isHamBurgNavOpen, setisHamBurgNavOpen] = useState(false);

  const logoutClickHandler = () => {
    // Cookies.remove('cart');
    // dispatch({ type: 'CART_RESET' });

    localStorage.removeItem("session");
    signOut({ callbackUrl: "/login" });
  };

  // const [query, setQuery] = useState('');

  // const router = useRouter();
  // const submitHandler = (e) => {
  //   e.preventDefault();
  //   router.push(`/search?query=${query}`);
  // };

  return (
    <>
      {console.log(isHamBurgNavOpen)}
      {/* <Head>
        <title>{title ? title + ' - PetProfileTailor' : 'PetProfileTailor'}</title>
        <meta name="description" content="site to assist with making pet profiles for adoptions" />
        <link rel="icon" href="/favicon.ico" />
      </Head> */}

      {/* <ToastContainer position="bottom-center" limit={1} /> */}

      <div className="flex flex-col justify-between bg-violet-900">
        <header>
          <nav className="flex h-12 items-center px-4 justify-between shadow-md bg-violet-600 ">
            {/* HAMBURGER MENU BUTTON */}

            <Menu
              as="div"
              className="relative inline-block text-white bg-violet-700 z-10 md:hidden"
            >
              {/* md:hidden makes it so the dropdown will be hidden if the screen is enlarged from a small screen. Important because the hamburger button disappears on medium screens */}
              <Menu.Button
                className="inline-flex justify-center md:hidden"
                onClick={() => setisHamBurgNavOpen(!isHamBurgNavOpen)}
              >
                <FontAwesomeIcon
                  icon={faBars}
                  className="text-xl text-violet-100 "
                />
              </Menu.Button>

              {isHamBurgNavOpen && <MobileNavBar />}
            </Menu>

            {/* Name disappears at smaller screen sizes */}

            <Link href="/">
              <a
                className="text-lg font-extrabold text-yellow-300 
              hidden lg:block "
              >
                PetProfileTailor
              </a>
            </Link>

            <NavBarNames />

            <div className="mr-4">
              {/* <Link href="/cart">
                <a className="p-2">
                  Cart
                  {cartItemsCount > 0 && (
                    <span className="ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">
                      {cartItemsCount}
                    </span>
                  )}
                </a>
              </Link> */}

              {userName != "" ? (
                <Menu as="div" className="relative inline-block text-left z-10">
                  <Menu.Button
                    className="inline-flex justify-center px-4 
                  text-yellow-400 
                  
                  border-4 border-transparent 
                  
               
                  hover:border-b-6
                  hover:border-b-yellow-400 
        
                  focus:outline-none 
                  focus-visible:ring-2 
                  focus-visible:ring-white 
                  focus-visible:ring-opacity-75"
                  >
                    <span className="text-lg font-bold"> {userName} </span>

                    <img
                      className="ml-3 h-8 rounded-full inline"
                      src={profileImage}
                    />

                    <ChevronDownIcon
                      className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100"
                      aria-hidden="true"
                    />
                  </Menu.Button>

                  <Menu.Items className="absolute right-0 w-56 origin-top-right bg-violet-800 text-white shadow-lg ">
                    <Menu.Item
                      className="group flex w-full items-center rounded-md px-2 py-2 text-md
                        // above code =items show on top of eachother 

                  hover:bg-yellow-400
                  hover:text-violet-900"
                    >
                      <DropDownLink className="dropdown-link" href="/dashboard">
                        Dashboard
                      </DropDownLink>
                    </Menu.Item>

                    <Menu.Item
                      className="group flex w-full items-center rounded-md px-2 py-2 text-md
                        // above code =items show on top of eachother 
                        
                      hover:bg-yellow-400
                      hover:text-violet-900"
                    >
                      <DropDownLink
                        className="dropdown-link"
                        href="/editsettings"
                      >
                        Edit Settings
                      </DropDownLink>
                    </Menu.Item>

                    <Menu.Item
                      className="group flex w-full items-center rounded-md px-2 py-2 text-md
                        // above code =items show on top of eachother 

                  hover:bg-yellow-400
                  hover:text-violet-900"
                    >
                      <a
                        className="dropdown-link"
                        href="#"
                        onClick={logoutClickHandler}
                      >
                        Logout
                      </a>
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              ) : (
                <Menu as="div" className="relative inline-block text-left z-10">
                  <Menu.Button
                    className="inline-flex justify-center rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white
                text-yellow-400 font-extrabold
                
                border-4 border-transparent 
                
                hover:bg-opacity-30 hover:border-b-yellow-400

                focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                  >
                    <Link href="/login">login</Link>
                  </Menu.Button>
                </Menu>
              )}
            </div>
          </nav>
        </header>
        <main className="container m-auto mt-4 px-4 ">{children}</main>
      </div>
    </>
  );
}
