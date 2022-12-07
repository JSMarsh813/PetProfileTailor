import Link from 'next/Link'


const NavBarNames = ({className}) => {

    return (
      <ul className={className}>
        <li><Link href='/'><a>Home</a></Link> </li>
        <li> <Link href='/names'><a>Search Names</a></Link></li>
        <li> <Link href='/behavior'><a>Search Descriptions</a></Link></li>
        
        <li tabIndex={0}>
          <a>
            Add
            <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
          </a>
          <ul className="p-2">
            <li><a>Names</a></li>
            <li><a>Descriptions</a></li>
            <li><a>Inspirational Examples</a></li>
           
          </ul>
        </li>
     
    </ul>
    )


}

export default NavBarNames