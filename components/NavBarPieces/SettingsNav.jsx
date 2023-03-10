import { signOut, useSession } from 'next-auth/react';
import Link from 'next/Link'


const SettingsNav = ({dropdownSettings, className}) => {
const { status, data: session } = useSession();
    return (


        <div className="dropdown dropdown-end">
        <label tabIndex={0} className="btn btn-ghost btn-circle avatar">

          <div className="w-10 rounded-full">
            <img src="https://placeimg.com/80/80/people" />
          </div>
          
        </label>
        {status === 'loading'||status ===null ? (
                'Loading'
              ) : session?.user ? (
        <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
          <li>
            <a className="justify-between">
              Profile
              <span className="badge">New</span>
            </a>
          </li>
          <li><a>Settings</a></li>
          <li><a>Logout</a></li>
        </ul>): (  <Link href="/login">
                  <a className="p-2">Login</a>
                </Link>
              )}
      </div>

    )
}

export default SettingsNav