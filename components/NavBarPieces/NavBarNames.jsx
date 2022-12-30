import Link from 'next/Link'
import { Menu } from '@headlessui/react';
import DropDownMenu from '../NavBarPieces/dropdownmenu'
// https://headlessui.com/react/menu
const NavBarNames = ({className}) => {

    return (
      <ul className="flex items-center text-white" >
        <li><Link href='/'><a>Home</a></Link> </li>
        <li> <Link href='/names'><a>Search Names</a></Link></li>
        <li> <Link href='/behavior'><a>Search Descriptions</a></Link></li>
        <DropDownMenu/>
    </ul>
    )


}

export default NavBarNames