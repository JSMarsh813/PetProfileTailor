import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import Link from "next/link";

export default function DropDownMenu() {
  return (
    <Menu
      as="div"
      className="relative inline-block text-left z-30"
    >
      <MenuButton className="inline-flex justify-center px-4 py-2 text-sm font-medium text-subtleWhite hover:border-b-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
        Add
        <ChevronDownIcon
          aria-hidden="true"
          className="-mr-1 size-5 text-subtleWhite"
        />
      </MenuButton>

      {/* You cannot just use MenuItem as={Link}, because <Link> is a React component, not a DOM element. Headless UI needs a real DOM element for ref. */}
      <MenuItems className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-primary shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className="py-1 flex flex-col">
          <MenuItem>
            {({ active }) => (
              <a
                href="/addnames" // use href on <a> not Link. It is a real DOM element, so Headless UI can attach refs for keyboard focus.
                className={`block px-4 py-2 text-sm text-gray-300 ${
                  active ? "bg-white/10 text-white" : ""
                }`}
              >
                <Link
                  href="/addnames"
                  legacyBehavior
                  passHref
                >
                  <span>Names</span>
                </Link>
              </a>
            )}
          </MenuItem>

          <MenuItem>
            {({ active }) => (
              //<a> is a real DOM element, so Headless UI can attach refs for keyboard focus.
              <a
                href="/adddescriptions"
                className={`block px-4 py-2 text-sm text-gray-300 ${
                  active ? "bg-white/10 text-white" : ""
                }`}
              >
                <Link
                  href="/adddescriptions"
                  legacyBehavior
                  passHref
                >
                  <span>Descriptions</span>
                </Link>
              </a>
            )}
          </MenuItem>
        </div>
      </MenuItems>
    </Menu>
  );
}
