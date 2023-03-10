import '../styles/globals.css'
import NavBar from '../components/NavBar'
import { SessionProvider } from 'next-auth/react';

//allows us to repeat the layout on every page, versus manually adding the footer header ect to every page

function MyApp({ Component, pageProps: {session, ...pageProps} }) {
  return (
    <SessionProvider session={session} refetchInterval={5*60}>
    <div style={{fontFamily:'Comfortaa'}}>
     <NavBar/>
      <Component {...pageProps} />

    </div>
    </SessionProvider>
 
  );
}

export default MyApp;
