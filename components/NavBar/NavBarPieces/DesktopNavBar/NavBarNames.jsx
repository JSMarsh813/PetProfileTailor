import { Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import AddItemsDropDownMenu from "./AddItemsDropDownMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTags, faIgloo, faIdCard } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";
import NavBarLink from "../NavBarLink";
import Image from "next/image";

//onclick wrapped in spans due to this error https://github.com/vercel/next.js/discussions/39212

const NavBarNames = () => {
  return (
    <div className="divWhichHasBothMenus">
      {/* DESKTOP MENU */}

      <section className="hidden lg:flex desktop-menu ">
        <ul className="">
          <NavBarLink
            href="/"
            className=""
          >
            <FontAwesomeIcon
              icon={faIgloo}
              className="text-base mr-1 text-white"
            />
            Home
          </NavBarLink>

          <NavBarLink href="/fetchnames">
            <FontAwesomeIcon
              icon={faTags}
              className="text-base mr-1 text-white"
            />
            Names
          </NavBarLink>

          <NavBarLink href="/fetchdescriptions">
            <FontAwesomeIcon
              icon={faIdCard}
              className="text-base mr-1 text-white"
            />
            Descriptions
          </NavBarLink>

          <AddItemsDropDownMenu />
        </ul>
      </section>
    </div>
  );
};

export default NavBarNames;
