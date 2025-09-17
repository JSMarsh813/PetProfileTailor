"use client";

import { useState, Children, cloneElement } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * SingleOpenGroup
 *
 * Wraps children and ensures only one is open at a time.
 * Animates open/close with a slide-down effect.
 *
 * Props:
 * - children: any JSX elements
 * - externalControl: optional ref to control open child externally
 */
export default function SingleOpenGroup({ children, externalControl }) {
  const [openIndex, setOpenIndex] = useState(null);

  const handleClick = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (externalControl) {
    externalControl.current = handleClick;
  }

  return (
    <>
      {Children.map(children, (child, index) => (
        <div
          key={index}
          className="mb-4"
        >
          {/* clone each child and inject isOpen/onToggle */}
          {cloneElement(child, {
            isOpen: openIndex === index,
            onToggle: () => handleClick(index),
          })}
        </div>
      ))}
    </>
  );
}
