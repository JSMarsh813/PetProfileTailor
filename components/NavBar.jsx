import Link from 'next/Link'
//Special jsx code that allows us to build links. Allows us to keep everything on a single page (makes it a SPA), rather than using a href="page link", which would make us lose any state and require that we get a new file sent from the server
import NavBarNames from "./NavBarPieces/NavBarNames"
import SettingsNav from "./NavBarPieces/SettingsNav"
import SearchBar from "./NavBarPieces/SearchBar"

//needed to link pages, quicker loading between pages

const NavBar= () =>{

return (
<div className="navbar bg-violet-900 text-white">

  <div className="flex-1">
            <Link href="/" className="btn btn-ghost text-xl inline">PetProfileTailor</Link>
  </div>

 {/* Small+medium Screens: Hamburger dropdown for main nav */}

  <div className="navbar-start">
    <div className="dropdown">
      <label tabIndex={0} className="btn btn-ghost lg:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
      </label>
      <NavBarNames tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"/>
    </div>

  </div>

{/*Large Screens: nav bar labels when the screen is large enough */}
  <div className="navbar-center hidden lg:flex">
            <NavBarNames className="menu menu-horizontal p-0"/>
  </div>

{/* SearchBar  */}

    <SearchBar/>

{/* Start of dropdown for setting options ect by clicking profile image  */}
  
   <SettingsNav/>

 
</div>
)
}

export default NavBar






