import { Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import AddItemsDropDownMenu from "./AddItemsDropDownMenu";

import "@fortawesome/fontawesome-svg-core/styles.css";
import NavBarLink from "../NavBarLink";

//onclick wrapped in spans due to this error https://github.com/vercel/next.js/discussions/39212

const NavBarNames = () => {
  return (
    <div className="divWhichHasBothMenus w-full">
      {/* DESKTOP MENU */}

      <section className="hidden lg:flex desktop-menu ">
        <ul className="flex justify-around w-full max-w-3xl mx-auto ">
          {/* w-full is needed for it to stretch, and then max-w-5xl limits it */}
          <NavBarLink
            href="/"
            className=""
          >
            Home
          </NavBarLink>

          <NavBarLink href="/fetchnames">Names</NavBarLink>

          <NavBarLink href="/fetchdescriptions">Descriptions</NavBarLink>

          <AddItemsDropDownMenu />
        </ul>
      </section>
    </div>
  );
};

export default NavBarNames;
