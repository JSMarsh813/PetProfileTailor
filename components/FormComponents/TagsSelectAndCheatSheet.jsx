import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import Select from "react-select";
import { useMemo } from "react";
import { useTags } from "../../hooks/useTags";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaw } from "@fortawesome/free-solid-svg-icons";

export default function TagsSelectAndCheatSheet({ categoriesWithTags }) {
  // ######## Logic for when tags Change ###############

  const { tagsToSubmit, handleSelectChange, handleCheckboxChange } = useTags();

  const tagList = useMemo(() => {
    return categoriesWithTags.flatMap((cat) =>
      cat.tags.map((tag) => ({ label: tag.tag, value: tag._id, key: tag._id })),
    );
    // added key here for consistency with checkbox input
  }, [categoriesWithTags]);

  return (
    <div
      className={`h-fit w-fit bg-darkPurple border-b-2  border-solid border-subtleWhite rounded-box place-items-center py-2`}
    >
      {/* mapping through categories ex: gender, holidays */}

      <label
        className="font-bold block mt-4 text-subtleWhite"
        htmlFor="nameTags"
      >
        Tags
      </label>
      <Select
        unstyled
        className="text-subtleWhite border border-subtleWhite bg-darkPurple w-[96%] mx-auto"
        // className styles the input
        // styles is needed to style the dropdown
        styles={{
          menu: (provided, state) => ({
            ...provided,
            backgroundColor: "rgb(20 2 35)", // dark purple
            color: "rgb(221 214 254)",
            borderRadius: "0.5rem", // optional rounding
          }),
          option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused
              ? "#2563EB" // Tailwind bg-blue-600 on hover
              : "rgb(20 2 35)", // dark purple
            color: "rgb(221 214 254)", //subtle white
            cursor: state.isDisabled ? "not-allowed" : "pointer",
          }),
        }}
        id="nameTags"
        options={tagList}
        value={tagsToSubmit}
        isMulti
        isSearchable
        placeholder="If you type in the tags field, it will filter the tags"
        onChange={handleSelectChange}
      />
      <p className="my-4 text-subtleWhite"> Or use the tags cheet sheet </p>

      {categoriesWithTags.map((category, index) => {
        return (
          <Disclosure
            key={category._id}
            as="div"
            className="inline-block align-top mb-6"
          >
            {/* https://github.com/tailwindlabs/headlessui/issues/3351 as div needed as a workaround for the headlessui bug "Invalid prop data-headlessui-state supplied to React.Fragment. React.Fragment can only have key and children props." */}
            {/* defaultOpen will have the disclosure stay open*/}
            {({ open }) => (
              <>
                {/* Category name */}
                <Disclosure.Button
                  className="flex justify-between  w-[306px] border-t-2 border-subtleWhite bg-primary px-2 py-2 text-base font-medium text-subtleWhite
                 hover:bg-blue-100  hover:text-blue-900 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75 "
                >
                  <span className="mx-auto">{category.category} </span>
                  <ChevronUpIcon
                    className={`${
                      open ? "rotate-180 transform" : ""
                    } h-5 w-5 text-blue-200`}
                  />
                </Disclosure.Button>

                <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-subtleWhite">
                  <div className="space-y-6 mb-4">
                    {/* mapping through category options and assigning them a button (ex: male, female, unisex)*/}

                    {category.tags.map((option, index) => (
                      <label
                        key={option._id}
                        className="flex items-center space-x-2 cursor-pointer hover:bg-blue-700 px-1 py-1 rounded"
                      >
                        {/* adds a checkbox*/}
                        <input
                          id={option._id}
                          name={`${option.tag}`}
                          value={option.tag}
                          type="checkbox"
                          onChange={(e) =>
                            handleCheckboxChange({
                              id: option._id,
                              value: option.tag,
                              checked: e.target.checked,
                            })
                          }
                          className="peer hidden"
                          checked={tagsToSubmit.some((tag) => {
                            const isMatch = tag.value === option._id;
                            console.log(
                              "tag.value === option._id",
                              `${tag.value} === ${option._id}`,
                              isMatch,
                            );
                            return isMatch;
                          })}
                        />

                        {/* Custom check box */}
                        <span
                          className="
   border-2 border-violet-300 rounded flex items-center justify-center
    bg-darkPurple
    peer-checked:bg-yellow-300     
    p-[7px]
    peer-checked:text-darkPurple
    text-subtleWhite
    transition-colors duration-200
  "
                        >
                          {/* Paw icon */}
                          <FontAwesomeIcon icon={faPaw} />
                        </span>

                        {/* shows the actual description (male, female, unisex ect for gender) */}
                        <span className="text-subtleWhite">{option.tag}</span>
                      </label>
                    ))}
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        );
      })}
    </div>
  );
}
