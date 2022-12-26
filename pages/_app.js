import '../styles/globals.css'
import NavBar from '../components/NavBar'
import { SessionProvider, useSession } from 'next-auth/react';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

//allows us to repeat the layout on every page, versus manually adding the footer header ect to every page

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
// By wrapping our component in a Session``Provider, we enable session state to be shared between pages. This, in turn, will preserve our state during page navigation, improve performance, and reduce network traffic.

export default MyApp;
