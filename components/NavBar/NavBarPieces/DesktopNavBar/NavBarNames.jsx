import { Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import AddItemsDropDownMenu from "./AddItemsDropDownMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTags, faIgloo, faIdCard } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";
import NavBarLink from "../NavBarLink";

//onclick wrapped in spans due to this error https://github.com/vercel/next.js/discussions/39212

const NavBarNames = () => {
  return (
    <div className="divWhichHasBothMenus">
      {/* DESKTOP MENU */}

      <section className="hidden xl:flex desktop-menu ">
        <ul className="">
          <NavBarLink href="/">
            <FontAwesomeIcon
              icon={faIgloo}
              className="text-xl mr-1 text-white"
            />
            Home
          </NavBarLink>

          <NavBarLink href="/fetchnames">
            <FontAwesomeIcon
              icon={faTags}
              className="text-xl mr-1 text-white"
            />
            Fetch Names
          </NavBarLink>

          <NavBarLink href="/fetchdescriptions">
            <FontAwesomeIcon
              icon={faIdCard}
              className="text-xl mr-1 text-white"
            />
            Fetch Descriptions
          </NavBarLink>

          <AddItemsDropDownMenu />

          <NavBarLink href="/batsignal">
            <img
              className="h-5 inline-block invert"
              src="/batsignal.png"
              alt="cute white bat logo"
              layout="responsive"
            />
            Community
          </NavBarLink>

          {/* <NavBarLink href="/batsignal">
            <img
              className="h-6 inline-block invert mr-1"
              src="/noun-robot-dog.png"
              alt="cute white bat logo"
              layout="responsive"
            />
            Ask Byte
          </NavBarLink> */}
          {/* robot dog by Amethyst Studio from <a href="https://thenounproject.com/browse/icons/term/robot-dog/" target="_blank" title="robot dog Icons">Noun Project</a> */}
        </ul>
      </section>
    </div>
  );
};

export default NavBarNames;
