import '../styles/globals.css'
import { SessionProvider, useSession, getSession } from 'next-auth/react';

import '@etchteam/next-pagination/dist/index.css'

import { useState, createContext, useContext } from 'react';
// import { UserSession } from '@context/user';

// import { unstable_getServerSession } from "next-auth/next"
// import { authOptions } from "../pages/api/auth/[...nextauth]"

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//allows us to repeat the layout on every page, versus manually adding the footer header ect to every page

// import { UserSessionContext, UserContextProvider } from "../src/context/UserState"
import UserSessionContext from '../src/context/UserSessionContext';
// import { useCookies } from "react-cookie";


// export async function getServerSideProps(ctx) {
//   return {
//     props: {
//       session: await getSession(ctx)
//     }
//   }
// }

function MyApp({ 

  Component, 
  pageProps: { session, ...pageProps }

 
})
{

  // const [userCookies, setCookie] = useCookies(["user"]);
  // console.log(`this is a cookie: ${JSON.stringify(userCookies)}`)
 
  let testingContext="if context works I'll show up! :)"
  //setting up the prop for UserSessionContext, grabbing session information
            //???????

  return (
    

 
    <SessionProvider session={session}
                      limit={1}>

          {/* <UserSessionContext.Provider value={JSON.stringify(userCookies)}>  */}

              {/* Every Context object comes with a Provider React component

              The Provider component accepts a value prop to be passed to consuming components that are descendants of this Provider,
              
              in this case ALL components */}
                <Component {...pageProps} />
        {/* </UserSessionContext.Provider> */}
        <ToastContainer />
        <footer className="text-white py-4 px-4 bg-darkPurple border-t-2 border-violet-400 mt-4">
          <h6> Credits: </h6>
              <span className="ml-6"> “Bat” icon by Megan Mitchell, from thenounproject.com.</span>
                  </footer>
    </SessionProvider>
    

    
  ); 
}

// <UserContextProvider>
// </UserContextProvider>

// By wrapping our component in a Session``Provider, we enable session state to be shared between pages. This, in turn, will preserve our state during page navigation, improve performance, and reduce network traffic.

export default MyApp;
