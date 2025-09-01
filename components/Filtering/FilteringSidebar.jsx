import { useState, useRef } from "react";
import { Button, Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import GeneralButton from "../ReusableSmallComponents/buttons/GeneralButton";
import { ButtonGroup } from "@mui/material";

function FilteringSidebar({
  category,
  handleFilterChange,
  handleApplyFilters,
  filterTagsIds,
  toggleDrawer,
  isLoading,
  remainingFilterCooldown,
  startCooldown,
}) {
  const onApplyClick = () => {
    if (remainingFilterCooldown > 0 || isLoading) return;

    handleApplyFilters();
  };

  return (
    <div className="flex flex-col h-full bg-primary w-96">
      <div className="flex justify-between text-xl my-3 border-b border-white pb-3">
        <h4 className="text-white text-center  pl-4 ">All Filters </h4>
        <button
          className="text-center text-white pr-5 hover:text-slate-400 rounded-full"
          onClick={() => toggleDrawer(false)}
        >
          {" "}
          X{" "}
        </button>
      </div>

      {/* scrollable content */}
      <div className="flex-1 overflow-y-auto px-2">
        {/* mapping through categories ex: gender, holidays */}
        {category.map((category, index) => {
          return (
            <Disclosure key={category._id}>
              {/* defaultOpen will have the disclosure stay open*/}
              {({ open }) => (
                <>
                  {/* Category Name shows here ("species", "food") */}
                  <Disclosure.Button
                    className="flex w-full justify-between bg-primary px-2 py-2 text-left text-base font-medium text-white
                 hover:text-slate-400   focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75 "
                  >
                    <div>
                      <span>{category.category} </span>
                      <span className="block flex-none text-sm text-slate-300">
                        {" "}
                        {category.tags
                          .filter((tag) => filterTagsIds.includes(tag._id))
                          .map((tag) => tag.tag)
                          .join(", ")}
                      </span>
                    </div>
                    <ChevronUpIcon
                      className={`${
                        open ? "rotate-180 transform" : ""
                      } h-5 w-5 text-white`}
                    />
                  </Disclosure.Button>

                  <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                    <div className="space-y-6 ">
                      {/* mapping through category options and assigning them a button (ex: male, female, unisex)*/}

                      {category.tags.map((option, index) => (
                        <div
                          key={option._id}
                          className="flex items-center group px-2"
                        >
                          {/* adds a checkbox*/}
                          <input
                            id={`filter-mobile-${index}`}
                            name={`${option.tag}[]`}
                            value={option._id}
                            type="checkbox"
                            onChange={handleFilterChange}
                            className="h-4 w-4 rounded border-violet-300 text-amber-300 focus:ring-amber-600  group-hover:bg-slate-400"
                            checked={filterTagsIds.includes(option._id)}
                          />

                          {/* shows the actual description (male, female, unisex ect for gender) */}
                          <label
                            htmlFor={`filter-mobile-${option.tag}-${option.tag}`}
                            className="ml-3 min-w-0 flex-1 text-base text-violet-100 group-hover:text-slate-400  "
                          >
                            {option.tag}
                          </label>
                        </div>
                      ))}
                    </div>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          );
        })}
      </div>
      <div className="flex justify-evenly p-4 border-t border-white bg-primary">
        <GeneralButton
          text={
            remainingFilterCooldown
              ? `wait ${remainingFilterCooldown} secs`
              : "apply"
          }
          className="text-center"
          onClick={() => onApplyClick()}
          disabled={isLoading || remainingFilterCooldown}
        />
        <GeneralButton
          text="reset"
          active
          className="text-center bg-white"
          onClick={() => handleApplyFilters("reset")}
          disabled={isLoading}
        />
      </div>
    </div>
  );
}

export default FilteringSidebar;
