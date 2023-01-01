import '../styles/globals.css'
import { SessionProvider, useSession } from 'next-auth/react';
import { useState, createContext, useContext } from 'react';
// import { UserSession } from '@context/user';

// import { unstable_getServerSession } from "next-auth/next"
// import { authOptions } from "../pages/api/auth/[...nextauth]"

// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

//allows us to repeat the layout on every page, versus manually adding the footer header ect to every page

// import { UserSessionContext, UserContextProvider } from "../src/context/UserState"



function MyApp({ 

  Component, 
  pageProps: { session, ...pageProps }



}) {
  return (
    

  
    <SessionProvider session={session}>
     <Component {...pageProps} />
    </SessionProvider>
    
    
  ); 
}

// <UserContextProvider>
// </UserContextProvider>

// By wrapping our component in a Session``Provider, we enable session state to be shared between pages. This, in turn, will preserve our state during page navigation, improve performance, and reduce network traffic.

export default MyApp;
