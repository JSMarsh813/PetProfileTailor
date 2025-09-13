"use client";

import Link from "next/link";
import { forwardRef } from "react";

const LinkMenu = forwardRef(
  ({ href, focus, children, className = "", ...rest }, ref) => {
    return (
      <Link
        href={href}
        legacyBehavior
        passHref
        {...rest}
      >
        <a
          ref={ref}
          className={`flex items-center px-4 py-2 text-sm text-subtleWhite ${
            focus ? "bg-white/10 text-subtleWhite" : ""
          }`}
        >
          {children}
        </a>
      </Link>
    );
  },
);

LinkMenu.displayName = "LinkMenu"; // optional, helps with DevTools

// When you wrap a component in forwardRef, React will default its name to "ForwardRef" in DevTools. So this is making sure it will appear as LinkMenu instead. Helps with debugging

export default LinkMenu;
