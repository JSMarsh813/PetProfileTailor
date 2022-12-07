import '../styles/globals.css'
import NavBar from '../components/NavBar'

//allows us to repeat the layout on every page, versus manually adding the footer header ect to every page

function MyApp({ Component, pageProps }) {
  return (
    <div style={{fontFamily:'Comfortaa'}}>
     <NavBar/>
      <Component {...pageProps} />

    </div>
 
  );
}

export default MyApp;
