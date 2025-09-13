"use client";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import LinkMenu from "../../LinkMenu";

export default function DropDownMenu() {
  const MenuItemsStyling =
    "absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-primary shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none";

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
            {({ focus }) => (
              <LinkMenu
                href="/addnames"
                focus={focus}
              >
                Names
              </LinkMenu>
            )}
          </MenuItem>

          <MenuItem>
            {({ focus }) => (
              //<a> is a real DOM element, so Headless UI can attach refs for keyboard focus.

              <LinkMenu
                href="/adddescriptions"
                focus={focus}
              >
                Description
              </LinkMenu>
            )}
          </MenuItem>
        </div>
      </MenuItems>
    </Menu>
  );
}
