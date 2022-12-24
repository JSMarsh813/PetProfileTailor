import { signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/Link'
// import Cookies from 'js-cookie';
import React, { useContext, useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { Menu } from '@headlessui/react';
import 'react-toastify/dist/ReactToastify.css';
// import { Store } from '../utils/Store';
import DropdownLink from './DropdownLink';
import { useRouter } from 'next/router';
import { SearchIcon } from '@heroicons/react/outline';

export default function Layout({ title, children }) {
  const { status, data: session } = useSession();

//   const { state, dispatch } = useContext(Store);

  const logoutClickHandler = () => {
    // Cookies.remove('cart');
    // dispatch({ type: 'CART_RESET' });
    signOut({ callbackUrl: '/login' });
  };

  const [query, setQuery] = useState('');

  const router = useRouter();
//   const submitHandler = (e) => {
//     e.preventDefault();
//     router.push(`/search?query=${query}`);
//   };

  return (
    <>
     

      <ToastContainer position="bottom-center" limit={1} />

      <div className="flex min-h-screen flex-col justify-between ">
        <header>
          <nav className="flex h-12 items-center px-4 justify-between shadow-md">
            {/* if the user is signed in show full nav, otherwise show login button */}
            
            <div>
            
              {status === 'loading' ? (
                'Loading'
              ) : session?.user ? (
                <Menu as="div" className="relative inline-block">

                  <Menu.Button className="text-blue-600">
                    {session.user.name}
                  </Menu.Button>

                  <Menu.Items className="absolute w-56 origin-top-right bg-white  shadow-lg ">
                       <Menu.Item>
                            <DropdownLink className="dropdown-link" href="/profile">
                        Profile
                           </DropdownLink>
                       </Menu.Item>


                        <Menu.Item>
                      <DropdownLink
                        className="dropdown-link"
                        href="/order-history"
                      >
                        Order History
                      </DropdownLink>
                       </Menu.Item>
                  
                        <Menu.Item>
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
                <Link href="/login">
                  <a className="p-2">Login</a>
                </Link>
              )}
            </div>
          </nav>
        </header>
        <main className="container m-auto mt-4 px-4">{children}</main>
            {/* if deleted, will not see login form anymore */}
      </div>
    </>
  );
}
